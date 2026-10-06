import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { POSTS } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/effects/reveal";
import { PostCard } from "@/components/blog/post-card";

/** BLOG / RECURSOS — 3 notas editoriales con foco SEO de rubro. */
export function Blog() {
  return (
    <section
      id="recursos"
      className="border-t border-border bg-surface"
      aria-labelledby="blog-title"
    >
      <div className="container-site py-20 md:py-28">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="eyebrow mb-4 flex items-center gap-3 text-highlight">
              <span className="h-px w-8 bg-highlight" />
              Recursos
            </p>
            <h2
              id="blog-title"
              className="max-w-2xl text-[clamp(2rem,4.4vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
            >
              Lo que aprendemos en el taller,
              <br />
              escrito para el campo.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/recursos"
              data-cursor="link"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/75 transition-colors hover:text-foreground"
            >
              Ver todas las guías
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-border transition-all group-hover:border-forest-600 group-hover:bg-forest-600 group-hover:text-bone dark:group-hover:border-ochre-500 dark:group-hover:bg-ochre-500 dark:group-hover:text-ink-900">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {POSTS.map((post, i) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
