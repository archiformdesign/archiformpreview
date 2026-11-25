// Summary of a Playwright JSON report: node tests/e2e-summary.mjs audit/after/e2e-results.json
import { readFileSync } from 'node:fs';
const r = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = [], cls = {};
const walk = (s, path = []) => {
  for (const sp of s.specs || []) for (const t of sp.tests) for (const res of t.results) {
    const vp = path[path.length - 1] || '', name = `${t.projectName} ${vp} ${sp.title}`;
    const c = [...(t.annotations || []), ...(res.annotations || [])].find((a) => a.type === 'cls');
    if (c) cls[name] = +c.description;
    out.push({ name, status: res.status, errors: (res.errors || []).map((e) => (e.message || '').replace(/\x1b\[[0-9;]*m/g, '').split('\n')[0].slice(0, 220)) });
  }
  for (const c of s.suites || []) walk(c, [...path, c.title]);
};
r.suites.forEach((s) => walk(s, [s.title]));
const by = out.reduce((m, o) => ((m[o.status] = (m[o.status] || 0) + 1), m), {});
console.log('results:', JSON.stringify(by));
const vals = Object.values(cls);
if (vals.length) console.log(`CLS (Chrome): max ${Math.max(...vals).toFixed(4)} over ${vals.length} page loads; above 0.05: ${vals.filter((v) => v > 0.05).length}`);
for (const o of out.filter((o) => o.status !== 'passed' && o.status !== 'skipped')) console.log(`FAIL ${o.name}\n   ${[...new Set(o.errors)].join('\n   ')}`);
