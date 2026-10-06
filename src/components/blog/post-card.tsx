import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/** Card de artículo: se usa en la home y en el índice /recursos. */
export type PostCardData = {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  image: string;
};

export function PostCard({ post, index }: { post: PostCardData; index?: number }) {
  return (
    <Link
      href={`/recursos/${post.slug}`}
      data-cursor="view"
      data-cursor-label="Leer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/55 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
        <Badge
          variant="accent"
          className="absolute left-4 top-4 border-transparent bg-background/90 text-foreground"
        >
          {post.category}
        </Badge>
        {typeof index === "number" && (
          <span className="absolute bottom-4 right-4 font-mono text-[0.625rem] uppercase tracking-widest text-bone/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-forest-700 dark:group-hover:text-ochre-400">
          {post.title}
        </h3>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[0.6875rem] text-muted-foreground">
          <span className="font-mono uppercase tracking-wider">{post.date}</span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime} de lectura
          </span>
        </div>
      </div>
    </Link>
  );
}
