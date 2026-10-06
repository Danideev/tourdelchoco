"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  Container,
  MessagesSquare,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";
import { BENEFITS, STATS } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/effects/reveal";
import { CountUp } from "@/components/effects/count-up";
import { cn } from "@/lib/utils";

const ICONS = {
  container: Container,
  wrench: Wrench,
  warehouse: Warehouse,
  messages: MessagesSquare,
  truck: Truck,
  badge: BadgeCheck,
} as const;

/** BENTO "Por qué AGROPYME": 6 celdas de pesos visuales distintos + stats. */
export function WhyBento() {
  return (
    <section id="por-que" className="container-site py-20 md:py-28" aria-labelledby="why-title">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
        <Reveal className="max-w-2xl">
          <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
            <span className="h-px w-8 bg-highlight" />
            Por qué AGROPYME
          </p>
          <h2
            id="why-title"
            className="text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
          >
            Seis razones que se
            <br />
            comprueban en el taller.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-right">
            No vendemos folleto: vendemos continuidad. Que la máquina arranque el lunes, que el
            repuesto esté y que alguien te conteste.
          </p>
        </Reveal>
      </div>

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, i) => {
          const Icon = ICONS[benefit.icon as keyof typeof ICONS];
          // Celda principal: tratada como pieza editorial con fondo verde profundo.
          const isHero = i === 0;
          const isWide = i === BENEFITS.length - 1;

          return (
            <RevealItem
              key={benefit.id}
              className={cn(benefit.span as string, isWide && "sm:col-span-2")}
            >
              <article
                className={cn(
                  "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border p-6 transition-all duration-500 hover:-translate-y-1",
                  isHero
                    ? "border-forest-600 bg-forest-600 text-bone hover:bg-forest-700"
                    : "border-border bg-card hover:border-forest-600/40 dark:hover:border-ochre-500/40",
                  isWide && "sm:col-span-2 lg:col-span-4",
                )}
              >
                {/* Destello de filo al hover */}
                <span className="shine pointer-events-none absolute inset-0" aria-hidden="true" />

                <div className="relative flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "grid h-11 w-11 shrink-0 place-items-center rounded-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6",
                      isHero
                        ? "bg-bone/12 text-ochre-400"
                        : "bg-muted text-forest-600 dark:text-ochre-500",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "eyebrow transition-opacity duration-300",
                      isHero ? "text-bone/50" : "text-muted-foreground/70",
                    )}
                  >
                    {benefit.metric}
                  </span>
                </div>

                <div className="relative mt-8">
                  <h3
                    className={cn(
                      "font-semibold tracking-tight",
                      isHero ? "text-2xl md:text-3xl" : "text-base",
                    )}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 leading-relaxed",
                      isHero ? "max-w-md text-sm text-bone/75 md:text-base" : "text-sm",
                      !isHero && "text-muted-foreground",
                    )}
                  >
                    {benefit.description}
                  </p>
                </div>

                <span
                  className={cn(
                    "relative mt-5 inline-flex items-center gap-1.5 text-xs font-medium opacity-0 transition-all duration-300 group-hover:opacity-100",
                    isHero ? "text-ochre-400" : "text-forest-600 dark:text-ochre-400",
                  )}
                >
                  Consultar condiciones
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* Números que cuentan hacia arriba al entrar en viewport */}
      <RevealGroup className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <RevealItem key={stat.label}>
            <div className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-forest-600/30 dark:hover:border-ochre-500/30">
              <p className="font-mono text-4xl font-semibold tabular tracking-tight text-forest-700 dark:text-ochre-400">
                <CountUp value={stat.value} />
                <span className="text-foreground/40">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-xs leading-snug text-muted-foreground">{stat.label}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
