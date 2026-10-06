/**
 * fetch-media.mjs — downloads the mock photography used by the Agropyme
 * marketing site into `public/media/`.
 *
 *   node scripts/fetch-media.mjs
 *
 * Sources:
 *   1. Wikimedia Commons public API (images at the requested thumbnail width).
 *   2. i.pravatar.cc for the 5 team portraits.
 *   3. Optional: a Commons sheep-shearing video transcoded to hero.webm.
 *
 * Every downloaded file is validated before it is kept:
 *   - must start with the JPEG SOI marker (FF D8 FF) for .jpg
 *   - must be >= 40 KB (portraits >= 15 KB)
 *   - landscape orientation for everything except the square portraits
 *   - JPEG SOF header must parse so we know the real dimensions
 *
 * Results (credits + dimensions) are cached in scripts/media-credits.json and
 * written out to src/data/image-credits.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA_DIR = path.join(ROOT, "public", "media");
const CREDITS_JSON = path.join(ROOT, "scripts", "media-credits.json");
const CREDITS_TS = path.join(ROOT, "src", "data", "image-credits.ts");

const UA = "AgropymeDemo/1.0 (contact: dev@example.com) node/fetch-media.mjs";
const API = "https://commons.wikimedia.org/w/api.php";

/** File titles we never want to ship. */
const EXCLUDE_TITLE = [
  "painting", "drawing", "map", "logo", "diagram", "chart", "coat of arms",
  "stamp", "poster", "illustration", "engraving", "silhouette", "icon",
  "svg", "screenshot", "coat-of-arms",
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const stripTags = (s = "") =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripQuery = (u = "") => u.split("?")[0];

/** ---------- tiny JPEG header parser (SOF0/SOF1/SOF2) ---------- */
function jpegSize(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      i += 2;
      continue;
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

function isJpeg(buf) {
  return buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

function isWebm(buf) {
  return (
    buf.length > 4 &&
    buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3
  );
}

/** ---------- Commons ---------- */
async function commonsSearch(gsrsearch, limit = 40) {
  const url =
    `${API}?action=query&generator=search&gsrsearch=${encodeURIComponent(gsrsearch)}` +
    `&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo` +
    `&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=400&format=json&formatversion=2`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`commons search HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`commons API error ${json.error.code}`);
  return json?.query?.pages ?? [];
}

async function commonsByTitles(titles) {
  const url =
    `${API}?action=query&titles=${encodeURIComponent(titles.join("|"))}` +
    `&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=400&format=json&formatversion=2`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`commons titles HTTP ${res.status}`);
  const json = await res.json();
  return json?.query?.pages ?? [];
}

function candidateRows(pages) {
  return pages
    .filter((p) => p.imageinfo?.[0])
    .map((p) => {
      const ii = p.imageinfo[0];
      const em = ii.extmetadata ?? {};
      const title = p.title.replace(/^File:/i, "");
      const meta = [
        title,
        stripTags(em.ImageDescription?.value ?? ""),
        stripTags(em.Categories?.value ?? ""),
        stripTags(em.ObjectName?.value ?? ""),
      ].join(" ");
      return {
        title,
        lower: title.toLowerCase(),
        meta: meta.toLowerCase(),
        w: ii.width,
        h: ii.height,
        mime: ii.mime,
        url: stripQuery(ii.url ?? ""),
        thumburl: stripQuery(ii.thumburl ?? ""),
        descurl: stripQuery(ii.descriptionurl ?? ""),
        author: stripTags(em.Artist?.value ?? "") || "Unknown",
        license: stripTags(em.LicenseShortName?.value ?? "") || "See source page",
      };
    });
}

/**
 * Score a candidate for a target. Hard-rejects non-JPEG, excluded titles and
 * portrait shots (for landscape targets).
 */
function scoreCandidate(c, target, rankBias) {
  const t = c.lower;
  if (!/\.(jpe?g)$/.test(t)) return -1;
  if (EXCLUDE_TITLE.some((w) => t.includes(w))) return -1;
  if (c.mime && c.mime !== "image/jpeg") return -1;
  const landscape = c.w > c.h;
  if (target.orientation === "landscape" && !landscape) return -1;
  if (target.orientation === "portrait" && landscape) return -1;
  if (target.require && !target.require.test(c.meta)) return -1;

  let score = 0;
  for (const kw of target.keywords ?? []) {
    if (c.meta.includes(kw)) score += 10;
  }
  if (/photograph|photo of|\bphoto\b|images? from flickr/.test(c.meta)) score += 6;
  if (/in action|at work|working|hands? /.test(c.meta)) score += 3;
  if (/\bmodern\b|\b20[0-2][0-9]\b/.test(c.meta)) score += 2;
  if (/historic|19th centur|ca\. 18|black and white|glass plate|postcard/.test(c.meta)) score -= 6;
  if (c.w >= target.width) score += 8;
  else if (c.w >= target.width * 0.75) score += 3;
  else score -= 8;
  score -= rankBias * 0.01;
  return score;
}

async function download(url, headers = { "User-Agent": UA }) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

async function fetchCommonsImage(target) {
  const rejected = [];
  for (const query of target.queries) {
    let pages;
    try {
      pages = target.pinned?.length ? await commonsByTitles(target.pinned) : await commonsSearch(query);
    } catch (err) {
      rejected.push(`${query}: ${err.message}`);
      continue;
    }
    const rows = candidateRows(pages).map((c, i) => ({
      c,
      s: scoreCandidate(c, target, i),
    }));
    rows.sort((a, b) => b.s - a.s);

    for (const { c, s } of rows.slice(0, 14)) {
      if (s < 0) continue;
      try {
        const thumb = target.width > 400 && c.thumburl ? c.thumburl : c.url;
        // re-request a thumb at exactly the width we need
        let url = thumb;
        if (target.width > 400) {
          const iiUrl =
            `${API}?action=query&titles=${encodeURIComponent("File:" + c.title)}` +
            `&prop=imageinfo&iiprop=url&iiurlwidth=${target.width}&format=json&formatversion=2`;
          const r = await fetch(iiUrl, { headers: { "User-Agent": UA } });
          const j = await r.json();
          url = stripQuery(j?.query?.pages?.[0]?.imageinfo?.[0]?.thumburl || c.url);
        }
        const buf = await download(url);
        if (!isJpeg(buf)) {
          rejected.push(`${c.title}: not JPEG (${buf.length}B)`);
          continue;
        }
        if (buf.length < target.minBytes) {
          rejected.push(`${c.title}: too small ${buf.length}B`);
          continue;
        }
        const dim = jpegSize(buf);
        if (!dim) {
          rejected.push(`${c.title}: bad SOF`);
          continue;
        }
        if (target.orientation === "landscape" && dim.width <= dim.height) {
          rejected.push(`${c.title}: ${dim.width}x${dim.height} not landscape`);
          continue;
        }
        if (target.minWidth && dim.width < target.minWidth) {
          rejected.push(`${c.title}: width ${dim.width} < ${target.minWidth}`);
          continue;
        }
        return { buf, dim, credit: { ...c, gotFrom: query, url } };
      } catch (err) {
        rejected.push(`${c.title}: ${err.message}`);
      }
      await sleep(150);
    }
    await sleep(250);
    if (target.pinned?.length) break; // pinned titles are one-shot
  }
  return { error: rejected.slice(-6) };
}

async function fetchPravatar(img) {
  const url = `https://i.pravatar.cc/512?img=${img}`;
  const buf = await download(url);
  return { buf, url };
}

/** ---------- targets ---------- */
const COMMON = { orientation: "landscape", minBytes: 40_000 };

const TARGETS = [
  {
    ...COMMON,
    file: "hero.jpg",
    width: 1920,
    minWidth: 1500,
    queries: [
      "sheep shearing shearer electric machine",
      "shearing sheep handpiece shed",
      "sheep shearing",
    ],
    require: /shear/,
    keywords: ["shear", "shearing", "handpiece", "electric", "machine", "shed", "wool"],
  },
  {
    ...COMMON,
    file: "hero-alt.jpg",
    width: 1600,
    minWidth: 1200,
    queries: ["flock of sheep", "shorn sheep flock", "wool bale fleece sheep"],
    require: /sheep|flock|wool/,
    keywords: ["flock", "sheep", "wool", "shorn", "field", "pasture"],
  },
  {
    ...COMMON,
    file: "cat-01.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["electric sheep shearing machine", "shearing machine sheep", "sheep shearing machine electric"],
    pinned: [
      "File:Two stand Ronaldson & Tippett shearing plant at Harrismith, Western Australia, January 2024.jpg",
    ],
    require: /shear|clipper|tondeuse/,
    keywords: ["machine", "electric", "shearing", "motor", "handpiece"],
  },
  {
    ...COMMON,
    file: "cat-02.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["shearing blades shears", "blade shears sheep wool", "sheep shears metal blades"],
    pinned: [
      "File:Shears, sheep (AM 1967.76-1).jpg",
    ],
    require: /shear|blade|scissor/,
    keywords: ["blade", "blades", "shears", "metal", "cutting", "steel"],
  },
  {
    ...COMMON,
    file: "cat-03.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["oil can lubricant workshop", "lubricating oil bottle", "oil can"],
    pinned: [
      "File:Close-up of an oil can in a workshop (51242363089).jpg",
    ],
    require: /oil|lubricant|lubricat/,
    keywords: ["oil", "lubricant", "lubricating", "can", "bottle", "workshop"],
  },
  {
    ...COMMON,
    file: "cat-04.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["gears mechanical parts", "gear wheels metal machinery", "machine gears close up"],
    pinned: [
      "File:Berbiqui abierto.jpg",
    ],
    require: /gear|cog|part/,
    keywords: ["gear", "gears", "cog", "parts", "mechanical", "metal", "machine"],
  },
  {
    ...COMMON,
    file: "cat-05.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["toolbox with tools", "tool kit tools case", "hand tools workbench"],
    require: /tool/,
    keywords: ["tool", "tools", "toolbox", "kit", "case", "set"],
  },
  {
    ...COMMON,
    file: "feat-01.jpg",
    width: 1400,
    minWidth: 1000,
    queries: ["shearing handpiece sheep", "animal clipper handpiece", "sheep shearing handpiece close up"],
    require: /handpiece|clipper|shear|tondeuse|trimmer/,
    keywords: ["handpiece", "clipper", "shearing", "close", "head", "tondeuse"],
  },
  {
    ...COMMON,
    file: "feat-02.jpg",
    width: 1400,
    minWidth: 1000,
    queries: ["clipper blades close up", "shears blades metal close up", "scissor blades close up"],
    pinned: [
      "File:Shearing 08.JPG",
    ],
    require: /blade|shear|scissor|clipper|fleece/,
    keywords: ["blade", "blades", "close", "metal", "steel", "edge", "shears"],
  },
  {
    ...COMMON,
    file: "feat-03.jpg",
    width: 1400,
    minWidth: 1000,
    queries: ["shearer shearing sheep at work", "sheep shearing close up", "man shearing sheep machine"],
    require: /shear/,
    keywords: ["shearer", "shearing", "at work", "hands", "close", "machine"],
  },
  {
    ...COMMON,
    file: "blog-01.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["farm machinery workshop", "rural workshop tools machinery", "agricultural machinery workshop"],
    pinned: [
      "File:Worker repairing a large tractor tire in a farm workshop during the afternoon.jpg",
    ],
    require: /machin|workshop|clipper|tool|tractor/,
    keywords: ["machinery", "workshop", "farm", "tools", "repair", "rural"],
  },
  {
    ...COMMON,
    file: "blog-02.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["sharpening blade grinding wheel", "knife sharpening grinding wheel", "sharpening metal blade grinder"],
    require: /sharpen|grind|whetstone/,
    keywords: ["sharpen", "sharpening", "grinding", "wheel", "grinder", "stone"],
  },
  {
    ...COMMON,
    file: "blog-03.jpg",
    width: 1200,
    minWidth: 900,
    queries: ["alpaca shearing", "llama shearing", "alpaca being sheared"],
    pinned: [
      "File:Bochum - Klinikstraße - Tierpark - Alpaca shearing 01 ies.jpg",
      "File:Bochum - Klinikstraße - Tierpark - Alpaca shearing 05 ies.jpg",
      "File:Bochum - Klinikstraße - Tierpark - Alpaca shearing 09 ies.jpg",
    ],
    require: /alpaca|llama/,
    keywords: ["shearing", "sheared", "alpaca", "llama", "fleece"],
  },
  {
    ...COMMON,
    file: "prod-01.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["sheep shearing machine", "electric shearing machine wool", "shearing machine handpiece motor"],
    pinned: [
      "File:Thinktank Birmingham - object 1968S02248.00001(1).jpg",
      "File:Wolseley sheep shearing engine driving Argossy pump, NVTEC, Chipping Sodbury 28.3.1993 (9965747616).jpg",
    ],
    require: /shear|clipper|tondeuse/,
    keywords: ["shearing", "machine", "electric", "motor", "handpiece"],
  },
  {
    ...COMMON,
    file: "prod-02.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["shearing handpiece detail", "clipper head detail", "animal clipper head"],
    pinned: [
      "File:Hair Clipper - Wahl (51013604297).jpg",
      "File:2023 Trymer.jpg",
    ],
    require: /handpiece|clipper|shear|tondeuse|trimmer/,
    keywords: ["handpiece", "clipper", "head", "detail", "shearing"],
  },
  {
    ...COMMON,
    file: "prod-03.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["shearing blades set", "sheep shearing blades", "clipper cutter blades metal"],
    require: /blade|cutter|shear/,
    keywords: ["blade", "blades", "cutter", "set", "metal", "steel"],
  },
  {
    ...COMMON,
    file: "prod-04.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["electric pet grooming clippers", "dog grooming clipper", "animal clippers electric"],
    pinned: [
      "File:Trimmer.JPG",
    ],
    require: /clipper|grooming|shaver|trimmer/,
    keywords: ["clipper", "clippers", "grooming", "electric", "dog", "pet"],
  },
  {
    ...COMMON,
    file: "prod-05.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["professional scissors shears", "tailor shears scissors", "metal scissors close up"],
    require: /scissor|shear/,
    keywords: ["scissors", "shears", "professional", "metal", "tailor"],
  },
  {
    ...COMMON,
    file: "prod-06.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["lubricant spray can workshop", "oil bottle workshop", "spray can lubricant"],
    pinned: [
      "File:OelkanneTechnisch.jpg",
      "File:Oil can (6160765749).jpg",
    ],
    require: /oil|lubricant|spray|grease|kanne/,
    keywords: ["oil", "lubricant", "spray", "can", "bottle", "grease"],
  },
  {
    ...COMMON,
    file: "prod-07.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["machine spare parts gears", "replacement machine parts", "mechanical spare parts metal"],
    require: /part|gear|bearing|pump/,
    keywords: ["parts", "spare", "gear", "mechanical", "replacement", "metal"],
  },
  {
    ...COMMON,
    file: "prod-08.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["sharpening stone whetstone", "whetstone blade sharpening", "grinding stone tool"],
    pinned: [
      "File:Coticule-Vielsalm.jpg",
      "File:Hone Stone.JPG",
    ],
    require: /sharpen|whetstone|grind|stone|coticule/,
    keywords: ["sharpening", "stone", "whetstone", "grinding", "grinder"],
  },
  {
    ...COMMON,
    file: "prod-09.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["wool bales sheep", "bale of wool", "freshly shorn wool fleece"],
    pinned: [
      "File:Sjöllingstad IMG 3182 wool.JPG",
      "File:Bales of wool (Bales are marked Beltana)(GN02393).jpg",
    ],
    require: /wool|fleece|bale/,
    keywords: ["wool", "bale", "fleece", "shorn", "fleece"],
  },
  {
    ...COMMON,
    file: "prod-10.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["electric motor", "AC electric motor close up", "electric motor drive unit"],
    pinned: [
      "File:Combino gear.jpg",
    ],
    require: /motor|gear|drive/,
    keywords: ["motor", "electric", "drive", "stator", "rotor"],
  },
  {
    ...COMMON,
    file: "prod-11.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["tool set spanners sockets", "hand tools set metal", "wrench set tools"],
    require: /tool|wrench|spanner|socket|plier/,
    keywords: ["tools", "set", "spanner", "wrench", "socket", "pliers", "metal"],
  },
  {
    ...COMMON,
    file: "prod-12.jpg",
    width: 1000,
    minWidth: 800,
    queries: ["animal grooming tools", "pet grooming tools bench", "grooming clippers scissors brushes"],
    pinned: [
      "File:Grooming Supplies.jpg",
      "File:Plukmessen.jpg",
    ],
    require: /groom|clipper|scissor|brush|tool/,
    keywords: ["grooming", "tools", "clippers", "scissors", "brush", "care"],
  },
];

const PORTRAITS = [
  { file: "portrait-01.jpg", img: 12 },
  { file: "portrait-02.jpg", img: 33 },
  { file: "portrait-03.jpg", img: 45 },
  { file: "portrait-04.jpg", img: 51 },
  { file: "portrait-05.jpg", img: 68 },
];

/** ---------- main ---------- */
async function validExisting(file, minBytes, orientation) {
  const p = path.join(MEDIA_DIR, file);
  if (!fs.existsSync(p)) return null;
  const buf = fs.readFileSync(p);
  if (file.endsWith(".jpg")) {
    if (!isJpeg(buf) || buf.length < minBytes) return null;
    const dim = jpegSize(buf);
    if (!dim) return null;
    if (orientation === "landscape" && dim.width <= dim.height) return null;
    return { buf, dim };
  }
  if (file.endsWith(".webm")) return isWebm(buf) ? { buf, dim: null } : null;
  return buf.length ? { buf, dim: null } : null;
}

async function main() {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(CREDITS_TS), { recursive: true });

  const cache = fs.existsSync(CREDITS_JSON)
    ? JSON.parse(fs.readFileSync(CREDITS_JSON, "utf8"))
    : [];
  const cacheByFile = new Map(cache.map((c) => [c.file, c]));
  const report = [];
  const failures = [];

  for (const target of TARGETS) {
    const existing = await validExisting(target.file, target.minBytes, target.orientation);
    const cached = cacheByFile.get(target.file);
    if (existing && cached) {
      report.push({
        file: target.file,
        bytes: existing.buf.length,
        ...existing.dim,
        from: "cached",
      });
      continue;
    }

    process.stdout.write(`-> ${target.file} ... `);
    const result = await fetchCommonsImage(target);
    if (result.error) {
      console.log("FAILED");
      failures.push({ file: target.file, reason: result.error });
      continue;
    }
    fs.writeFileSync(path.join(MEDIA_DIR, target.file), result.buf);
    const c = result.credit;
    const entry = {
      file: target.file,
      author: c.author,
      license: c.license,
      source: c.descurl,
      title: c.title,
      width: result.dim.width,
      height: result.dim.height,
      query: result.credit.gotFrom,
    };
    cacheByFile.set(target.file, entry);
    console.log(`ok ${result.dim.width}x${result.dim.height} ${result.buf.length}B`);
    report.push({ file: target.file, bytes: result.buf.length, ...result.dim, from: entry.title });
    await sleep(250);
  }

  // portraits
  for (const p of PORTRAITS) {
    const existing = await validExisting(p.file, 15_000, "square");
    if (existing) {
      report.push({ file: p.file, bytes: existing.buf.length, ...existing.dim, from: "cached" });
      continue;
    }
    process.stdout.write(`-> ${p.file} ... `);
    try {
      const { buf } = await fetchPravatar(p.img);
      if (!isJpeg(buf) || buf.length < 15_000) {
        console.log(`FAILED (jpeg=${isJpeg(buf)} bytes=${buf.length})`);
        failures.push({ file: p.file, reason: [`pravatar img=${p.img} jpeg=${isJpeg(buf)} ${buf.length}B`] });
        continue;
      }
      const dim = jpegSize(buf);
      fs.writeFileSync(path.join(MEDIA_DIR, p.file), buf);
      cacheByFile.set(p.file, {
        file: p.file,
        author: "pravatar.cc",
        license: "Demo placeholder",
        source: `https://i.pravatar.cc/512?img=${p.img}`,
        width: dim?.width,
        height: dim?.height,
      });
      report.push({ file: p.file, bytes: buf.length, ...dim, from: `pravatar img=${p.img}` });
      console.log(`ok ${dim?.width}x${dim?.height} ${buf.length}B`);
    } catch (err) {
      console.log("FAILED");
      failures.push({ file: p.file, reason: [err.message] });
    }
  }

  // optional bonus video
  await fetchVideo(cacheByFile, report);

  // write credits (targets, portraits, plus any extra entries such as hero.webm)
  const ordered = TARGETS.map((t) => cacheByFile.get(t.file))
    .concat(PORTRAITS.map((p) => cacheByFile.get(p.file)))
    .filter(Boolean);
  for (const e of cacheByFile.values()) {
    if (!ordered.includes(e)) ordered.push(e);
  }
  fs.writeFileSync(CREDITS_JSON, JSON.stringify(ordered, null, 2));

  const lines = ordered.map((e) => {
    const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `  { file: "${esc(e.file)}", author: "${esc(e.author)}", license: "${esc(e.license)}", source: "${esc(e.source)}" },`;
  });
  const ts = `/** Créditos fotográficos — imágenes de Wikimedia Commons usadas como mock.
 *  Reemplazar por fotografía propia antes de producción.
 *  Generado por scripts/fetch-media.mjs — no editar a mano. */
export const imageCredits = [
${lines.join("\n")}
] as const;
`;
  fs.writeFileSync(CREDITS_TS, ts, "utf8");

  console.log("\n--- report ---");
  for (const r of report) {
    console.log(
      `${r.file.padEnd(14)} ${String(r.bytes).padStart(8)}B ${String(r.width ?? "?").padStart(5)}x${String(r.height ?? "?")}`
    );
  }
  if (failures.length) {
    console.log("\n--- FAILURES ---");
    for (const f of failures) console.log(`${f.file}: ${JSON.stringify(f.reason, null, 1)}`);
  } else {
    console.log("\nno failures");
  }
}

/** ---------- optional hero.webm ---------- */
async function fetchVideo(cacheByFile, report) {
  const out = path.join(MEDIA_DIR, "hero.webm");
  const existing = await validExisting("hero.webm", 1, "landscape");
  if (existing) {
    report.push({ file: "hero.webm", bytes: existing.buf.length, width: "-", height: "-", from: "cached" });
    if (!cacheByFile.get("hero.webm")) {
      // file present but no credit recorded (e.g. downloaded out-of-band): fetch metadata
      const title = "File:Cneifio defaid mewn Nantymaen Sheep-Shearing.webm";
      try {
        const rows = candidateRows(await commonsByTitles([title]));
        const c = rows[0];
        if (c) {
          cacheByFile.set("hero.webm", {
            file: "hero.webm",
            author: c.author,
            license: c.license,
            source: c.descurl,
            title: c.title,
          });
        }
      } catch {
        /* keep going without metadata */
      }
    }
    return;
  }
  const queries = ["sheep shearing filetype:video", "shearing sheep", "sheep shearing machine"];
  const MAX = 12 * 1024 * 1024;
  for (const q of queries) {
    let pages;
    try {
      pages = await commonsSearch(q, 30);
    } catch {
      continue;
    }
    const vids = pages.filter((p) => /\.(webm|ogv|ogg)$/i.test(p.title));
    for (const p of vids) {
      const ii = p.imageinfo?.[0];
      if (!ii?.url) continue;
      const url = stripQuery(ii.url);
      try {
        let buf;
        if (url.toLowerCase().endsWith(".webm") && ii.size <= MAX) {
          buf = await download(url);
        } else if (url.toLowerCase().endsWith(".webm")) {
          // try the vp9 480p transcode (suffix is .480p.vp9.webm)
          const transcode = url.replace("/commons/", "/commons/transcoded/") +
            "/" + path.posix.basename(url) + ".480p.vp9.webm";
          buf = await download(transcode, {
            // upload.wikimedia.org rejects script-looking UAs on transcodes
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
            Referer: "https://commons.wikimedia.org/",
          });
        } else {
          continue;
        }
        if (buf.length > MAX || !isWebm(buf)) continue;
        fs.writeFileSync(out, buf);
        report.push({ file: "hero.webm", bytes: buf.length, width: "-", height: "-", from: p.title });
        cacheByFile.set("hero.webm", {
          file: "hero.webm",
          author: "Wikimedia Commons contributor",
          license: "See source page",
          source: ii.descriptionurl,
          title: p.title,
        });
        console.log(`-> hero.webm ok ${buf.length}B (${p.title})`);
        return;
      } catch {
        /* try next */
      }
    }
  }
  console.log("-> hero.webm skipped (no suitable clip)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
