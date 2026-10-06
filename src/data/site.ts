/**
 * Contenido editorial de la landing: stats, bento, testimonios, blog y cotizador.
 * Fuente editable: `content/*.json` — cada export se valida con zod al cargar,
 * así un error de tipeo en el JSON falla en build con un mensaje claro.
 */
import { z } from "zod";
import sitio from "../../content/sitio.json";
import testimoniosJson from "../../content/testimonios.json";
import articulosJson from "../../content/articulos.json";

const statSchema = z.object({
  value: z.number(),
  suffix: z.string(),
  label: z.string(),
});

const benefitSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  span: z.string(),
  metric: z.string(),
});

const testimonialSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string(),
  quote: z.string(),
  avatar: z.string(),
});

const postSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  readTime: z.string(),
  date: z.string(),
  excerpt: z.string(),
  image: z.string(),
});

const provinceSchema = z.object({
  id: z.string(),
  name: z.string(),
  cost: z.number(),
  days: z.number(),
  zone: z.string(),
});

export const STATS = z.array(statSchema).parse(sitio.stats);

export const TRUST_BADGES = z.array(z.string()).parse(sitio.trustBadges);

export const BENEFITS = z.array(benefitSchema).parse(sitio.benefits);

export const TESTIMONIALS = z
  .array(testimonialSchema)
  .parse(testimoniosJson.testimonials);

export const POSTS = z.array(postSchema).parse(articulosJson.posts);

/** Provincias para el cotizador: costo y días estimados de envío (mock). */
export const PROVINCES = z.array(provinceSchema).parse(sitio.provinces);
