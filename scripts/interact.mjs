/**
 * QA de interacciones: cotizador, tabs del destacado, quick-view del catálogo.
 * Uso: node scripts/interact.mjs  (requiere `npm i --no-save puppeteer`)
 */
import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, ".shots");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function hideOverlay(page) {
  await page.evaluate(() => {
    document.querySelectorAll("nextjs-portal").forEach((el) => el.remove());
  });
}

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--force-device-scale-factor=1"],
});

try {
  await mkdir(out, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // ---------- 1. Cotizador: calcular ----------
  await page.goto(`${BASE}/#cotizador`, { waitUntil: "load", timeout: 60000 });
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
  await sleep(1500);
  await page.evaluate(() => {
    document.querySelector("#cotizador")?.scrollIntoView();
  });
  await sleep(800);
  await hideOverlay(page);

  // Buscamos el botón por texto (:has-text es de Playwright, acá iteramos)
  let target = null;
  for (const b of await page.$$("button")) {
    const t = await b.evaluate((el) => el.textContent?.trim() ?? "");
    if (t.startsWith("Calcular cotización")) {
      target = b;
      break;
    }
  }
  if (target) {
    await target.click();
    await sleep(400);
    await page.screenshot({ path: path.join(out, "70-cotizador-loading.png") });
    console.log("✓ 70-cotizador-loading");
    await sleep(1200);
    await page.screenshot({ path: path.join(out, "71-cotizador-ready.png") });
    console.log("✓ 71-cotizador-ready");
  } else {
    console.log("✗ botón Calcular no encontrado");
  }

  // Cambiar provincia a Patagonia para verificar el cálculo de envío
  const selects = await page.$$("#cotizador select");
  if (selects.length > 1) {
    await selects[1].select("chubut");
    await sleep(300);
    for (const b of await page.$$("button")) {
      const t = await b.evaluate((el) => el.textContent?.trim() ?? "");
      if (t.startsWith("Calcular cotización")) {
        await b.click();
        break;
      }
    }
    await sleep(1600);
    await page.screenshot({ path: path.join(out, "72-cotizador-chubut.png") });
    console.log("✓ 72-cotizador-chubut");
  }

  // ---------- 2. Tabs del producto destacado ----------
  await page.evaluate(() => document.querySelector("#destacado")?.scrollIntoView());
  await sleep(700);
  const tabs = await page.$$('[role="tab"]');
  if (tabs.length > 2) {
    await tabs[2].click();
    await sleep(600);
    await hideOverlay(page);
    await page.screenshot({ path: path.join(out, "73-destacado-tab.png") });
    console.log("✓ 73-destacado-tab (tab 3 de", tabs.length, ")");
  }

  // ---------- 3. Quick-view del catálogo ----------
  await page.goto(`${BASE}/catalogo`, { waitUntil: "load", timeout: 60000 });
  await sleep(1500);
  await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
  // Hover de la primera card para disparar data-cursor="view" y click
  const firstCard = await page.$('a[href^="/producto/"]');
  if (firstCard) {
    await firstCard.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await sleep(500);
    await firstCard.click();
    await sleep(1500);
    await hideOverlay(page);
    await page.screenshot({ path: path.join(out, "74-producto-nav.png") });
    console.log("✓ 74-producto-nav", await page.evaluate(() => location.pathname));
  }

  // ---------- 4. Búsqueda con sugerencias ----------
  // En dev la hidratación puede llegar tarde: reintentamos hasta ver la señal
  // de estado reactivo (botón "Limpiar búsqueda", que solo existe con query).
  let searchOk = false;
  for (let attempt = 1; attempt <= 3 && !searchOk; attempt++) {
    await page.goto(`${BASE}/catalogo`, { waitUntil: "load", timeout: 60000 });
    await sleep(1500 + attempt * 1500);
    const search = await page.$("#catalog-search");
    if (!search) break;
    await search.click();
    await page.keyboard.type("li", { delay: 70 });
    try {
      await page.waitForFunction(
        () => !!document.querySelector('button[aria-label="Limpiar búsqueda"]'),
        { timeout: 6000 },
      );
    } catch {
      console.log(`! búsqueda intento ${attempt}: estado no hidratado`);
      continue;
    }
    await page.keyboard.type("ster", { delay: 60 });
    await sleep(700);
    searchOk = !!(await page.$('[role="listbox"]'));
    if (searchOk) {
      await hideOverlay(page);
      await page.screenshot({ path: path.join(out, "75-busqueda-sugerencias.png") });
      console.log("✓ 75-busqueda-sugerencias");
    } else {
      console.log(`! búsqueda intento ${attempt}: sin listbox`);
    }
  }
  if (!searchOk) console.log("✗ 75-busqueda-sugerencias no capturado");

  // ---------- 5. Newsletter inválido (validación Zod) ----------
  // Señal de éxito: aria-invalid + mensaje de error y URL sin navegar.
  // Si el submit navega (?email=) es que aún no hidrató → reintenta.
  let newsOk = false;
  for (let attempt = 1; attempt <= 3 && !newsOk; attempt++) {
    await page.goto(`${BASE}/`, { waitUntil: "load", timeout: 60000 });
    await sleep(1500 + attempt * 1500);
    await page.evaluate(() => (document.documentElement.style.scrollBehavior = "auto"));
    await page.evaluate(() => document.querySelector("footer")?.scrollIntoView());
    await sleep(600);
    const email = await page.$("#newsletter-email");
    if (!email) {
      console.log("✗ input de newsletter no encontrado");
      break;
    }
    await email.click({ clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.keyboard.type("no-es-un-email", { delay: 30 });
    const form = await page.evaluateHandle((el) => el.closest("form"), email);
    await form.asElement()?.evaluate((f) => f.requestSubmit());
    await sleep(900);
    const res = await page.evaluate(() => ({
      nav: location.search.includes("email="),
      invalid: document.querySelector("#newsletter-email")?.getAttribute("aria-invalid"),
      err: document.querySelector("#newsletter-error")?.textContent?.trim() || "",
    }));
    newsOk = !res.nav && res.invalid === "true" && res.err.length > 0;
    if (newsOk) {
      await hideOverlay(page);
      await page.screenshot({ path: path.join(out, "76-newsletter-error.png") });
      console.log("✓ 76-newsletter-error");
    } else {
      console.log(`! newsletter intento ${attempt} falló:`, JSON.stringify(res));
    }
  }
  if (!newsOk) console.log("✗ 76-newsletter-error no capturado");
} finally {
  await browser.close();
}
console.log("Listo:", out);
