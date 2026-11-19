import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import * as crypto from 'node:crypto';
import * as net from 'node:net';

const root = new URL('../', import.meta.url);
const validationSource = await readFile(new URL('lib/contact-validation.js', root), 'utf8');
const routeSource = await readFile(new URL('app/api/contact/route.js', root), 'utf8');
const siteSource = await readFile(new URL('content/site.js', root), 'utf8');
const valid = { name: ' Test Visitor ', email: ' visitor@example.com ', phone: ' +44 (20) 7946-0958 ', type: 'Villa', message: ' A consultation, please. ', company: '', submissionId: crypto.randomUUID() };

async function setup({ configured = true, provider, vercel = true } = {}) {
  const calls = [];
  const context = vm.createContext({
    Request, Response, URL, Buffer, AbortSignal, console: { error() {} },
    process: { env: configured ? { RESEND_API_KEY: 'test-placeholder', CONTACT_TO_EMAIL: 'studio@example.com', CONTACT_FROM_EMAIL: 'website@example.com', ...(vercel ? { VERCEL: '1' } : {}) } : {} },
    fetch: async (...args) => { calls.push(args); return provider ? provider(...args) : Response.json({ id: 'test-message-id' }); },
  });
  const validation = new vm.SourceTextModule(validationSource, { context });
  const site = new vm.SourceTextModule(siteSource, { context });
  const route = new vm.SourceTextModule(routeSource, { context });
  const synthetic = (exports) => new vm.SyntheticModule(Object.keys(exports), function () {
    for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
  }, { context });
  await route.link((id) => ({ '@/lib/contact-validation': validation, '@/content/site': site, 'node:crypto': synthetic(crypto), 'node:net': synthetic(net) })[id]);
  await route.evaluate();
  let sequence = 0;
  const post = (body = valid, headers = {}, raw = false) => route.namespace.POST(new Request('https://studio.example/api/contact', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://studio.example', host: 'studio.example', 'x-vercel-forwarded-for': `192.0.2.${++sequence}`, ...headers },
    body: raw ? body : JSON.stringify(body),
  }));
  return { calls, post, validation: validation.namespace };
}

test('shared frontend/backend validation accepts international formats and trims', async () => {
  const { validation: v } = await setup();
  for (const phone of ['+971 50 160 5312', '+1 (212) 555-0123', '+44 20 7946 0958', '0049 30 123456', '555-0123']) {
    const data = v.normalizeContact({ ...valid, phone });
    assert.equal(data.name, 'Test Visitor');
    assert.deepEqual(Object.keys(v.validateContact(data)), []);
  }
  for (const email of ['', 'userexample.com', 'user@', 'user@@example.com', 'user@example', 'user @example.com', 'user@example..com', '.user@example.com', 'user..name@example.com', 'user[bad]@example.com', 'user\r\n@example.com']) {
    assert.ok(v.validateContact(v.normalizeContact({ ...valid, email })).email);
  }
  for (const phone of ['', 'abc1234567', '+12', '+1234567890123456', '12+3456789', '0000000', '+44 (20 79460958', '+44 2079460958--']) {
    assert.ok(v.validateContact(v.normalizeContact({ ...valid, phone })).phone);
  }
});

test('valid enquiry is passed to fixed configured recipient with escaped HTML', async () => {
  const { post, calls } = await setup();
  const res = await post({ ...valid, elapsed: 0, message: '<script>alert("x")</script>' });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);
  assert.equal(calls.length, 1);
  const payload = JSON.parse(calls[0][1].body);
  assert.deepEqual(payload.to, ['studio@example.com']);
  assert.equal(payload.reply_to, 'visitor@example.com');
  assert.ok(payload.html.includes('&lt;script&gt;'));
  assert.ok(!payload.html.includes('<script>'));
  assert.equal(res.headers.get('cache-control'), 'no-store');
});

test('empty, invalid, non-string, overlong and injected fields never reach provider', async () => {
  const { post, calls } = await setup();
  for (const body of [{}, { ...valid, email: 'invalid' }, { ...valid, phone: 'letters' }, { ...valid, name: {} }, { ...valid, message: ' ' }, { ...valid, name: 'x'.repeat(121) }, { ...valid, type: 'unknown' }, { ...valid, name: 'Name\r\nBcc:other@example.com' }, { ...valid, submissionId: 'invalid' }]) {
    assert.equal((await post(body)).status, 400);
  }
  assert.equal(calls.length, 0);
});

test('malformed JSON and invalid JSON shapes return 400', async () => {
  const { post } = await setup();
  for (const value of ['null', '[]', '42', '"text"', '{']) assert.equal((await post(value, {}, true)).status, 400);
});

