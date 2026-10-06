"use client";

import { Fragment, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, Loader2, MessageCircle, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";
import { PROVINCES } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Label, Select, FieldError } from "@/components/ui/form-fields";
import { Reveal, RevealLines } from "@/components/effects/reveal";
import { formatARS } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";

/**
 * COTIZADOR INTERACTIVO
 * Simula el flujo real de cotización B2B/B2C: producto + volumen + destino
 * → estimación de precio, envío y plazo. El CTA arma un mensaje de WhatsApp
 * pre-cargado (mock funcional, demuestra el thinking de UX).
 */
export function QuoteCalculator() {
  const [productSlug, setProductSlug] = useState(products[0].slug);
  const [qty, setQty] = useState(1);
  const [provinceId, setProvinceId] = useState<string>(PROVINCES[0].id);
  const [error, setError] = useState<string | undefined>();
  const [simulating, setSimulating] = useState(false);
  const [ready, setReady] = useState(false);

  const product = products.find((p) => p.slug === productSlug)!;
  const province = PROVINCES.find((p) => p.id === provinceId)!;

  const quote = useMemo(() => {
    const subtotal = product.price * qty;
    const discountRate = qty >= 20 ? 0.15 : qty >= 10 ? 0.12 : qty >= 5 ? 0.08 : 0;
    const discount = Math.round(subtotal * discountRate);
    const freeShipping = subtotal - discount >= 2_000_000;
    const shipping = freeShipping ? 0 : province.cost;
    const total = subtotal - discount + shipping;
    return { subtotal, discount, discountRate, shipping, freeShipping, total };
  }, [product, qty, province]);

  const message = useMemo(() => {
    const lines = [
      "Hola AGROPYME, quiero confirmar esta cotización:",
      `• Producto: ${product.name} (${product.sku})`,
      `• Cantidad: ${qty}`,
      `• Destino: ${province.name} (${province.zone})`,
      `• Estimado: ${formatARS(quote.total)} (${quote.shipping === 0 ? "envío incluido" : "envío " + formatARS(quote.shipping)})`,
      `• Plazo estimado: ${province.days} día${province.days === 1 ? "" : "s"} hábil${province.days === 1 ? "" : "es"}`,
    ];
    return lines.join("\n");
  }, [product, qty, province, quote]);

  const simulate = () => {
    if (qty < 1) {
      setError("Ingresá una cantidad mayor a 0.");
      return;
    }
    setError(undefined);
    setReady(false);
    setSimulating(true);
    // Simula la llamada al backend de pricing (en prod: POST /api/quote)
    setTimeout(() => {
      setSimulating(false);
      setReady(true);
    }, 900);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Resumen copiado", { description: "Pegalo en el mail o en WhatsApp." });
    } catch {
      toast.error("No pudimos copiar", { description: "Copiá el texto manualmente." });
    }
  };

  return (
    <section
      id="cotizador"
      className="relative overflow-hidden border-y border-border bg-forest-950 text-bone"
      aria-labelledby="quote-title"
    >
      <div className="absolute inset-0 opacity-[0.07]">
        {/* Textura técnica de fondo: grilla industrial */}
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            color: "#F5F3EF",
          }}
          aria-hidden="true"
        />
      </div>

      <div className="container-site relative py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* Columna izquierda: pitch + formulario */}
          <div>
            <p className="eyebrow mb-4 flex items-center gap-3 text-ochre-400">
              <span className="h-px w-8 bg-ochre-500" />
              Cotizador
            </p>
            <h2
              id="quote-title"
              className="text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              <RevealLines
                lines={[
                <Fragment key="l1">Armá tu pedido</Fragment>,
                <Fragment key="l2">y calculá el envío.</Fragment>,
              ]}
              />
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/70">
              Elegí producto, volumen y provincia. El estimado se arma al instante y te lo
              confirmamos por WhatsApp con precio final, stock y plazo de entrega.
            </p>

            <div className="mt-8 rounded-xl border border-bone/12 bg-bone/[0.04] p-6 backdrop-blur-sm">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="quote-product" className="text-bone/80">
                    Producto
                  </Label>
                  <Select
                    id="quote-product"
                    value={productSlug}
                    onChange={(e) => {
                      setProductSlug(e.target.value);
                      setReady(false);
                    }}
                    className="border-bone/20 bg-bone/5 text-bone [&>option]:bg-forest-950"
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} — {formatARS(p.price, true)}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quote-qty" className="text-bone/80">
                    Cantidad
                  </Label>
                  <div className="flex items-stretch gap-2">
                    <button
                      type="button"
                      aria-label="Restar una unidad"
                      onClick={() => {
                        setQty((q) => Math.max(1, q - 1));
                        setReady(false);
                      }}
                      className="h-11 w-11 shrink-0 rounded-lg border border-bone/20 text-bone transition-colors hover:border-ochre-500 hover:text-ochre-400"
                    >
                      −
                    </button>
                    <input
                      id="quote-qty"
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => {
                        setQty(Math.max(1, Number(e.target.value) || 1));
                        setReady(false);
                      }}
                      className="h-11 w-full rounded-lg border border-bone/20 bg-bone/5 px-3 text-center font-mono text-sm tabular text-bone outline-none focus-visible:border-ochre-500 focus-visible:ring-2 focus-visible:ring-ochre-500/30"
                    />
                    <button
                      type="button"
                      aria-label="Sumar una unidad"
                      onClick={() => {
                        setQty((q) => q + 1);
                        setReady(false);
                      }}
                      className="h-11 w-11 shrink-0 rounded-lg border border-bone/20 text-bone transition-colors hover:border-ochre-500 hover:text-ochre-400"
                    >
                      +
                    </button>
                  </div>
                  <FieldError id="quote-error" message={error} />
                </div>

                <div>
                  <Label htmlFor="quote-province" className="text-bone/80">
                    Provincia
                  </Label>
                  <Select
                    id="quote-province"
                    value={provinceId}
                    onChange={(e) => {
                      setProvinceId(e.target.value);
                      setReady(false);
                    }}
                    className="border-bone/20 bg-bone/5 text-bone [&>option]:bg-forest-950"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="accent"
                  size="lg"
                  className="shine group"
                  onClick={simulate}
                  disabled={simulating}
                  data-cursor="link"
                >
                  {simulating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Calculando…
                    </>
                  ) : (
                    <>
                      Calcular cotización
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <span className="text-xs text-bone/50">Sin registro · sin compromiso</span>
              </div>
            </div>
          </div>

          {/* Columna derecha: resumen */}
          <div className="relative">
            <div className="sticky top-28 rounded-xl border border-bone/12 bg-card p-6 text-card-foreground shadow-2xl md:p-8">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="eyebrow text-muted-foreground">Resumen estimado</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">{product.name}</p>
                </div>
                <span className="rounded-md bg-ochre-500/15 px-2.5 py-1 font-mono text-[0.6875rem] text-ochre-700 dark:text-ochre-300">
                  {product.sku}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {simulating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 py-6"
                    aria-live="polite"
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="skeleton h-5 w-full rounded" />
                    ))}
                    <p className="pt-2 text-xs text-muted-foreground">Consultando stock y tarifas…</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={ready ? "ready" : "idle"}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    aria-live="polite"
                  >
                    <dl className="space-y-3 py-5 font-mono text-sm tabular">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">
                          Subtotal ({qty} × {formatARS(product.price)})
                        </dt>
                        <dd>{formatARS(quote.subtotal)}</dd>
                      </div>
                      <div className="flex justify-between gap-4 text-forest-700 dark:text-ochre-400">
                        <dt>
                          {quote.discountRate > 0
                            ? `Descuento volumen (${Math.round(quote.discountRate * 100)} %)`
                            : "Descuento volumen"}
                        </dt>
                        <dd>{quote.discount > 0 ? `− ${formatARS(quote.discount)}` : "—"}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">
                          Envío a {province.name} · {province.days}{" "}
                          {province.days === 1 ? "día" : "días"}
                        </dt>
                        <dd>
                          {quote.shipping === 0 ? (
                            <span className="text-forest-700 dark:text-ochre-400">GRATIS</span>
                          ) : (
                            formatARS(quote.shipping)
                          )}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
                        <dt className="font-sans text-sm font-medium">Total estimado</dt>
                        <dd className="font-sans text-3xl font-semibold tracking-tight">
                          {formatARS(quote.total)}
                        </dd>
                      </div>
                    </dl>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                        <Package className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
                        <p className="text-xs leading-snug">
                          <strong className="font-semibold">{product.inStock ? "En stock" : "Bajo pedido"}</strong>{" "}
                          en Buenos Aires · {product.brand}
                        </p>
                      </div>
                      <div className="flex items-start gap-3 rounded-lg bg-muted p-4">
                        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-forest-600 dark:text-ochre-500" />
                        <p className="text-xs leading-snug">
                          <strong className="font-semibold">{province.zone}</strong> · entrega en{" "}
                          {province.days} día{province.days > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-lg border border-forest-600/20 bg-forest-600/6 p-4 dark:border-ochre-500/25 dark:bg-ochre-500/8">
                      <p className="flex items-start gap-2 text-xs leading-relaxed">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-700 dark:text-ochre-400" />
                        <span>
                          <strong className="font-semibold">Recibirás tu cotización por WhatsApp
                          en menos de 2 hs</strong> , con precio final, plazo y opciones de pago.
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        asChild
                        variant="accent"
                        size="lg"
                        className="shine group flex-1"
                        data-cursor="link"
                      >
                        <a
                          href={`${COMPANY.whatsappHref}%20${encodeURIComponent(message)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Enviar por WhatsApp
                        </a>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={copySummary}
                        aria-label="Copiar resumen de la cotización"
                      >
                        <Copy className="h-4 w-4" />
                        Copiar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!simulating && (
                <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                  {ready ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-forest-600 dark:text-ochre-400" />
                      Stock y tarifas verificados · válido por 24 hs
                    </>
                  ) : (
                    "Estimado al instante. Presioná “Calcular cotización” para validar stock y envío."
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <Reveal className="mt-10 border-t border-bone/10 pt-6">
          <p className="text-xs text-bone/50">
            Los valores son estimaciones de lista sin IVA. La cotización formal se emite por
            WhatsApp o email con factura A / B y condiciones de pago.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
