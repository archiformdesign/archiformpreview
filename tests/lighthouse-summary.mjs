// Summary table of the Lighthouse JSON reports in a folder: node tests/lighthouse-summary.mjs audit/latest
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[2] || 'audit/latest';
const rows = [['page', 'perf', 'a11y', 'bp', 'seo', 'FCP s', 'LCP s', 'TBT ms', 'CLS', 'SI s', 'KB', 'requests']];
for (const f of readdirSync(dir).filter((f) => /^lh-.*\.report\.json$/.test(f)).sort()) {
  const r = JSON.parse(readFileSync(join(dir, f)));
  const name = f.replace(/^lh-|\.report\.json$/g, '');
  if (r.runtimeError) { rows.push([name, 'error: ' + r.runtimeError.code]); continue; }
  const a = r.audits, c = r.categories, s = (k) => (c[k] ? Math.round(c[k].score * 100) : '-');
  rows.push([name, s('performance'), s('accessibility'), s('best-practices'), s('seo'),
    (a['first-contentful-paint'].numericValue / 1000).toFixed(2), (a['largest-contentful-paint'].numericValue / 1000).toFixed(2),
    Math.round(a['total-blocking-time'].numericValue), a['cumulative-layout-shift'].numericValue.toFixed(3),
    (a['speed-index'].numericValue / 1000).toFixed(2), Math.round(a['total-byte-weight'].numericValue / 1024),
    (a['network-requests']?.details?.items || []).length]);
}
const w = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i] ?? '').length)));
rows.forEach((r) => console.log(r.map((v, i) => String(v ?? '').padEnd(w[i])).join('  ')));
