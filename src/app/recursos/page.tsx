import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MessageCircle } from "lucide-react";
import { POSTS } from "@/data/site";
import { PostCard } from "@/components/blog/post-card";
import { Reveal, RevealGroup, RevealItem, RevealLines } from "@/components/effects/reveal";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Recursos — Guías de esquilado, mantenimiento y técnicas",
  description:
    "Guías prácticas del taller AGROPYME: cómo elegir máquina de esquilar, mantener las cuchillas y esquilar alpacas con calidad de fibra.",
  alternates: { canonical: "/recursos" },
  openGraph: {
    title: "Recursos · AGROPYME",
    description:
      "Guías prácticas de esquilado, mantenimiento y técnicas, escritas desde el taller.",
  },
};

/** Índice editorial del blog. */
export default function RecursosPage() {
  return (
    <div className="pt-16 md:pt-[104px]">
      <section className="container-site py-14 md:py-20">
        <Reveal>
          <Link
            href="/"
            data-cursor="link"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Link>

          <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
            <span className="h-px w-8 bg-highlight" />
            Recursos
          </p>
          <h1 className="max-w-3xl text-[clamp(2.4rem,5.4vw,4.5rem)] font-extrabold leading-[1.01] tracking-[-0.045em]">
            <RevealLines
              lines={[
                <Fragment key="l1">Lo que aprendemos</Fragment>,
                <Fragment key="l2">
                  en el taller, <span className="text-forest-700 dark:text-ochre-500">escrito</span>
                </Fragment>,
                <Fragment key="l3">para el campo.</Fragment>,
              ]}
            />
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Sin recetas mágicas: ajustes, ángulos, tiempos y errores que vemos pasar
            todas las temporadas en el taller. Todo con el mismo criterio con el que
            atendemos por WhatsApp.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* CTA editorial: el contenido es la puerta de entrada al cotizador */}
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-2xl bg-forest-950 px-6 py-10 text-bone md:px-12 md:py-14">
            <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="eyebrow mb-4 flex items-center gap-3 text-ochre-400">
                  <span className="h-px w-8 bg-ochre-500" />
                  ¿Venís de una lectura?
                </p>
                <h2 className="max-w-xl text-[clamp(1.6rem,3vw,2.5rem)] font-extrabold leading-[1.06] tracking-[-0.035em]">
                  Llevate la teoría al galpón: armamos tu pedido en dos minutos.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-bone/70">
                  Elegís producto, volumen y provincia; te damos estimación de precio,
                  envío y plazo. La cotización formal llega por WhatsApp con factura A/B
                  y condiciones de pago.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Button asChild variant="accent" size="lg" className="shine group">
                  <Link href="/#cotizador">
                    Ir al cotizador
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="border border-bone/25 bg-transparent text-bone hover:bg-bone/10"
                  variant="outline"
                >
                  <a href={COMPANY.whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    Consultar por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
