"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  MessageCircle,
  Minus,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product/product-card";
import { Magnetic } from "@/components/effects/magnetic";
import { formatARS } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [qty, setQty] = useState(1);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/producto/${product.slug}`);
      toast.success("Enlace copiado", { description: "Listo para pegar en tu consulta." });
    } catch {
      toast.error("No pudimos copiar el enlace");
    }
  };

  const waMessage = encodeURIComponent(
    `Hola AGROPYME, quiero consultar por ${product.name} (${product.sku})${qty > 1 ? ` x ${qty} unidades` : ""}.`,
  );

  return (
    <div className="container-site pb-20 pt-10 md:pb-28">
      {/* Migas */}
      <nav aria-label="Migas de pan" className="eyebrow mb-8 flex flex-wrap items-center gap-2 text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/catalogo" className="transition-colors hover:text-foreground">
          Catálogo
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Galería */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery
            images={product.gallery}
            name={product.name}
            badge={product.badge}
          />
        </div>

        {/* Ficha comercial */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{product.brand}</Badge>
            <Badge variant="outline">SKU {product.sku}</Badge>
            <Badge variant="burnt">Importado {product.origin}</Badge>
          </div>

          <h1 className="mt-4 text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold leading-[1.03] tracking-[-0.04em]">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-ochre-500 text-ochre-500" />
              <strong className="font-semibold text-foreground">{product.rating}</strong>
            </span>
            <span>·</span>
            <span>{product.reviewCount} reseñas verificadas</span>
            <span>·</span>
            <span>{product.inStock ? "En stock" : "Bajo pedido"}</span>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
            {product.shortDescription}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
                <span className="leading-snug">{h}</span>
              </li>
            ))}
          </ul>

          {/* Precio + cantidad */}
          <div className="mt-7 rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-muted-foreground">Precio de lista</p>
                <p className="mt-1 font-mono text-3xl font-semibold tabular tracking-tight">
                  {formatARS(product.price * qty)}
                </p>
                {product.compareAt && qty === 1 && (
                  <p className="font-mono text-sm text-muted-foreground line-through">
                    {formatARS(product.compareAt)}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {qty > 1 ? `${qty} × ${formatARS(product.price)}` : "IVA no incluido"} · factura A y B
                </p>
              </div>

              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  aria-label="Restar una unidad"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center rounded-lg border border-border transition-colors hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  aria-label="Cantidad"
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="h-11 w-16 rounded-lg border border-input bg-background px-2 text-center font-mono text-sm tabular outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25"
                />
                <button
                  type="button"
                  aria-label="Sumar una unidad"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-11 w-11 place-items-center rounded-lg border border-border transition-colors hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Magnetic strength={0.2} className="flex-1">
                <Button
                  asChild
                  variant="accent"
                  size="lg"
                  className="shine group w-full"
                  data-cursor="link"
                >
                  <a
                    href={`${COMPANY.whatsappHref}%20${waMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Consultar stock y precio
                  </a>
                </Button>
              </Magnetic>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={copyLink}
                aria-label="Copiar enlace del producto"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Trust */}
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-lg bg-muted p-4">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
              <p className="text-xs leading-snug">
                <strong className="font-semibold">Envío 48 hs</strong> a todo el país con
                seguimiento.
              </p>
            </li>
            <li className="flex items-start gap-3 rounded-lg bg-muted p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
              <p className="text-xs leading-snug">
                <strong className="font-semibold">Garantía de fábrica</strong> con servicio técnico
                propio.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Detalle técnico */}
      <section className="mt-14" aria-label="Detalle técnico del producto">
        <Tabs defaultValue="specs">
          <TabsList>
            <TabsTrigger value="specs">Especificaciones</TabsTrigger>
            <TabsTrigger value="includes">Qué incluye</TabsTrigger>
            <TabsTrigger value="downloads">Descargas</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>

          <TabsContent value="specs">
            <dl className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
              {product.specs.map((spec) => (
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

          <TabsContent value="includes">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.includes.map((item) => (
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

          <TabsContent value="downloads">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.downloads.map((file) => (
                <li key={file.label}>
                  <a
                    href="#contenido"
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

          <TabsContent value="reviews">
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="font-mono text-5xl font-semibold tabular tracking-tight">
                  {product.rating}
                </p>
                <div className="mt-2 flex gap-1" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.rating)
                          ? "fill-ochre-500 text-ochre-500"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Basado en {product.reviewCount} compras verificadas
                </p>
              </div>
              <div className="space-y-4">
                <blockquote className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm leading-relaxed text-foreground/85">
                    “Llegó con el filo listo y el manual en español. Lo usamos toda la temporada
                    sin una sola parada.”
                  </p>
                  <footer className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-ochre-500" />
                    Marcelo Duarte · Estancia La Verbena · compra verificada
                  </footer>
                </blockquote>
                <blockquote className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm leading-relaxed text-foreground/85">
                    “Pedimos repuestos y llegaron en 48 hs con factura y garantía. Eso es lo que
                    nos hace volver.”
                  </p>
                  <footer className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-ochre-500" />
                    Federico Aguirre · Agrícola Sur · compra verificada
                  </footer>
                </blockquote>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10" aria-labelledby="related-title">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3 text-highlight">También necesitás</p>
              <h2 id="related-title" className="text-2xl font-extrabold tracking-[-0.035em]">
                Productos relacionados
              </h2>
            </div>
            <Link
              href="/catalogo"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Ver catálogo
              <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
