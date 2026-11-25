/**
 * Builds the browser icons from the one source, public/m/favicon.png (256x256):
 *   public/favicon.ico            16, 32 and 48px (PNG-in-ICO), the file browsers and search engines ask for at /favicon.ico
 *   public/m/apple-touch-icon.png 180px, for iPhone and iPad home screens
 *   public/m/icon-192.png         192px, for the web app manifest (app/manifest.js)
 * Run after replacing favicon.png:  node scripts/make-icons.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SRC = 'public/m/favicon.png';
const png = (size) => sharp(SRC).resize(size, size, { kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer();

// ICO container: a 6-byte header, a 16-byte directory entry per image, then the PNG files themselves
async function ico(sizes) {
  const images = await Promise.all(sizes.map(png));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map((img, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(sizes[i] % 256, 0); e.writeUInt8(sizes[i] % 256, 1); // width, height (0 means 256)
    e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(img.length, 8); e.writeUInt32LE(offset, 12);
    offset += img.length;
    return e;
  });
  return Buffer.concat([header, ...entries, ...images]);
}

await writeFile('public/favicon.ico', await ico([16, 32, 48]));
await writeFile('public/m/apple-touch-icon.png', await png(180));
await writeFile('public/m/icon-192.png', await png(192));
console.log('Icons written: public/favicon.ico, public/m/apple-touch-icon.png, public/m/icon-192.png');
