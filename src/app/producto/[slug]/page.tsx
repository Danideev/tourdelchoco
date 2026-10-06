import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, type Product } from "@/data/products";
import { ProductDetail } from "@/components/product/product-detail";

type Params = { slug: string };

/** Genera las rutas estáticas de todas las fichas de producto. */
export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: `${product.shortDescription} Ficha técnica, especificaciones, manuales y precio. SKU ${product.sku}.`,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      title: `${product.name} · AGROPYME`,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = product.related
    .map((s) => getProduct(s))
    .filter((p): p is Product => Boolean(p));

  return (
    <div className="pt-16 md:pt-[104px]">
      <ProductDetail product={product} related={related} />
    </div>
  );
}
