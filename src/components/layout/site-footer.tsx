import Link from "next/link";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from "@/components/icons/social";
import { COMPANY, FOOTER_COLUMNS, SOCIAL_LINKS } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { imageCredits } from "@/data/image-credits";

const ICONS = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
} as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contacto" className="relative overflow-hidden bg-forest-950 text-bone">
      {/* Regla superior tipo editorial */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ochre-500/60 to-transparent" />

      <div className="container-site py-16 md:py-20">
        {/* Fila superior: identidad + newsletter */}
        <div className="grid gap-10 border-b border-bone/10 pb-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <Logo className="text-bone" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-bone/70">
              Importación directa y comercialización de maquinaria para esquilado, corte y
              rasurado animal, lubricantes y repuestos. Trabajamos con distribuidores rurales,
              productores ganaderos, esquiladores profesionales y veterinarios.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm text-bone/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ochre-500" />
                {COMPANY.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-ochre-500" />
                <a href={COMPANY.phoneHref} className="transition-colors hover:text-ochre-400">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-ochre-500" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="transition-colors hover:text-ochre-400"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-ochre-500" />
                {COMPANY.hours}
              </li>
            </ul>
          </div>

          <div className="lg:pt-2">
            <p className="eyebrow text-ochre-500">Novedades técnicas</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Guías de uso, novedades de stock y recomendaciones de mantenimiento.
            </h3>
            <p className="mt-3 text-sm text-bone/60">
              Un email cada tanto. Sin relleno, sin spam, con datos que sirven en el taller.
            </p>
            <div className="mt-5 max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Columnas de enlaces */}
        <nav
          aria-label="Mapa del sitio"
          className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4"
        >
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4 className="eyebrow text-bone/50">{column.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-bone/75 transition-colors hover:text-ochre-400"
                    >
                      <span className="h-px w-0 bg-ochre-500 transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Redes + legal */}
        <div className="flex flex-col gap-6 border-t border-bone/10 pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-2.5">
            {SOCIAL_LINKS.map((social) => {
              const Icon = ICONS[social.icon];
              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`AGROPYME en ${social.label}`}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-bone/15 text-bone/70 transition-all hover:border-ochre-500 hover:text-ochre-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="text-xs leading-relaxed text-bone/50 md:text-right">
            <p>{COMPANY.legal}</p>
            <p>{COMPANY.addressShort} · Argentina</p>
          </div>
        </div>
      </div>

      {/* Wordmark gigante: cierre editorial */}
      <div className="relative select-none overflow-hidden border-t border-bone/10">
        <div
          aria-hidden="true"
          className="pointer-events-none flex w-full items-end justify-center px-4 pb-2 pt-6 text-[16vw] font-extrabold uppercase leading-[0.8] tracking-[-0.055em] text-bone/[0.055]"
        >
          Agropyme
        </div>
      </div>

      <div className="border-t border-bone/10">
        <div className="container-site flex flex-col gap-2 py-5 text-[0.6875rem] text-bone/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {COMPANY.name} · Todos los derechos reservados.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Diseño y desarrollo: Lucía Márquez — propuesta freelance</span>
            <span className="hidden md:inline">·</span>
            <span>
              Fotos mock:{" "}
              {imageCredits.length} imágenes de Wikimedia Commons / pravatar (reemplazar antes de
              producción)
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
