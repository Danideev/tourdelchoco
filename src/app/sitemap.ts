import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { POSTS } from "@/data/site";

const BASE = "https://agropyme.vercel.app";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/recursos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...POSTS.map((p) => ({
      url: `${BASE}/recursos/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${BASE}/producto/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
