// ¿En qué páginas aparece el warning de key (RSC)?
import puppeteer from "puppeteer-core";

const BASE = "http://localhost:3000";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

let count = 0;
page.on("console", (m) => {
  if (m.text().includes('unique "key"')) count++;
});

for (const route of ["/", "/catalogo", "/recursos", "/recursos/mantenimiento-de-cuchillas", "/producto/esquiladora-lister-xtr"]) {
  count = 0;
  await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 60000 });
  await sleep(2500);
  console.log(`${route} → ${count} warning(s)`);
}

await browser.close();
