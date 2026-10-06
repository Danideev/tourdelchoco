import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Catálogo de maquinaria para esquilado",
  description:
    "Máquinas de esquilar, tijeras, cuchillas, lubricantes y repuestos. Filtros por categoría, marca y precio con stock real en Buenos Aires.",
  alternates: { canonical: "/catalogo" },
};

export default function CatalogoPage() {
  return (
    <div className="pt-16 md:pt-[104px]">
      {/* Suspense obligatorio: useSearchParams suspende durante el prerender */}
      <Suspense
        fallback={
          <div className="container-site py-14">
            <div className="skeleton h-14 w-2/3 rounded" />
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-4/3" />
              ))}
            </div>
          </div>
        }
      >
        <CatalogBrowser />
      </Suspense>
    </div>
  );
}
