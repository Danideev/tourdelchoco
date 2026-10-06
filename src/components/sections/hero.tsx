"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MessageCircle, Play } from "lucide-react";
import { BRANDS } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import { Marquee } from "@/components/effects/marquee";
import { RevealLines } from "@/components/effects/reveal";
import { COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * HERO — pantalla completa, impacto editorial.
 * Composición asimétrica: titular a la izquierda, "ficha viva" a la derecha
 * y ticker de marcas anclado al borde inferior.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  /**
   * Parallax cinematográfico con GSAP ScrollTrigger (scrub): la foto se
   * desplaza más lento que el scroll y el contenido "flota" por encima.
   * Va en un wrapper propio para no pisar el `animate-kenburns` del <img>
   * (las CSS animations le ganan a los estilos inline que escribe GSAP).
   */
  useEffect(() => {
    if (reduced || !sectionRef.current || !parallaxRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        parallaxRef.current,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    }, sectionRef);
    // Las tipografías e imágenes cambian alturas post-hidratación.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-forest-950 pt-28 md:pt-32"
      aria-labelledby="hero-title"
    >
      {/* --- Fondo cinematográfico --------------------------------------- */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-x-0 -inset-y-[7%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/hero.jpg"
            alt="Esquilador profesional trabajando con máquina eléctrica en un galpón de esquilado"
            fetchPriority="high"
            className={cn(
              "h-full w-full object-cover object-center will-change-transform",
              !reduced && "animate-kenburns",
            )}
          />
        </div>
        {/* Capas de color: verde profundo + degradado para legibilidad */}
        <div className="absolute inset-0 bg-forest-950/72" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/45 to-transparent" />
        {/* Scrim inferior: siempre oscuro (el hero es cinematográfico en ambos
            temas). Un degradado a `--background` lavaba los CTA en modo claro. */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-forest-950 via-forest-950/80 to-transparent" />
      </div>

      {/* --- Contenido ---------------------------------------------------- */}
      <div className="container-site w-full pb-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.p
              className="eyebrow mb-6 flex items-center gap-3 text-ochre-400"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="h-px w-10 bg-ochre-500" />
              Importador directo · EE.UU. · China · Taiwán
            </motion.p>

            <h1
              id="hero-title"
              className="max-w-4xl text-[clamp(2.6rem,7.2vw,5.75rem)] font-extrabold leading-[0.94] tracking-[-0.045em] text-bone"
            >
              <RevealLines
                delay={0.1}
                lines={[
                  <Fragment key="l1">Herramientas que definen</Fragment>,
                  <Fragment key="l2">
                    el <span className="text-ochre-500">estándar</span> del
                  </Fragment>,
                  <Fragment key="l3">esquilado profesional</Fragment>,
                ]}
              />
            </h1>

            <motion.p
              className="mt-7 max-w-xl text-base leading-relaxed text-bone/75 md:text-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Compramos en fábrica y te lo entregamos con stock en Buenos Aires, garantía de
              fábrica y un técnico al otro lado del WhatsApp. <strong className="font-semibold text-bone">El filo
              que tu trabajo merece.</strong>
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <Magnetic strength={0.25}>
                <Button asChild variant="accent" size="lg" className="shine group" data-cursor="link">
                  <Link href="/catalogo">
                    Ver catálogo
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </Magnetic>

              <Button
                asChild
                size="lg"
                className="border border-bone/25 bg-transparent text-bone hover:bg-bone/10"
                variant="outline"
                data-cursor="link"
              >
                <a href={COMPANY.whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Hablar con un asesor
                </a>
              </Button>

              <span className="ml-1 hidden items-center gap-2 text-xs text-bone/55 sm:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ochre-500 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-ochre-500" />
                </span>
                Stock listo para despacho
              </span>
            </motion.div>
          </div>

          {/* Ficha viva: ancla de credibilidad técnica */}
          <motion.aside
            className="hidden lg:col-span-4 lg:block"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Ficha técnica destacada"
          >
            <div className="ml-auto max-w-xs rounded-xl border border-bone/15 bg-forest-950/55 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-bone/50">Unidad destacada</span>
                <span className="flex items-center gap-1.5 text-[0.625rem] uppercase tracking-widest text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  En stock
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold tracking-tight text-bone">
                Esquiladora LISTER XTR
              </p>
              <dl className="mt-4 space-y-2 font-mono text-[0.7rem] text-bone/70">
                {[
                  ["Potencia", "1.100 W"],
                  ["Velocidad", "2.600 rpm"],
                  ["Origen", "Reino Unido"],
                  ["Garantía", "24 meses"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 border-b border-bone/10 pb-2">
                    <dt>{k}</dt>
                    <dd className="text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/producto/esquiladora-lister-xtr"
                data-cursor="link"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-ochre-400 transition-colors hover:text-ochre-300"
              >
                Ver ficha completa
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* --- Ticker de marcas anclado abajo ------------------------------- */}
      <div className="relative border-t border-bone/15 bg-forest-950/40 backdrop-blur-sm">
        <div className="container-site flex items-center gap-6 py-3.5">
          <span className="hidden shrink-0 items-center gap-2 text-bone/50 sm:flex">
            <Play className="h-3 w-3 fill-current" />
            <span className="eyebrow">Marcas que importamos</span>
          </span>
          <Marquee duration={32} className="mask-edge-x flex-1" label="Marcas importadas">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="mx-5 whitespace-nowrap font-mono text-xs uppercase tracking-[0.28em] text-bone/70 transition-colors hover:text-ochre-400"
              >
                {brand}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
