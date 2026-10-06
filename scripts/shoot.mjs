/**
 * Captura screenshots con Puppeteer para revisión visual del sitio.
 * Uso: node scripts/shoot.mjs   (requiere `npm i --no-save puppeteer`)
 * No forma parte del proyecto: es una herramienta de QA del desarrollador.
 */
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, ".shots");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Oculta el overlay de devtools de Next (puerta "N" + badge de issues) en las capturas. */
async function hideDevOverlay(page) {
  const issues = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("nextjs-portal").forEach((el) => {
      const txt = el.shadowRoot?.textContent?.replace(/\s+/g, " ").trim();
      if (txt) out.push(txt.slice(0, 400));
      el.remove();
    });
    document
      .querySelectorAll('[id*="__nextjs"], [class*="__nextjs"]')
      .forEach((el) => el.remove());
    return out;
  });
  if (issues.length) console.log("⚠ dev overlay:", issues.join(" | "));
}

/** Recorre la página para disparar los IntersectionObserver de los reveals. */
async function warmup(page) {
  await page.evaluate(async () => {
    // Desactiva el smooth scroll: si no, los screenshots se toman a mitad
    // de la animación de scroll y quedan en la posición equivocada.
    document.documentElement.style.scrollBehavior = "auto";
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 400));
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 500));
  });
}

async function shoot(page, name, opts = {}) {
  await hideDevOverlay(page);
  const y = await page.evaluate(() => Math.round(window.scrollY)).catch(() => null);
  await page.screenshot({ path: path.join(out, `${name}.png`), ...opts });
  console.log("✓", name, y === null ? "" : `(scroll ${y})`);
}

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
});

try {
  await mkdir(out, { recursive: true });

  // ---------- Desktop ----------
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 });
  await sleep(1500);
  await warmup(page);

  // Nota: NO usar `clip` con coordenadas de documento — los elementos fixed
  // solo se pintan dentro del viewport. Sin clip, Puppeteer captura el
  // viewport actual (posición + header fijo incluidos).
  await shoot(page, "01-hero");
  await shoot(page, "02-full", { fullPage: true });

  // Vistas detalladas de secciones
  const sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll("section, footer")).map((el, i) => ({
      i,
      top: el.getBoundingClientRect().top + window.scrollY,
      h: el.getBoundingClientRect().height,
      id: el.id || el.getAttribute("aria-label") || el.tagName.toLowerCase(),
    })),
  );
  let n = 3;
  for (const s of sections) {
    if (s.h < 200) continue;
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, s.top - 40));
    await sleep(700);
    await shoot(page, `${String(n).padStart(2, "0")}-sec-${s.id.replace(/[^a-z0-9]+/gi, "-")}`);
    n++;
    if (n > 14) break;
  }

  // Dark mode
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
  });
  await sleep(600);
  await shoot(page, "90-hero-dark");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await sleep(700);
  await shoot(page, "91-mid-dark");
  await page.evaluate(() => document.documentElement.classList.remove("dark"));

  // Catálogo + ficha de producto
  await page.goto(`${BASE}/catalogo`, { waitUntil: "load", timeout: 60000 });
  await sleep(1200);
  await warmup(page);
  await shoot(page, "40-catalogo");
  await shoot(page, "41-catalogo-full", { fullPage: true });

  // Recursos: índice + artículo
  await page.goto(`${BASE}/recursos`, { waitUntil: "load", timeout: 60000 });
  await sleep(1000);
  await warmup(page);
  await shoot(page, "45-recursos");
  await page.goto(`${BASE}/recursos/mantenimiento-de-cuchillas`, {
    waitUntil: "load",
    timeout: 60000,
  });
  await sleep(1000);
  await warmup(page);
  await shoot(page, "46-recurso-full", { fullPage: true });

  await page.goto(`${BASE}/producto/esquiladora-lister-xtr`, {
    waitUntil: "load",
    timeout: 60000,
  });
  await sleep(1200);
  await warmup(page);
  await shoot(page, "50-producto");
  await shoot(page, "51-producto-full", { fullPage: true });
  await page.close();

  // ---------- Mobile ----------
  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await mobile.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 });
  await sleep(1200);
  await warmup(mobile);
  await shoot(mobile, "60-mobile-hero", {});
  await shoot(mobile, "61-mobile-full", { fullPage: true });

  // Menú hamburguesa
  await mobile.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  const btn = await mobile.$('button[aria-label="Abrir menú de navegación"]');
  if (btn) {
    await btn.click();
    await sleep(900);
    await shoot(mobile, "62-mobile-menu", {});
  }
  await mobile.close();
} finally {
  await browser.close();
}
console.log("Listo:", out);
