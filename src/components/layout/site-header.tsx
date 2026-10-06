"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { NAV_LINKS, COMPANY, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/providers";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea el scroll del body con el menú mobile abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Barra institucional: colapsa al hacer scroll para ganar viewport */}
        <div
          className={cn(
            "hidden overflow-hidden border-b border-white/10 bg-forest-900 text-bone/80 transition-[height,opacity] duration-500 md:block",
            scrolled ? "h-0 opacity-0" : "h-9 opacity-100",
          )}
        >
          <div className="container-site flex h-9 items-center justify-between text-[0.6875rem] tracking-wide">
            <div className="flex items-center gap-6">
              <span className="eyebrow text-ochre-400">Importador oficial</span>
              <span className="hidden lg:inline">Envíos a todo el país en 48 hs</span>
              <span className="hidden lg:inline">Servicio técnico propio</span>
            </div>
            <div className="flex items-center gap-5">
              <a href={COMPANY.phoneHref} className="transition-colors hover:text-ochre-400">
                {COMPANY.phone}
              </a>
              <a
                href={COMPANY.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-ochre-400"
              >
                WhatsApp {COMPANY.whatsapp}
              </a>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "border-b transition-all duration-500",
            // En light, la barra translúcida dejaba texto #1a1a1a sobre la foto
            // oscura del hero (~3:1). Subimos la opacidad en light y, en dark,
            // usamos un scrim verde para que el texto claro mantenga AA.
            scrolled
              ? "border-border bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75"
              : "border-transparent bg-background/75 backdrop-blur-xl dark:border-bone/10 dark:bg-forest-950/60",
          )}
        >
          <div className="container-site flex h-16 items-center justify-between gap-6 md:h-[68px]">
            <Link
              href="/"
              aria-label="AGROPYME — ir al inicio"
              className="shrink-0"
              data-cursor="link"
            >
              <Logo />
            </Link>

            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-cursor="link"
                      className="group relative inline-block py-1 text-sm font-medium tracking-tight text-foreground/75 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ochre-500 transition-transform duration-300 group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <ThemeToggle />
              <Magnetic className="hidden sm:block" strength={0.22}>
                <Button
                  asChild
                  variant="accent"
                  size="md"
                  className="shine group"
                  data-cursor="link"
                >
                  <Link href="/#cotizador">
                    Cotizar ahora
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Abrir menú de navegación"
                aria-expanded={open}
                className="grid h-10 w-10 place-items-center rounded-lg border border-border/70 text-foreground transition-colors hover:bg-muted lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú mobile full-screen */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col bg-forest-950 text-bone lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex h-16 items-center justify-between px-5 md:h-[76px]">
              <Logo className="text-bone" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="grid h-10 w-10 place-items-center rounded-lg border border-bone/20 transition-colors hover:bg-bone/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-8" aria-label="Menú móvil">
              <ul className="mt-4 divide-y divide-bone/10 border-y border-bone/10">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-5 text-2xl font-semibold tracking-tight"
                    >
                      {link.label}
                      <ArrowUpRight className="h-5 w-5 text-ochre-500" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3">
                <Button asChild variant="accent" size="lg" className="w-full">
                  <Link href="/#cotizador" onClick={() => setOpen(false)}>
                    Cotizar ahora
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full border-bone/25 text-bone">
                  <Link href="/catalogo" onClick={() => setOpen(false)}>
                    Ver catálogo
                  </Link>
                </Button>
              </div>

              <div className="mt-10 space-y-2 text-sm text-bone/70">
                <a href={COMPANY.phoneHref} className="flex items-center gap-2 hover:text-ochre-400">
                  <Phone className="h-4 w-4" /> {COMPANY.phone}
                </a>
                <p>{COMPANY.address}</p>
                <p className="text-bone/50">{COMPANY.hours}</p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-md border border-bone/20 px-3 py-1.5 text-xs uppercase tracking-wider transition-colors hover:border-ochre-500 hover:text-ochre-400"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
