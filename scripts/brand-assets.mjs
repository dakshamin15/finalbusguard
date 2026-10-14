// Generates brand + icon assets from the source logo. Run: node scripts/brand-assets.mjs
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = "public/media/brand/logo-full.png";
const BG = { r: 243, g: 238, b: 230, alpha: 1 };

const mark = await sharp(SRC).trim().png().toBuffer();
await sharp(mark).resize({ height: 512 }).png({ compressionLevel: 9 }).toFile("public/brand/mark.png");

const square = async (size, pad, bg) => {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(mark).resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: logo, gravity: "center" }]).png({ compressionLevel: 9 }).toBuffer();
};

await writeFile("app/icon.png", await sharp(await square(192, 0.04)).png({ palette: true }).toBuffer());
await writeFile("app/apple-icon.png", await square(180, 0.16, BG));
await writeFile("public/brand/icon-192.png", await square(192, 0.14, BG));
await writeFile("public/brand/icon-512.png", await square(512, 0.14, BG));

// favicon.ico with embedded PNGs (16, 32, 48)
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s, 0.02)));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length; return e;
});
await writeFile("app/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));
console.log("brand assets written");
