import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases condicionales resolviendo conflictos de Tailwind (patrón shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea pesos argentinos. `Intl` con locale es-AR para el separador de miles. */
export function formatARS(value: number, compact = false) {
  if (compact && value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1).replace(".", ",")}M`;
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Slug simple y estable para URLs de producto. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
