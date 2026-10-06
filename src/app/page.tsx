import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { Categories } from "@/components/sections/categories";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { WhyBento } from "@/components/sections/why-bento";
import { About } from "@/components/sections/about";
import { QuoteCalculator } from "@/components/sections/quote-calculator";
import { Testimonials } from "@/components/sections/testimonials";
import { Distributors } from "@/components/sections/distributors";
import { Blog } from "@/components/sections/blog";

/**
 * Landing one-page de AGROPYME.
 * Orden narrativo: impacto → credibilidad → catálogo → diferencial →
 * prueba social → conversión (cotizador / distribuidores) → contenido.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <FeaturedProduct />
      <WhyBento />
      <About />
      <QuoteCalculator />
      <Testimonials />
      <Distributors />
      <Blog />
    </>
  );
}
