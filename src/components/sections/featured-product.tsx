"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  MessageCircle,
  Minus,
  Star,
  Truck,
} from "lucide-react";
import { featuredProduct, products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { Reveal, RevealLines } from "@/components/effects/reveal";
import { Magnetic } from "@/components/effects/magnetic";
import { formatARS } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";

/** Galería reutilizable (zoom que sigue al puntero + miniaturas). */
function Gallery() {
  return (
    <ProductGallery
      images={featuredProduct.gallery}
      name={featuredProduct.name}
      badge={featuredProduct.badge ?? "Destacado"}
    />
  );
}

const COMPARE = ["esquiladora-lister-xtr", "esquiladora-heiniger-saphir", "esquiladora-beiyuan-by88"];
const COMPARE_ROWS: { label: string; get: (i: number) => string }[] = [
  { label: "Potencia", get: (i) => (i === 2 ? "800 W equiv." : i === 1 ? "950 W" : "1.100 W") },
  { label: "Velocidad", get: (i) => (i === 2 ? "2.400 rpm" : i === 1 ? "2.500 rpm" : "2.600 rpm") },
  { label: "Alimentación", get: (i) => (i === 2 ? "Batería Li-ion" : "220 V cable 8 m") },
  { label: "Peso", get: (i) => (i === 2 ? "3,9 kg" : i === 1 ? "4,8 kg" : "5,4 kg") },
  { label: "Origen", get: (i) => (i === 2 ? "China" : i === 1 ? "Suiza" : "Reino Unido") },
  { label: "Garantía", get: (i) => (i === 2 ? "18 meses" : "24 meses") },
];

export function FeaturedProduct() {
  const compareProducts = COMPARE.map((slug) => products.find((p) => p.slug === slug)!);

  return (
    <section
      id="destacado"
      className="border-y border-border bg-surface"
      aria-labelledby="featured-title"
    >
      <div className="container-site py-20 md:py-28">
        {/* Encabezado editorial */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
              <span className="h-px w-8 bg-highlight" />
              Producto destacado
            </p>
            <h2
              id="featured-title"
              className="max-w-2xl text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              <RevealLines
                lines={[
                  <Fragment key="l1">La XTR, desarmada</Fragment>,
                  <Fragment key="l2">hasta el último tornillo.</Fragment>,
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:text-right">
              Ficha completa, comparativa real entre modelos y todo lo que necesitás para decidir
              sin sorpresas.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <Gallery />
          </Reveal>

          <Reveal delay={0.08} className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{featuredProduct.brand}</Badge>
              <Badge variant="outline">SKU {featuredProduct.sku}</Badge>
              <Badge variant="burnt">Importado {featuredProduct.origin}</Badge>
            </div>

            <h3 className="mt-4 text-3xl font-extrabold tracking-[-0.035em] md:text-4xl">
              {featuredProduct.name}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {featuredProduct.shortDescription}
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {featuredProduct.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
                  <span className="leading-snug">{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="eyebrow text-muted-foreground">Precio de lista</p>
                <p className="mt-1 font-mono text-3xl font-semibold tabular tracking-tight">
                  {formatARS(featuredProduct.price)}
                </p>
              </div>
              {featuredProduct.compareAt && (
                <p className="pb-1 font-mono text-sm text-muted-foreground line-through">
                  {formatARS(featuredProduct.compareAt)}
                </p>
              )}
              <div className="ml-auto flex items-center gap-1.5 pb-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-ochre-500 text-ochre-500" />
                <span className="font-medium text-foreground">{featuredProduct.rating}</span>
                <span>({featuredProduct.reviewCount} reseñas)</span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Magnetic strength={0.2}>
                <Button asChild variant="accent" size="lg" className="shine group" data-cursor="link">
                  <a
                    href={`${COMPANY.whatsappHref}%20—%20Quiero%20stock%20y%20precio%20de%20${encodeURIComponent(
                      featuredProduct.name,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar stock y precio
                  </a>
                </Button>
              </Magnetic>
              <Button asChild variant="outline" size="lg" data-cursor="link">
                <Link href={`/producto/${featuredProduct.slug}`}>
                  Ficha completa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Truck className="h-3.5 w-3.5" />
              Sale de Buenos Aires en 24–48 hs · factura A y B
            </p>
          </Reveal>
        </div>

        {/* Ficha técnica con tabs */}
        <Reveal delay={0.05} className="mt-14">
          <Tabs defaultValue="specs">
            <TabsList>
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              <TabsTrigger value="includes">Incluye</TabsTrigger>
              <TabsTrigger value="manuals">Manuales</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <dl className="grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProduct.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-baseline justify-between gap-4 border-b border-border py-3.5"
                  >
                    <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                    <dd className="font-mono text-sm font-medium tabular">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>

            <TabsContent value="includes" className="mt-6">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProduct.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="manuals" className="mt-6">
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProduct.downloads.map((file) => (
                  <li key={file.label}>
                    <a
                      href="#destacado"
                      className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-forest-600/40 dark:hover:border-ochre-500/40"
                      data-cursor="link"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{file.label}</span>
                        <span className="font-mono text-[0.6875rem] text-muted-foreground">
                          {file.type} · {file.size}
                        </span>
                      </span>
                      <Download className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <div className="rounded-xl border border-border bg-card p-6">
                  <p className="font-mono text-5xl font-semibold tabular tracking-tight">
                    {featuredProduct.rating}
                  </p>
                  <div className="mt-2 flex gap-1" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(featuredProduct.rating)
                            ? "fill-ochre-500 text-ochre-500"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Basado en {featuredProduct.reviewCount} compras verificadas
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Estancia La Verbena",
                      text: "Jornada completa de 600 cabezas sin calentar el motor. El arranque suave protege la cuchilla y se nota en el filo.",
                    },
                    {
                      name: "Cooperativa del Oeste",
                      text: "Compramos tres unidades para la temporada y llegaron probadas y con aceite cargado. Cero tiempo muerto.",
                    },
                  ].map((review) => (
                    <blockquote
                      key={review.name}
                      className="rounded-xl border border-border bg-card p-5"
                    >
                      <p className="text-sm leading-relaxed text-foreground/85">“{review.text}”</p>
                      <footer className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="h-1 w-1 rounded-full bg-ochre-500" />
                        {review.name} · compra verificada
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>

        {/* Tabla comparativa */}
        <Reveal delay={0.05} className="mt-14">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Compará las tres máquinas de esquilar
            </h3>
            <span className="eyebrow hidden text-muted-foreground sm:block">Actualizado 10/2026</span>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">
                Comparativa técnica entre esquiladoras LISTER XTR, Heiniger Saphir Evo y Beiyuan
                BY-88
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th scope="col" className="px-5 py-4 text-left font-medium text-muted-foreground">
                    Modelo
                  </th>
                  {compareProducts.map((p, i) => (
                    <th
                      key={p.slug}
                      scope="col"
                      className={`px-5 py-4 text-left font-semibold tracking-tight ${
                        i === 0 ? "bg-ochre-500/8" : ""
                      }`}
                    >
                      <Link href={`/producto/${p.slug}`} className="hover:text-forest-600 dark:hover:text-ochre-400">
                        {p.name.replace("Esquiladora ", "")}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th scope="row" className="px-5 py-3.5 text-left font-normal text-muted-foreground">
                      {row.label}
                    </th>
                    {compareProducts.map((p, i) => (
                      <td key={p.slug} className={`px-5 py-3.5 font-mono tabular ${i === 0 ? "bg-ochre-500/8" : ""}`}>
                        {row.get(i)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <th scope="row" className="px-5 py-4 text-left font-medium text-muted-foreground">
                    Precio
                  </th>
                  {compareProducts.map((p, i) => (
                    <td
                      key={p.slug}
                      className={`px-5 py-4 font-mono font-semibold tabular ${i === 0 ? "bg-ochre-500/8" : ""}`}
                    >
                      {formatARS(p.price, true)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Minus className="h-3 w-3" />
            Precios de lista sin IVA incluido para reventa. Consultá por condiciones de distribuidor.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