test('honeypot rejects without false success', async () => {
  const { post, calls } = await setup();
  const res = await post({ ...valid, company: 'spam' });
  assert.equal(res.status, 400);
  assert.notEqual((await res.json()).ok, true);
  assert.equal(calls.length, 0);
});

test('cross-site and non-JSON requests are rejected', async () => {
  const { post, calls } = await setup();
  assert.equal((await post(valid, { origin: 'https://evil.example' })).status, 403);
  assert.equal((await post(valid, { 'sec-fetch-site': 'cross-site' })).status, 403);
  assert.equal((await post(valid, { 'content-type': 'text/plain' })).status, 415);
  assert.equal(calls.length, 0);
});

test('streamed body and declared size limits return 413', async () => {
  const { post } = await setup();
  assert.equal((await post('x'.repeat(25000), {}, true)).status, 413);
  assert.equal((await post(valid, { 'content-length': '25000' })).status, 413);
});

test('missing configuration returns 503 without sending', async () => {
  const { post, calls } = await setup({ configured: false });
  assert.equal((await post()).status, 503);
  assert.equal(calls.length, 0);
});

test('provider errors, malformed acknowledgements and network failures return 502', async () => {
  for (const provider of [() => Response.json({ error: 'rejected' }, { status: 401 }), () => Response.json({}), () => { throw new Error('network'); }, () => { throw new DOMException('Timeout', 'TimeoutError'); }]) {
    const { post } = await setup({ provider });
    const res = await post();
    assert.equal(res.status, 502);
    assert.notEqual((await res.json()).ok, true);
  }
});

test('successful duplicate is blocked and provider only receives one request', async () => {
  const { post, calls } = await setup();
  assert.equal((await post()).status, 200);
  assert.equal((await post({ ...valid, submissionId: crypto.randomUUID() })).status, 409);
  assert.equal(calls.length, 1);
});

test('concurrent duplicate is blocked while delivery is pending', async () => {
  let release;
  let started;
  const entered = new Promise((resolve) => { started = resolve; });
  const { post, calls } = await setup({ provider: () => { started(); return new Promise((resolve) => { release = resolve; }); } });
  const pending = post();
  await entered;
  assert.equal((await post()).status, 409);
  release(Response.json({ id: 'accepted' }));
  assert.equal((await pending).status, 200);
  assert.equal(calls.length, 1);
});

test('retry after provider failure preserves idempotency key', async () => {
  let attempt = 0;
  const { post, calls } = await setup({ provider: () => ++attempt === 1 ? Response.json({}, { status: 503 }) : Response.json({ id: 'accepted' }) });
  assert.equal((await post()).status, 502);
  assert.equal((await post()).status, 200);
  assert.equal(calls[0][1].headers['Idempotency-Key'], calls[1][1].headers['Idempotency-Key']);
});

test('sixth request from same trusted IP is rate limited; arbitrary forwarded header does not bypass', async () => {
  const { post } = await setup();
  const headers = { 'x-vercel-forwarded-for': '192.0.2.200' };
  for (let i = 0; i < 5; i++) assert.equal((await post({}, { ...headers, 'x-forwarded-for': `198.51.100.${i}` })).status, 400);
  const res = await post({}, headers);
  assert.equal(res.status, 429);
  assert.equal(res.headers.get('retry-after'), '600');
});

test('self-hosted: limit uses the proxy-appended (last) X-Forwarded-For entry, so forged earlier entries do not bypass it', async () => {
  const { post } = await setup({ vercel: false });
  for (let i = 0; i < 5; i++) assert.equal((await post({}, { 'x-forwarded-for': `198.51.100.${i}, 203.0.113.9` })).status, 400);
  assert.equal((await post({}, { 'x-forwarded-for': '198.51.100.99, 203.0.113.9' })).status, 429);
  assert.equal((await post({}, { 'x-forwarded-for': '203.0.113.10' })).status, 400, 'a different visitor has their own limit');
});

test('self-hosted: proxy that rewrites Host is accepted via X-Forwarded-Host; other origins are still rejected', async () => {
  const { post, calls } = await setup({ vercel: false });
  const proxied = { host: 'localhost:3000', 'x-forwarded-host': 'studio.example', 'x-forwarded-for': '203.0.113.20' };
  assert.equal((await post(valid, proxied)).status, 200);
  assert.equal((await post(valid, { ...proxied, origin: 'https://evil.example' })).status, 403);
  assert.equal(calls.length, 1);
});
