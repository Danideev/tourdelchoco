/** Probe rápido: colores/legibilidad del header fijo en light y dark, arriba y scrolleado. */
import puppeteer from "puppeteer";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
});

const colors = () => {
  const pick = (el) => (el ? getComputedStyle(el).color : null);
  const logo = document.querySelector('header a[aria-label*="inicio"] span span');
  const nav = document.querySelector("header nav a");
  const bar = document.querySelector("header > div:last-child > div");
  return {
    logo: pick(logo),
    nav: pick(nav),
    barBg: bar ? getComputedStyle(bar).backgroundColor : null,
    barBackdrop: bar ? getComputedStyle(bar).backdropFilter : null,
  };
};

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2000);

  console.log("LIGHT top:", JSON.stringify(await page.evaluate(colors)));
  await page.screenshot({ path: ".shots/probe-light-top.png", clip: { x: 0, y: 0, width: 1440, height: 320 } });

  await page.evaluate(() => window.scrollTo(0, 1400));
  await sleep(900);
  console.log("LIGHT scrolled:", JSON.stringify(await page.evaluate(colors)));
  await page.screenshot({ path: ".shots/probe-light-scrolled.png", clip: { x: 0, y: 0, width: 1440, height: 320 } });

  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
    window.scrollTo(0, 0);
  });
  await sleep(900);
  console.log("DARK top:", JSON.stringify(await page.evaluate(colors)));
  await page.screenshot({ path: ".shots/probe-dark-top.png", clip: { x: 0, y: 0, width: 1440, height: 320 } });
} finally {
  await browser.close();
}
