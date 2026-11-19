import { site } from '@/content/site';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { normalizeContact, validateContact } from '@/lib/contact-validation';

/**
 * Receives enquiries from the contact form and emails them to the studio with Resend.
 * Required environment variables (set in .env.local and in Vercel → Settings → Environment Variables):
 *   RESEND_API_KEY      – from resend.com/api-keys
 *   CONTACT_TO_EMAIL    – inbox that receives enquiries
 *   CONTACT_FROM_EMAIL  – sender on a domain verified in Resend, e.g. "ARCHIFORM Website <website@yourdomain.com>".
 *                         Before your domain is verified you can use "ARCHIFORM <onboarding@resend.dev>",
 *                         which only delivers to the email address you signed up to Resend with.
 */
export const runtime = 'nodejs';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 5000;
const MAX_BODY_BYTES = 24 * 1024;
const hits = new Map();
const submissions = new Map();

function prune(map, now) {
  for (const [key, entry] of map) if (entry.expires <= now) map.delete(key);
}

// Bounded per-instance fallback. Vercel supplies the trusted forwarding header.
// Other hosts share one bucket until a trusted ingress limiter is configured.
function limited(req) {
  const now = Date.now();
  prune(hits, now);
  const forwarded = process.env.VERCEL === '1' ? req.headers.get('x-vercel-forwarded-for')?.trim() : '';
  const ip = isIP(forwarded || '') ? forwarded : 'unknown';
  let entry = hits.get(ip);
  if (!entry) {
    if (hits.size >= MAX_ENTRIES) return true;
    entry = { count: 0, expires: now + WINDOW_MS };
    hits.set(ip, entry);
  }
  if (entry.count >= 5) return true;
  entry.count += 1;
  return false;
}

function reply(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '600' } : {}) } });
}

async function readBody(req) {
  if (Number(req.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('large');
  if (!req.body) throw new Error('invalid');
  const reader = req.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new Error('large');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function POST(req) {
  const origin = req.headers.get('origin');
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return reply({ error: 'Please send your enquiry from the contact page.' }, 403);
  }
  if (origin) {
    let sameHost = false;
    try {
      const parsed = new URL(origin);
      // Next's internal request URL can use localhost behind a reverse proxy.
      sameHost = ['https:', 'http:'].includes(parsed.protocol) && parsed.host === req.headers.get('host');
    } catch {}
    if (!sameHost) return reply({ error: 'Please send your enquiry from the contact page.' }, 403);
  }
  if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return reply({ error: 'Send your enquiry as JSON.' }, 415);
  }
  if (limited(req)) return reply({ error: 'Too many enquiries just now. Please try again in ten minutes.' }, 429);

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    return reply({ error: error.message === 'large' ? 'Your enquiry is too large.' : 'Invalid request.' }, error.message === 'large' ? 413 : 400);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({ error: 'Invalid request.' }, 400);
  if (body.company) return reply({ error: 'We couldn’t accept this enquiry. Please email the studio if this continues.' }, 400);
  const data = normalizeContact(body);
  const fieldErrors = validateContact(data);
  if (Object.keys(fieldErrors).length) return reply({ error: 'Please check the highlighted fields.', fieldErrors }, 400);
  if (typeof body.submissionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId)) {
    return reply({ error: 'Please reload the contact page and try again.' }, 400);
  }
  const { name, email, phone, type, message } = data;
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error('Contact form: required email configuration is missing.');
    return reply({ error: 'Our enquiry form isn’t connected yet, so your message wasn’t sent.' }, 503);
  }

  const now = Date.now();
  prune(submissions, now);
  // Hash only: do not retain enquiry personal data in the duplicate cache.
  const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex');
  if (submissions.has(fingerprint)) return reply({ error: 'This enquiry is already being sent or has recently been sent. Please wait before submitting it again.' }, 409);
  if (submissions.size >= MAX_ENTRIES) return reply({ error: 'The enquiry service is busy. Please try again later.' }, 503);
  submissions.set(fingerprint, { expires: now + WINDOW_MS });

  const rows = [['Name', name], ['Email', email], ['Phone', phone], ['Project type', type]];
  const html = `
    <div style="font-family:Georgia,serif;color:#3E3122;max-width:560px">
      <h2 style="font-weight:400">New enquiry from the website</h2>
      <table style="border-collapse:collapse;font-size:15px">
        ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#7A7E58">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`).join('')}
      </table>
      <p style="white-space:pre-wrap;font-size:15px;line-height:1.6;border-top:1px solid #ddd;padding-top:12px">${esc(message)}</p>
    </div>`;
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${message}`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        // Stable across retries, including ambiguous provider timeouts.
        'Idempotency-Key': `contact-${body.submissionId}-${fingerprint}`,
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: CONTACT_TO_EMAIL.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: email,
        subject: `New enquiry: ${name} (${type}) – ${site.shortName}`,
        html,
        text,
      }),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok || typeof result?.id !== 'string' || !result.id) {
      // Do not log provider response bodies: they can contain personal data.
      console.error('Contact email provider rejected submission:', res.status);
      submissions.delete(fingerprint);
      return reply({ error: 'We couldn’t send your enquiry just now. Please try again in a few minutes.' }, 502);
    }
    return reply({ ok: true });
  } catch {
    submissions.delete(fingerprint);
    console.error('Contact email provider request failed or timed out.');
    return reply({ error: 'We couldn’t confirm that your enquiry was sent. Please try again in a few minutes.' }, 502);
  }
}
