import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow text-highlight">Error 404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.045em]">
        El filo se afiló
        <br />
        y la página no está.
      </h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        El enlace que seguiste no existe o el producto fue reemplazado. Volvé al catálogo: ahí
        está todo lo que importamos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="default" size="lg" className="shine group">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al inicio
          </Link>
        </Button>
        <Button asChild variant="accent" size="lg" className="shine">
          <Link href="/catalogo">
            <Search className="h-4 w-4" />
            Ver catálogo
          </Link>
        </Button>
      </div>
    </div>
  );
}
