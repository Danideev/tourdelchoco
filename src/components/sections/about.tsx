import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { Reveal, RevealLines } from "@/components/effects/reveal";
import { ParallaxImage } from "@/components/effects/parallax-image";

/**
 * NOSOTROS — banda narrativa con parallax. Rompe el ritmo de grids
 * con una lectura editorial de columna angosta.
 */
export function About() {
  return (
    <section
      id="nosotros"
      className="container-site grid items-center gap-10 py-20 md:py-28 lg:grid-cols-[1.05fr_1fr] lg:gap-20"
      aria-labelledby="about-title"
    >
      <Reveal className="order-2 lg:order-1">
        <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
          <span className="h-px w-8 bg-highlight" />
          Nosotros
        </p>
        <h2
          id="about-title"
          className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.03] tracking-[-0.04em]"
        >
          <RevealLines
            lines={[
              // Fragment con key: el array viaja como prop a un cliente
              // component y React valida keys al serializarlo (RSC).
              <Fragment key="l1">Importamos lo que</Fragment>,
              <Fragment key="l2">
                usaríamos <span className="text-forest-600 dark:text-ochre-500">nosotros</span>.
              </Fragment>,
            ]}
          />
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          <p>
            AGROPYME nació en 2014 en Buenos Aires con una idea simple: el esquilador argentino
            merece el mismo equipo que se usa en Australia o Nueva Zelanda, sin pagar tres
            intermediarios de por medio.
          </p>
          <p>
            Hoy importamos directamente de <strong className="font-semibold text-foreground">EE.UU.,
            China y Taiwán</strong>, mantenemos stock permanente en Villa Devoto y operamos un
            taller propio donde reparamos, afilamos y calibramos. Lo que vendemos, lo usamos.
          </p>
        </div>

        <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6">
          {[
            ["2014", "Año de fundación"],
            ["24", "Provincias con envío"],
            ["3", "Orígenes de importación"],
          ].map(([value, label]) => (
            <div key={label}>
              <dt className="font-mono text-3xl font-semibold tabular tracking-tight text-forest-700 dark:text-ochre-400">
                {value}
              </dt>
              <dd className="mt-1 text-xs leading-snug text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <Button asChild variant="default" size="lg" className="shine group" data-cursor="link">
            <a href="#cotizador">
              Hablar con un asesor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="order-1 lg:order-2">
        <div className="relative">
          <ParallaxImage
            src="/media/hero-alt.jpg"
            alt="Rebaño recién esquilado en una estancia argentina"
            className="aspect-4/5 w-full rounded-2xl border border-border"
            offset={40}
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
          <div className="absolute -bottom-5 -left-4 max-w-[15rem] rounded-xl border border-border bg-card p-4 shadow-xl sm:-left-8">
            <p className="eyebrow text-muted-foreground">Depósito y taller</p>
            <p className="mt-1.5 text-sm font-semibold tracking-tight">
              O&apos;Higgins 4525, CABA
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
              Lun–Vie 9–13 / 14–17
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
