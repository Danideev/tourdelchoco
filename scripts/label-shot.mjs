// One-off: envuelve un screenshot en una imagen etiquetada (salta el caché de lectura)
import fs from "node:fs";
import puppeteer from "puppeteer";

const [src, dest, label] = process.argv.slice(2);
const data = fs.readFileSync(src).toString("base64");

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
const png = fs.readFileSync(src);
// Altura del PNG (bytes 20-23 del IHDR, big-endian)
const h = png.readUInt32BE(20);
const VH = Math.min(h + 60, 12000);
await page.setViewport({ width: 1440, height: VH });
await page.setContent(
  `<style>body{margin:0;font:700 34px system-ui;background:#000;color:#39ff14}
   .l{padding:10px 16px;letter-spacing:.08em}img{width:1440px;display:block}</style>
   <div class="l">${label}</div><img src="data:image/png;base64,${data}">`,
  { waitUntil: "load" },
);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: dest });
await browser.close();
console.log("ok", dest);
