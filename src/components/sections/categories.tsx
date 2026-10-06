"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories, categoryCount } from "@/data/products";
import { Reveal, RevealGroup, RevealItem } from "@/components/effects/reveal";
import { Badge } from "@/components/ui/badge";

/**
 * CATEGORÍAS — grid editorial asimétrico.
 * La primera celda ocupa 2 columnas y 2 filas para romper la grilla regular.
 */
export function Categories() {
  return (
    <section id="productos" className="container-site py-20 md:py-28" aria-labelledby="cat-title">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
            <span className="h-px w-8 bg-highlight" />
            Catálogo
          </p>
          <h2
            id="cat-title"
            className="text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
          >
            Cinco familias de producto,
            <br />
            un solo estándar de filo.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            Todo lo que importamos está pensado para el uso intensivo: jornadas largas, polvo de
            lana y temporadas que no perdonan.
          </p>
        </Reveal>
      </div>

      {/* Grilla asimétrica: la celda 01 ocupa 2×2 y los "Kits" abren una fila completa. */}
      <RevealGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <RevealItem
            key={category.id}
            className={
              i === 0
                ? "lg:col-span-2 lg:row-span-2"
                : i === 3
                  ? "md:col-span-2 lg:col-span-2"
                  : undefined
            }
          >
            <Link
              href={category.href}
              data-cursor="view"
              data-cursor-label="Ver"
              className="group relative flex h-full min-h-[240px] flex-col justify-end overflow-hidden rounded-xl border border-border bg-ink-900 p-6 md:min-h-[280px]"
            >
              {/* Imagen con zoom cinematográfico al hover */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/55 to-forest-950/15 transition-opacity duration-500 group-hover:from-forest-950 group-hover:via-forest-950/70" />
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-tr from-highlight/25 via-transparent to-transparent" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow text-ochre-400/90">
                    {String(i + 1).padStart(2, "0")} —{" "}
                    {categoryCount(category.id) === 1
                      ? "1 producto"
                      : `${categoryCount(category.id)} productos`}
                  </span>
                  <h3
                    className={`mt-2 font-extrabold tracking-[-0.03em] text-bone ${
                      i === 0 ? "text-2xl md:text-3xl" : "text-xl"
                    }`}
                  >
                    {category.name}
                  </h3>
                  <p
                    className={`mt-2 leading-snug text-bone/70 ${
                      i === 0 ? "max-w-md text-sm md:text-base" : "text-xs md:text-sm"
                    }`}
                  >
                    {category.short}
                  </p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-bone/25 text-bone transition-all duration-300 group-hover:border-ochre-500 group-hover:bg-ochre-500 group-hover:text-ink-900">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-medium text-bone/0 transition-colors duration-300 group-hover:text-ochre-400">
                Ver más
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>

              {category.id === "kits" && (
                <Badge variant="accent" className="absolute right-6 top-6">
                  Combos
                </Badge>
              )}
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
