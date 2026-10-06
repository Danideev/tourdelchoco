"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/site";
import { Reveal } from "@/components/effects/reveal";
import { Button } from "@/components/ui/button";

/** CARRUSEL EDITORIAL: cita tipográfica grande + retrato y ficha del autor. */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = TESTIMONIALS[index];

  const go = (step: number) =>
    setIndex((i) => (i + step + TESTIMONIALS.length) % TESTIMONIALS.length);

  // Autoavance: se pausa con el hover o foco dentro del carrusel (accesibilidad).
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      7000,
    );
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      id="testimonios"
      className="border-y border-border bg-surface"
      aria-labelledby="testimonials-title"
    >
      <div
        className="container-site py-20 md:py-28"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="mb-10 flex items-end justify-between gap-6">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
              <span className="h-px w-8 bg-highlight" />
              Testimonios
            </p>
            <h2
              id="testimonials-title"
              className="max-w-xl text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              Quienes ya trabajan con nuestro equipo.
            </h2>
          </Reveal>

          <div className="flex shrink-0 items-center gap-2">
            <span className="mr-2 hidden font-mono text-xs tabular text-muted-foreground sm:block">
              {String(index + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(-1)}
              aria-label="Testimonio anterior"
              className="h-11 w-11 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(1)}
              aria-label="Siguiente testimonio"
              className="h-11 w-11 rounded-lg"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 md:p-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          {/* Cita */}
          <div className="relative min-h-[260px] sm:min-h-[220px]">
            <Quote
              className="absolute -left-1 -top-3 h-12 w-12 rotate-180 text-ochre-500/25"
              aria-hidden="true"
            />
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <p className="text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.03em] text-foreground">
                  “{active.quote}”
                </p>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-8 flex gap-1.5" role="tablist" aria-label="Elegir testimonio">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonio de ${t.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === index ? "w-10 bg-ochre-500" : "w-5 bg-border hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Autor */}
          <div className="flex flex-col justify-end border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.avatar}
                  alt={`Retrato de ${active.name}`}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight">{active.name}</p>
                  <p className="text-sm text-muted-foreground">{active.role}</p>
                  <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-wider text-forest-700 dark:text-ochre-400">
                    {active.company}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Clientes verificados de AGROPYME S.R.L. · Distribuidores, estancias y talleres
              abastecidos desde 2014.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
