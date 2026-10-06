// Montaje de los 5 retratos con etiquetas (una sola captura = orden garantizado)
import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync } from "fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const files = [1, 2, 3, 4, 5].map((n) => `portrait-0${n}.jpg`);
const imgs = files
  .map((f) => {
    const b64 = readFileSync(path.join(root, "public", "media", f)).toString("base64");
    return `<figure><img src="data:image/jpeg;base64,${b64}"><figcaption>${f}</figcaption></figure>`;
  })
  .join("");

const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#111;color:#eee;font:16px monospace;display:grid;
       grid-template-columns:repeat(3,1fr);gap:8px;padding:8px}
  figure{margin:0} img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
  figcaption{padding:6px;background:#000;color:#ffd166;font-size:20px;text-align:center}
</style>${imgs}`;

writeFileSync(path.join(root, ".shots", "_montaje-retratos.html"), html);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900 });
await page.goto("file:///" + path.join(root, ".shots", "_montaje-retratos.html").replace(/\\/g, "/"));
await page.screenshot({ path: path.join(root, ".shots", "portraits-montage.png"), fullPage: true });
await browser.close();
console.log("montaje listo: .shots/portraits-montage.png");
