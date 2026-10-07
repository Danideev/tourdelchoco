# AGROPYME S.R.L. — Sitio corporativo + catálogo B2B

Landing institucional, catálogo de productos y generador de leads para **AGROPYME S.R.L.**, importadora argentina de maquinaria de esquilar, tijeras y cuchillas, lubricantes y repuestos.

Propuesta de trabajo freelance: sitio **"agency-grade"** — sistema de diseño propio, animación con narrativa, modo oscuro completo, catálogo con fichas de producto, cotizador interactivo y contenido editorial.

> **Arranque rápido**

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción (rutas 100 % estáticas)
# ⚠️ Nunca corras `npm run build` con `next dev` levantado: el build limpia `.next/`
# y rompe el dev server (500 + CSS sin compilar). Detené el dev primero.
npm start          # sirve el build
npm run lint       # ESLint — 0 errores / 0 warnings
```

Requisitos: **Node.js ≥ 20**. No requiere variables de entorno ni servicios externos: todo el contenido está mockeado en `content/*.json` (editable sin tocar código).

---

## Stack

| Capa | Elección | Por qué |
| --- | --- | --- |
| Framework | **Next.js 15.5** (App Router) + React 19 | SSG de catálogo/fichas/blog, `generateMetadata` por ruta, listo para Vercel |
| Lenguaje | **TypeScript** estricto | Tipos compartidos entre datos mock y UI (`tsc --noEmit` limpio) |
| Estilos | **Tailwind CSS v4** (CSS-first, `@theme` en `globals.css`) | Tokens de diseño como variables nativas: light/dark sin duplicar clases |
| Componentes | Base **shadcn/ui** construida a mano sobre **Radix UI** + **cva** | Accesibilidad y comportamiento sin dependencia de generadores |
| Animación | **Framer Motion** (micro-interacciones) + **GSAP ScrollTrigger** (parallax) | Framer para estados/entradas; GSAP para scroll *scrub* con más control |
| Formularios | **React Hook Form + Zod** | Validación declarativa en newsletter, distribuidores y cotizador |
| Iconos | **Lucide React** + iconos de marca SVG propios (`src/components/icons`) | Lucide ya no distribuye iconos de marca |
| Tipografía | **Geist Sans / Geist Mono** (paquete `geist`) | Variables locales: sin requests a CDNs → builds offline y sin CLS |
| Toasts / tema | **sonner** + **next-themes** (estrategia `class`) | Toggle persistente sin flash (script inline en el layout) |

---

## Estructura

```
src/
├── app/
│   ├── layout.tsx              # fuentes, metadatos, skip-link, providers
│   ├── page.tsx                # landing (13 secciones)
│   ├── catalogo/               # listado + filtros + búsqueda + quick-view
│   ├── producto/[slug]/        # ficha completa (SSG de 12 productos)
│   ├── recursos/               # índice + recursos/[slug] (3 artículos)
│   ├── not-found.tsx · sitemap.ts · robots.ts
│   └── globals.css             # sistema de diseño (tokens, grano, keyframes)
├── components/
│   ├── ui/                     # button, badge, card, tabs, dialog, form-fields…
│   ├── effects/                # reveal, marquee, count-up, magnetic, cursor, scroll-progress
│   ├── layout/                 # site-header, site-footer, logo, providers
│   ├── sections/               # hero, trust-bar, categories, featured-product, why-bento,
│   │                           # about, quote-calculator, testimonials, distributors, blog
│   ├── catalog/ · product/ · blog/ · icons/
├── data/
│   ├── products.ts             # loader: catálogo (zod) + helpers
│   ├── site.ts                 # loader: stats, bento, testimonios, posts, provincias
│   ├── post-body.ts            # loader: cuerpo tipado de los artículos
│   └── image-credits.ts        # créditos y licencias de cada imagen
└── lib/                        # constants (loader de empresa.json), animations, utils, use-mounted
content/                        # ← CONTENIDO EDITABLE (JSON validado con zod)
├── productos.json              # categorías, marcas y 13 productos
├── articulos.json              # posts + cuerpos (bloques p/h2/list/quote/note)
├── sitio.json                  # stats, beneficios, provincias
├── testimonios.json            # testimonios de clientes
└── empresa.json                # contacto, menú, redes, footer
scripts/
├── fetch-media.mjs             # descarga y acredita imágenes (una sola vez)
├── verify-media.mjs            # valida integridad/duplicados
└── shoot.mjs · interact.mjs · probe.mjs · scan-keys*.mjs   # QA visual con Puppeteer
```

---

## Sistema de diseño — "Industrial Editorial"

**Tokens** (`src/app/globals.css`, bloque `@theme`):

| Rol | Light | Dark |
| --- | --- | --- |
| `--background` (bone) | `#F5F3EF` | `#0A0A0A` |
| `--foreground` | `#1A1A1A` | `#F5F3EF` |
| `--primary` (forest) | `#0F3D2E` | `#1C5C45` |
| `--accent` (ochre) | `#E8B923` | `#E8B923` |
| `--secondary` (quemado) | `#C6551F` | `#D9631F` |
| `--border` | `#DDD8CC` | `#242726` |

- **Radio 8–16 px, nunca circular** (cards `rounded-xl`, botones `rounded-lg`, paneles `rounded-2xl`).
- **Grano SVG global** al 3 % de opacidad (`.grain::after`) — textura de papel/taller sin imágenes extra.
- **Cursor custom** (punto + anillo con `data-cursor="link|view"`), desactivado en táctil y con `prefers-reduced-motion`.
- **Modo oscuro por defecto light + toggle** persistente; el hero es cinematográfico en ambos temas (scrim propio, no hereda `--background`).
- **Rejilla editorial asimétrica**: grillas 12-col con spans 7/5 y 8/4, títulos `clamp()` que ocupan el ancho útil y texto técnico denso (mono, tracking amplio) en bloques de datos.

---

## Decisiones técnicas (las que no son evidentes)

1. **`RevealLines` observa el contenedor, no el texto** — `src/components/effects/reveal.tsx`. El span animado arranca trasladado fuera de un `overflow-hidden`: IntersectionObserver calcula intersección 0 y `whileInView` nunca dispararía (titular invisible para siempre). Se observa la máscara con `useInView` y se anima el hijo.
2. **Parallax del hero con GSAP, ken burns con CSS** — `src/components/sections/hero.tsx`. Van en elementos distintos: las CSS animations le ganan a los estilos inline que escribe GSAP, así que el wrapper hace el *scrub* (`yPercent −5 → 5`) y el `<img>` hace su zoom lento.
3. **Header con scrim propio por tema** — `src/components/layout/site-header.tsx`. Sobre la foto oscura del hero, `--foreground` claro en light daba ~3:1; la barra usa `bg-background/75` en light y `bg-forest-950/60` en dark para garantizar AA en ambos estados (scrolled/unscrolled).
4. **Imágenes locales en `/public/media`** — sin `remotePatterns`, sin hotlink: builds deterministas, sin rate-limits de terceros. Los créditos viven en `src/data/image-credits.ts` y se renderizan en el footer.
5. **Cotizador con estado `simulating → ready`** — `src/components/sections/quote-calculator.tsx`. Muestra el estimado al instante (subtotal/envío/total calculados localmente) y el botón dispara una simulación de `POST /api/quote` (skeleton + badge "stock verificado"). El CTA arma un mensaje de WhatsApp pre-cargado: el flujo real se puede conectar sin tocar la UI.
6. **Contenido tipado en bloques** — `src/data/post-body.ts` (`p | h2 | list | quote | note`) en lugar de HTML crudo: el renderer de `app/recursos/[slug]` controla tipografía, marcadores y accesibilidad.
7. **`useSyncExternalStore` para medición del cliente** — `src/lib/use-mounted.ts`. Evita hidratación asimétrica y cumple `react-hooks/set-state-in-effect` (regla habilitada, no deshabilitada).
8. **Rutas 100 % estáticas** — `generateStaticParams` en productos y artículos: todo el sitio se pre-renderiza en build (ideal para CDN/Vercel).
9. **`lines={[<>…</>]}` necesita `Fragment key`** — los arrays de líneas que viajan como prop a `RevealLines` se validan al serializar en RSC: sin `key`, React emite `Each child in a list should have a unique "key" prop` en cada SSR de `/` y `/recursos`. Se usan `<Fragment key="l1">…` en los 6 call sites (`scan-keys.mjs` los audita).
10. **Contenido en JSON validado con zod** — `content/*.json` como fuente editable y loaders tipados en `src/data` que hacen `parse()` en init. JSON puro daría `string` donde el código espera uniones literales (`CategoryId`, `origin`, íconos de redes); el schema resuelve ambos mundos: errores claros en build y tipos precisos para la UI.

---

## Rendimiento y accesibilidad

- **LCP**: imagen del hero con `fetchPriority="high"` y scrim que evita repintados; el resto con `loading="lazy"`.
- **Sin fuentes remotas** (`geist` local) → sin `font-display` swap de CDN ni CLS por fuentes.
- **AA**: se verificó contraste por muestreo de píxeles en header, hero, cotizador y footer. Focus visible en todo (`focus-visible` en `globals.css`).
- **`prefers-reduced-motion`**: Framer (`useReducedMotion`), GSAP (no se registra) y CSS (ken burns/marquee) lo respetan; el contenido se muestra estático.
- **Estructura semántica**: `header/main/section[aria-labelledby]/footer`, skip-link, `aria-label` en controles iconográficos, `aria-live` en el cotizador.
- **Auditoría**: objetivo Lighthouse ≥ 95 perf / 100 a11y. Las capturas de QA viven en `.shots/` (ignoradas por git).

---

## Contenido editable (JSON)

El contenido del sitio vive en **`content/*.json`**: el cliente puede editar catálogo, artículos, testimonios y datos de contacto **sin tocar TypeScript**.

| Archivo | Qué contiene |
| --- | --- |
| `content/productos.json` | categorías, marcas y los 13 productos (specs, incluye, descargas, relacionados) |
| `content/articulos.json` | índice de notas (`posts`) + cuerpos (`bodies`: bloques `p / h2 / list / quote / note`) |
| `content/sitio.json` | stats, bento de beneficios y provincias con costos/plazos de envío |
| `content/testimonios.json` | testimonios de clientes |
| `content/empresa.json` | datos de contacto, menú principal, redes y columnas del footer |

Los loaders (`src/data/*.ts`, `src/lib/constants.ts`) importan esos JSON y los **validan con zod** al cargar: un campo faltante o un valor fuera de catálogo (categoría, origen, badge, ícono de red) rompe en `npm run build` con el path exacto del error, no en runtime. `COMPANY.phoneHref` y `whatsappHref` se derivan de los números del JSON (el cliente edita un solo campo).

El copy de interfaz (titulares de sección, microcopy, labels) queda en los componentes: es parte del sistema de diseño, no del contenido. La estructura de cada campo se documenta en los schemas de zod junto a cada loader.

Para producción: reemplazar por un CMS (Sanity/Contentful/Strapi) o por API propia. El shape de `Product` ya es compatible con una respuesta de e-commerce headless.

---

## Imágenes: créditos y licencias

Las fotos son **placeholders de Wikimedia Commons** (licencias CC BY / CC BY-SA / CC0 / dominio público) y retratos de `i.pravatar.cc`, descargadas localmente. Los créditos completos —autor, licencia y URL de origen— están en `src/data/image-credits.ts` y se listan en el footer.

> ⚠️ **Antes de producción**: sustituir por fotografía propia o licenciada. La licencia CC BY-SA exige atribución (ya implementada) pero no permite uso comercial en todos los casos; verificar caso por caso. `scripts/fetch-media.mjs` regenera el set y los créditos.

---

## QA visual (herramientas del desarrollo)

```bash
npm i --no-save puppeteer      # una sola vez
node scripts/shoot.mjs         # 23 capturas en .shots/ (desktop, dark, mobile, menú)
node scripts/interact.mjs      # cotizador, tabs, búsqueda, newsletter (70–76)
node scripts/probe.mjs         # estilos computados del header (contraste)
node scripts/scan-keys.mjs     # estático: maps sin key= en JSX
node scripts/scan-keys-runtime.mjs  # dinámico: warnings de key por ruta (RSC)
node scripts/label-shot.mjs <src> <dest> <label>   # captura con etiqueta (para revisión)
```

`shoot.mjs` recorre la página para disparar los `IntersectionObserver`, oculta el overlay de devtools de Next y captura el viewport real (sin `clip`, que usaría coordenadas de documento y perdería los elementos `fixed`).

`interact.mjs` valida interacciones reales con reintentos: en `next dev` la hidratación puede llegar tarde, así que cada paso espera una **señal de estado reactivo** (p. ej. el botón "Limpiar búsqueda" del catálogo, que solo existe con `query ≠ ""`) antes de interactuar, y verifica el resultado antes de capturar.

---

## Deploy

**Demo en vivo: https://agropyme.vercel.app** — Vercel, build automático en cada push a `main` (repo `Danideev/tourdelchoco` conectado al proyecto `agropyme`).

```bash
npm run build && npm start     # verificación local
vercel                         # deploy preview / --prod para producción
```

Sin variables de entorno. Si se conecta el cotizador a un backend, agregar `QUOTE_API_URL` y `WHATSAPP_NUMBER` a `.env.local`.

---

## Roadmap sugerido

1. **CMS + e-commerce headless** (catálogo y notas pasan a ser editables).
2. **Endpoint real de cotización** (el flujo `simulating → ready` ya está preparado) + CRM/mail para leads B2B.
3. **3D opcional con React Three Fiber** (monograma "A" extruido en el bento) — evaluado y pospuesto por presupuesto de performance.
4. **Más notas de recursos** (SEO de rubro) + JSON-LD ya preparado en cada artículo.
5. **i18n es-AR / pt-BR** si se abre la exportación regional.

---

### Estructura de animación — mapa rápido

| Efecto | Dónde | Cómo |
| --- | --- | --- |
| Titulares con máscara | todos los H1/H2 | `RevealLines` |
| Stagger de grids | categorías, bento, posts | `RevealGroup` + `RevealItem` |
| Parallax cinematográfico | hero | GSAP `ScrollTrigger` (`scrub`) |
| Marquee de marcas | hero + trust bar | `Marquee` (CSS, pausable en hover) |
| Botón magnético | CTAs principales | `Magnetic` (spring hacia el puntero) |
| Contadores | stats | `CountUp` (IntersectionObserver) |
| Progreso de lectura | global | `ScrollProgress` (barra superior) |
| Zoom de imagen en card | cards/producto | `group-hover:scale-[1.07]` + overlay |
