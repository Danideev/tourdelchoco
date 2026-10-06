/**
 * verify-media.mjs — final acceptance check for public/media/.
 *
 *   node scripts/verify-media.mjs
 *
 * For every expected slot it prints filename / bytes / dimensions and fails
 * the run if: the file is missing, does not start with the JPEG SOI marker
 * (FF D8 FF), is under the size floor (40 KB; 15 KB for portraits), parses to
 * a portrait orientation (except the square team portraits), or no credits
 * entry exists in src/data/image-credits.ts.
 * hero.webm is optional: when present it must start with the WebM EBML magic
 * (1A 45 DF A3) and be <= 12 MB.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = path.join(ROOT, "public", "media");
const CREDITS_TS = path.join(ROOT, "src", "data", "image-credits.ts");

const SLOTS = [
  "hero.jpg", "hero-alt.jpg",
  "cat-01.jpg", "cat-02.jpg", "cat-03.jpg", "cat-04.jpg", "cat-05.jpg",
  "feat-01.jpg", "feat-02.jpg", "feat-03.jpg",
  "blog-01.jpg", "blog-02.jpg", "blog-03.jpg",
  "prod-01.jpg", "prod-02.jpg", "prod-03.jpg", "prod-04.jpg", "prod-05.jpg",
  "prod-06.jpg", "prod-07.jpg", "prod-08.jpg", "prod-09.jpg", "prod-10.jpg",
  "prod-11.jpg", "prod-12.jpg",
  "portrait-01.jpg", "portrait-02.jpg", "portrait-03.jpg", "portrait-04.jpg",
  "portrait-05.jpg",
];

function jpegSize(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      i += 2; continue;
    }
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
}

const rows = [];
const problems = [];

const creditsSrc = fs.readFileSync(CREDITS_TS, "utf8");
const credited = new Set([...creditsSrc.matchAll(/file:\s*"([^"]+)"/g)].map((m) => m[1]));
const sources = new Map();
for (const m of creditsSrc.matchAll(/\{ file: "([^"]+)", author: "[^"]*", license: "[^"]*", source: "([^"]+)" \}/g)) {
  if (m[2].startsWith("https://commons.wikimedia.org/")) {
    if (sources.has(m[2])) problems.push(`${m[1]} and ${sources.get(m[2])} share the same source ${m[2]}`);
    else sources.set(m[2], m[1]);
  }
}
const seenHashes = new Map();

for (const file of SLOTS) {
  const p = path.join(MEDIA, file);
  if (!fs.existsSync(p)) { problems.push(`${file}: MISSING`); continue; }
  const buf = fs.readFileSync(p);
  const isPortrait = file.startsWith("portrait-");
  const minBytes = isPortrait ? 15_000 : 40_000;

  if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) problems.push(`${file}: not a JPEG (SOI mismatch)`);
  if (buf.length < minBytes) problems.push(`${file}: ${buf.length}B < ${minBytes}B`);
  const dim = jpegSize(buf);
  if (!dim) problems.push(`${file}: JPEG SOF header did not parse`);
  else if (!isPortrait && dim.width <= dim.height) problems.push(`${file}: ${dim.width}x${dim.height} is not landscape`);
  if (!credited.has(file)) problems.push(`${file}: no entry in src/data/image-credits.ts`);

  // duplicate detection (content hash)
  const key = crypto.createHash("sha256").update(buf).digest("hex");
  if (seenHashes.has(key)) problems.push(`${file}: identical bytes to ${seenHashes.get(key)}`);
  seenHashes.set(key, file);

  rows.push({ file, bytes: buf.length, w: dim?.width ?? "?", h: dim?.height ?? "?" });
}

// optional hero.webm
const webm = path.join(MEDIA, "hero.webm");
let webmStatus = "not obtained (optional)";
if (fs.existsSync(webm)) {
  const buf = fs.readFileSync(webm);
  const ok = buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3;
  if (!ok) problems.push("hero.webm: bad EBML magic");
  if (buf.length > 12 * 1024 * 1024) problems.push(`hero.webm: ${buf.length}B > 12MB`);
  webmStatus = `${buf.length} bytes ${ok ? "(valid webm)" : "(INVALID)"}`;
}

const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad("FILE", 15)}${pad("BYTES", 10)}DIMENSIONS`);
for (const r of rows) console.log(`${pad(r.file, 15)}${pad(r.bytes, 10)}${r.w}x${r.h}`);
console.log(`\nhero.webm: ${webmStatus}`);

if (problems.length) {
  console.log(`\nFAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.log("  " + p);
  process.exit(1);
}
console.log(`\nPASS — ${rows.length}/${SLOTS.length} images valid, all credited.`);
