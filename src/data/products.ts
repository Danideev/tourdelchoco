/**
 * Catálogo de productos. Fuente editable: `content/productos.json`
 * (validado con zod: un campo mal tipeado corta en build, no en runtime).
 */
import { z } from "zod";
import productosJson from "../../content/productos.json";

export type CategoryId =
  | "esquiladoras"
  | "tijeras-cuchillas"
  | "lubricantes"
  | "repuestos"
  | "kits";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: CategoryId;
  /** Precio de lista en ARS (mock, actualizado a oct 2026). */
  price: number;
  compareAt?: number;
  origin: "EE.UU." | "China" | "Taiwán" | "Suiza" | "Reino Unido" | "Argentina";
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  badge?: "Nuevo" | "Más vendido" | "Oferta" | "Últimas unidades";
  inStock: boolean;
  rating: number;
  reviewCount: number;
  highlights: string[];
  specs: { label: string; value: string }[];
  includes: string[];
  downloads: { label: string; type: "PDF"; size: string }[];
  related: string[];
};

const categorySchema = z.object({
  id: z.enum([
    "esquiladoras",
    "tijeras-cuchillas",
    "lubricantes",
    "repuestos",
    "kits",
  ]),
  name: z.string(),
  short: z.string(),
  description: z.string(),
  image: z.string(),
  href: z.string(),
});

const productSchema = z.object({
  slug: z.string(),
  sku: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.enum([
    "esquiladoras",
    "tijeras-cuchillas",
    "lubricantes",
    "repuestos",
    "kits",
  ]),
  price: z.number(),
  compareAt: z.number().optional(),
  origin: z.enum([
    "EE.UU.",
    "China",
    "Taiwán",
    "Suiza",
    "Reino Unido",
    "Argentina",
  ]),
  shortDescription: z.string(),
  description: z.string(),
  image: z.string(),
  gallery: z.array(z.string()),
  badge: z.enum(["Nuevo", "Más vendido", "Oferta", "Últimas unidades"]).optional(),
  inStock: z.boolean(),
  rating: z.number(),
  reviewCount: z.number(),
  highlights: z.array(z.string()),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
  includes: z.array(z.string()),
  downloads: z.array(
    z.object({ label: z.string(), type: z.literal("PDF"), size: z.string() }),
  ),
  related: z.array(z.string()),
});

export const categories: {
  id: CategoryId;
  name: string;
  short: string;
  description: string;
  image: string;
  href: string;
}[] = z.array(categorySchema).parse(productosJson.categories);

export const products: Product[] = z
  .array(productSchema)
  .parse(productosJson.products);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const getProductsByCategory = (category: CategoryId) =>
  products.filter((p) => p.category === category);

export const categoryCount = (category: CategoryId) =>
  products.filter((p) => p.category === category).length;

export const featuredProduct = products[0];

export const BRANDS = z.array(z.string()).parse(productosJson.brands);
