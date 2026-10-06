"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, MessageCircle, Star, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatARS, cn } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";

type ProductCardProps = {
  product: Product;
  /** Renderiza el modal de vista rápida dentro de la card. */
  withQuickView?: boolean;
  className?: string;
  priority?: boolean;
};

/** Card de producto reutilizada en catálogo, relacionados y home. */
export function ProductCard({
  product,
  withQuickView = true,
  className,
  priority = false,
}: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const badgeVariant =
    product.badge === "Oferta"
      ? "burnt"
      : product.badge === "Nuevo"
        ? "accent"
        : product.badge
          ? "default"
          : undefined;

  return (
    <>
      <article
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-forest-600/35 hover:shadow-[0_18px_40px_-26px_rgba(0,0,0,0.5)] dark:hover:border-ochre-500/35",
          className,
        )}
        data-cursor="view"
        data-cursor-label="Ver"
      >
        <Link
          href={`/producto/${product.slug}`}
          className="relative block aspect-4/3 overflow-hidden bg-surface"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/35 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {product.badge && (
            <Badge variant={badgeVariant} className="absolute left-4 top-4 border-transparent">
              {product.badge}
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="outline" className="absolute right-4 top-4 bg-background/90 text-foreground">
              Bajo pedido
            </Badge>
          )}
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow text-muted-foreground">{product.brand}</span>
            <span className="font-mono text-[0.625rem] text-muted-foreground/70">{product.sku}</span>
          </div>

          <h3 className="mt-2 text-base font-semibold leading-snug tracking-tight">
            <Link
              href={`/producto/${product.slug}`}
              className="transition-colors hover:text-forest-700 dark:hover:text-ochre-400"
            >
              {product.name}
            </Link>
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <div>
              <p className="font-mono text-lg font-semibold tabular tracking-tight">
                {formatARS(product.price, true)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    product.inStock ? "bg-emerald-500" : "bg-ochre-500",
                  )}
                  aria-hidden="true"
                />
                {product.inStock ? "En stock" : "Bajo pedido"}
                <span className="mx-1 text-border">·</span>
                <Star className="h-3 w-3 fill-ochre-500 text-ochre-500" />
                {product.rating}
              </p>
            </div>

            {withQuickView && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label={`Vista rápida de ${product.name}`}
                onClick={() => setOpen(true)}
                className="h-9 w-9 shrink-0 opacity-0 transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </article>

      {withQuickView && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogHeader>
            <DialogTitle className="pr-10 text-xl font-extrabold tracking-tight">
              {product.name}
            </DialogTitle>
            <DialogDescription className="mt-1 font-mono text-xs">
              {product.brand} · SKU {product.sku} · {product.origin}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-5 sm:grid-cols-2">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-surface">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.shortDescription}
              </p>
              <dl className="mt-4 space-y-2 border-t border-border pt-3 font-mono text-xs">
                {product.specs.slice(0, 4).map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{spec.label}</dt>
                    <dd className="text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 font-mono text-2xl font-semibold tabular">
                {formatARS(product.price)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" />
                Envío 48 hs a todo el país
              </p>
            </div>
          </DialogBody>
          <div className="flex flex-wrap gap-3 border-t border-border p-6 pt-5">
            <Button asChild variant="accent" size="md" className="shine group flex-1">
              <Link href={`/producto/${product.slug}`}>Ver ficha completa</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <a
                href={`${COMPANY.whatsappHref}%20—%20Consulta%20por%20${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar
              </a>
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
}
