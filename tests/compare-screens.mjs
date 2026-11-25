/**
 * Before/after screenshot comparison: every PNG in audit/screens/after/ against the same file in audit/screens/before/.
 * Writes a red-on-grey diff image for any pair that differs to audit/screens/diff/ and prints a table.
 * A pixel counts as changed when any colour channel differs by more than THRESHOLD (0-255), which ignores
 * anti-aliasing noise. Usage: node tests/compare-screens.mjs [before-dir] [after-dir]
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const [A = 'audit/screens/before', B = 'audit/screens/after'] = process.argv.slice(2);
const OUT = 'audit/screens/diff', THRESHOLD = 40;

async function files(dir, base = dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await files(p, base)); else if (e.name.endsWith('.png')) out.push(p.slice(base.length + 1));
  }
  return out;
}

const rows = [];
for (const f of (await files(B)).sort()) {
  const [a, b] = await Promise.all([join(A, f), join(B, f)].map((p) => sharp(p).ensureAlpha().raw().toBuffer({ resolveWithObject: true }).catch(() => null)));
  if (!a) { rows.push([f, 'no before']); continue; }
  if (a.info.width !== b.info.width || a.info.height !== b.info.height) {
    rows.push([f, `size ${a.info.width}x${a.info.height} -> ${b.info.width}x${b.info.height}`]); continue;
  }
  const n = a.info.width * a.info.height, diff = Buffer.alloc(n * 4);
  let changed = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4, d = Math.max(Math.abs(a.data[o] - b.data[o]), Math.abs(a.data[o + 1] - b.data[o + 1]), Math.abs(a.data[o + 2] - b.data[o + 2]));
    const g = (a.data[o] + a.data[o + 1] + a.data[o + 2]) / 3 * 0.3 + 160;
    if (d > THRESHOLD) { changed++; diff.set([255, 0, 0, 255], o); } else diff.set([g, g, g, 255], o);
  }
  const pct = (changed / n) * 100;
  if (changed) {
    await mkdir(dirname(join(OUT, f)), { recursive: true });
    await sharp(diff, { raw: { width: a.info.width, height: a.info.height, channels: 4 } }).png().toFile(join(OUT, f));
  }
  rows.push([f, changed ? `${pct.toFixed(3)}% (${changed} px)` : 'identical']);
}
const width = Math.max(...rows.map((r) => r[0].length));
rows.forEach(([f, r]) => console.log(f.padEnd(width), r));
const differ = rows.filter((r) => r[1] !== 'identical');
console.log(`\n${rows.length} screenshots compared, ${rows.length - differ.length} identical, ${differ.length} differ${differ.length ? ` (diff images in ${OUT}/)` : ''}`);
