import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Quote } from "lucide-react";
import { POSTS } from "@/data/site";
import { POST_BODIES, type PostBlock } from "@/data/post-body";
import { PostCard } from "@/components/blog/post-card";
import { Reveal } from "@/components/effects/reveal";
import { Badge } from "@/components/ui/badge";
import { COMPANY } from "@/lib/constants";

type Params = { slug: string };

const POST = Object.fromEntries(POSTS.map((p) => [p.slug, p]));

/** Rutas estáticas para las 3 notas del blog. */
export function generateStaticParams(): Params[] {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POST[slug];
  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: `${post.title} — Recursos AGROPYME`,
    description: post.excerpt,
    alternates: { canonical: `/recursos/${post.slug}` },
    openGraph: {
      type: "article",
      title: `${post.title} · AGROPYME`,
      description: post.excerpt,
      publishedTime: post.date,
      images: [{ url: post.image }],
    },
  };
}

/** Renderiza un bloque del cuerpo del artículo con el estilo editorial. */
function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "p":
      return <p className="mt-5 text-[1.0625rem] leading-[1.8] text-foreground/85">{block.text}</p>;

    case "h2":
      return (
        <h2 className="mt-12 flex items-start gap-3 text-2xl font-bold leading-tight tracking-tight md:text-[1.75rem]">
          <span className="mt-2 h-5 w-1 shrink-0 rounded-full bg-ochre-500" aria-hidden="true" />
          {block.text}
        </h2>
      );

    case "list":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-6 text-[1.0625rem] leading-[1.75] text-foreground/85 before:absolute before:left-0 before:top-[0.7em] before:h-1.5 before:w-1.5 before:rounded-[2px] before:bg-forest-600 dark:before:bg-ochre-500"
            >
              {item}
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <figure className="my-10 border-l-2 border-ochre-500 pl-6">
          <Quote className="mb-3 h-5 w-5 text-ochre-500" aria-hidden="true" />
          <blockquote className="text-xl font-medium leading-snug tracking-tight md:text-2xl">
            “{block.text}”
          </blockquote>
          {block.cite && (
            <figcaption className="mt-3 font-mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
              — {block.cite}
            </figcaption>
          )}
        </figure>
      );

    case "note":
      return (
        <aside className="my-8 rounded-xl border border-border bg-surface p-5">
          <p className="eyebrow mb-2 text-forest-700 dark:text-ochre-400">
            {block.title ?? "En el taller"}
          </p>
          <p className="text-[0.9375rem] leading-relaxed text-foreground/85">{block.text}</p>
        </aside>
      );
  }
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = POST[slug];
  if (!post) notFound();

  const blocks = POST_BODIES[slug] ?? [];
  const related = POSTS.filter((p) => p.slug !== slug);
  const author = "Taller AGROPYME";
  const initials = author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "AGROPYME S.R.L." },
    publisher: { "@type": "Organization", name: "AGROPYME S.R.L." },
    image: post.image,
  };

  return (
    <div className="pt-16 md:pt-[104px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="container-site py-12 md:py-16">
        {/* Columna de lectura única: título, foto y cuerpo comparten el mismo
            eje para no desalinear el bloque editorial. */}
        <div className="mx-auto max-w-3xl">
        <Reveal>
          <Link
            href="/recursos"
            data-cursor="link"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Todos los recursos
          </Link>

          <Badge variant="accent" className="mb-5">
            {post.category}
          </Badge>

          <h1 className="text-[clamp(2.1rem,4.6vw,3.75rem)] font-extrabold leading-[1.03] tracking-[-0.042em]">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-border py-4 text-[0.8125rem] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTime} de lectura
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="grid h-7 w-7 place-items-center rounded-lg bg-forest-700 font-mono text-[0.625rem] font-semibold text-bone dark:bg-ochre-500 dark:text-ink-900"
              >
                {initials}
              </span>
              {author}
            </span>
          </div>
        </Reveal>

        <Reveal className="mt-8">
          <figure>
            <div className="relative aspect-16/9 overflow-hidden rounded-2xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/35 to-transparent" />
            </div>
          </figure>
        </Reveal>

        <Reveal className="mt-10">
          <p className="border-l-2 border-forest-700 pl-5 text-lg font-medium leading-relaxed tracking-tight dark:border-ochre-500 md:text-xl">
            {post.excerpt}
          </p>

          {blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          {/* Cierre: puerta al cotizador + contacto directo */}
          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold tracking-tight">¿Aplicás esto en tu operación?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Te respondemos por WhatsApp con stock, precio y plazo para tu provincia.
              </p>
            </div>
            <a
              href={COMPANY.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-forest-700 px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-forest-800 dark:bg-ochre-500 dark:text-ink-900 dark:hover:bg-ochre-400"
            >
              Escribinos
            </a>
          </div>
        </Reveal>

        {/* Notas relacionadas */}
        <Reveal className="mt-16 border-t border-border pt-10">
          <p className="eyebrow mb-6 flex items-center gap-3 text-highlight">
            <span className="h-px w-8 bg-highlight" />
            Seguir leyendo
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </Reveal>
        </div>
      </article>
    </div>
  );
}
