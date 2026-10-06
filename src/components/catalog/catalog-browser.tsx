"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X, PackageSearch, ArrowRight } from "lucide-react";
import { products, categories, type CategoryId } from "@/data/products";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/form-fields";
import { Skeleton } from "@/components/ui/skeleton";
import { formatARS, cn } from "@/lib/utils";

const MAX_PRICE = Math.max(...products.map((p) => p.price));
const BRAND_LIST = Array.from(new Set(products.map((p) => p.brand))).sort();

type SortKey = "destacados" | "precio-asc" | "precio-desc" | "rating";

/**
 * Buscador + filtros del catálogo.
 * Los filtros se sincronizan con la URL (deep-linking desde la home) y
 * muestran skeletons durante el "refetch" para comunicar el cambio de estado.
 */
export function CatalogBrowser() {
  const router = useRouter();
  const params = useSearchParams();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "todos">(
    (params.get("categoria") as CategoryId) ?? "todos",
  );
  const [brand, setBrand] = useState("todas");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [sort, setSort] = useState<SortKey>("destacados");
  const [loading, setLoading] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q);
      const matchesCategory = category === "todos" || p.category === category;
      const matchesBrand = brand === "todas" || p.brand === brand;
      const matchesPrice = p.price <= maxPrice;
      return matchesQuery && matchesCategory && matchesBrand && matchesPrice;
    });

    switch (sort) {
      case "precio-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "precio-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "rating":
        return [...list].sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [query, category, brand, maxPrice, sort]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  // Clave de los filtros: sirve para detectar cambios sin effects en cascada.
  const filterKey = `${query}|${category}|${brand}|${maxPrice}|${sort}`;

  // Simula la latencia del endpoint de búsqueda (demo de UX con skeletons).
  // Patrón "ajustar estado cuando cambia una clave": el setState ocurre durante
  // el render (permitido por React) y el timer vive en el effect.
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey);
    setLoading(true);
  }

  useEffect(() => {
    if (!loading) return;
    const id = setTimeout(() => setLoading(false), 320);
    return () => clearTimeout(id);
  }, [loading]);

  // Mantiene la URL al día con la categoría seleccionada.
  useEffect(() => {
    const next = new URLSearchParams();
    if (category !== "todos") next.set("categoria", category);
    router.replace(`/catalogo${next.toString() ? `?${next}` : ""}`, { scroll: false });
  }, [category, router]);

  // Cierra el autocompletado al hacer click afuera.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const clearFilters = () => {
    setQuery("");
    setCategory("todos");
    setBrand("todas");
    setMaxPrice(MAX_PRICE);
    setSort("destacados");
  };

  const activeFilters =
    (query ? 1 : 0) + (category !== "todos" ? 1 : 0) + (brand !== "todas" ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0);

  return (
    <div className="container-site py-14 md:py-20">
      {/* Encabezado de página */}
      <nav aria-label="Migas de pan" className="eyebrow mb-6 text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Catálogo</span>
      </nav>

      <div className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[clamp(2.25rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            Catálogo completo
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Maquinaria, cuchillas, lubricantes y repuestos con stock real en Buenos Aires. Todos
            los precios son de lista y están sujetos a confirmación de stock.
          </p>
        </div>
        <p className="font-mono text-sm tabular text-muted-foreground">
          {String(filtered.length).padStart(2, "0")} / {String(products.length).padStart(2, "0")}{" "}
          productos
        </p>
      </div>

      {/* Barra de herramientas */}
      <div className="sticky top-16 z-30 -mx-4 mb-8 border-b border-border bg-background/85 px-4 py-4 backdrop-blur-xl md:top-[68px] md:mx-0 md:px-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          {/* Búsqueda con autocompletado */}
          <div ref={boxRef} className="relative">
            <label htmlFor="catalog-search" className="sr-only">
              Buscar productos
            </label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="catalog-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSuggestOpen(true);
              }}
              onFocus={() => setSuggestOpen(true)}
              placeholder="Buscar por nombre, marca o SKU…"
              autoComplete="off"
              className="pl-10 pr-10"
              aria-describedby="search-hint"
            />
            {query && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <span id="search-hint" className="sr-only">
              Escribí al menos dos letras para ver sugerencias.
            </span>

            <AnimatePresence>
              {suggestOpen && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-lg border bg-popover shadow-xl"
                  role="listbox"
                  aria-label="Sugerencias de búsqueda"
                >
                  {suggestions.map((s) => (
                    <li key={s.slug} role="option" aria-selected="false">
                      <Link
                        href={`/producto/${s.slug}`}
                        className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted"
                        onClick={() => setSuggestOpen(false)}
                      >
                        <span className="truncate">
                          <span className="font-medium">{s.name}</span>
                          <span className="ml-2 font-mono text-[0.6875rem] text-muted-foreground">
                            {s.brand}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-xs tabular text-muted-foreground">
                          {formatARS(s.price, true)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="sr-only" htmlFor="filter-brand">
              Marca
            </label>
            <Select
              id="filter-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              aria-label="Filtrar por marca"
            >
              <option value="todas">Todas las marcas</option>
              {BRAND_LIST.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>

            <label className="sr-only" htmlFor="filter-sort">
              Ordenar
            </label>
            <Select
              id="filter-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Ordenar productos"
            >
              <option value="destacados">Orden destacado</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="rating">Mejor valorados</option>
            </Select>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-input bg-card px-4">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
            <label htmlFor="price-range" className="sr-only">
              Precio máximo
            </label>
            <input
              id="price-range"
              type="range"
              min={200_000}
              max={MAX_PRICE}
              step={50_000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
            <span className="shrink-0 font-mono text-xs tabular text-muted-foreground">
              ≤ {formatARS(maxPrice, true)}
            </span>
          </div>
        </div>

        {/* Chips de categoría */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory("todos")}
            aria-pressed={category === "todos"}
            className={cn(
              "rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all",
              category === "todos"
                ? "border-forest-600 bg-forest-600 text-bone dark:border-ochre-500 dark:bg-ochre-500 dark:text-ink-900"
                : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={cn(
                "rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-all",
                category === c.id
                  ? "border-forest-600 bg-forest-600 text-bone dark:border-ochre-500 dark:bg-ochre-500 dark:text-ink-900"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              {c.name}
            </button>
          ))}

          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-highlight transition-colors hover:bg-highlight/10"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar filtros ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
                <Skeleton className="aspect-4/3 rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
            <PackageSearch className="h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold tracking-tight">
              No encontramos productos con esos filtros
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Probá ampliar el precio, cambiar de marca o escribinos: importamos a pedido en 30
              días.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
              <Button asChild variant="accent" className="shine">
                <Link href="/#cotizador">
                  Importar a pedido
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.slug}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} priority={i < 4} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
