import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollProgress } from "@/components/effects/scroll-progress";
import { CustomCursor } from "@/components/effects/custom-cursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://agropyme.vercel.app"),
  title: {
    default: "AGROPYME — Maquinaria para esquilado, corte y rasurado animal",
    template: "%s · AGROPYME",
  },
  description:
    "Importación directa de máquinas de esquilar, tijeras, cuchillas, lubricantes y repuestos. Stock en Buenos Aires, garantía de fábrica y servicio técnico propio. Envíos a todo el país en 48 hs.",
  keywords: [
    "maquinaria para esquilar",
    "esquiladora ovejas",
    "cuchillas de esquilar",
    "tijeras de esquilar",
    "importador maquinaria rural",
    "esquilado profesional",
    "repuestos esquiladora",
    "lubricantes cuchilla",
  ],
  authors: [{ name: "AGROPYME S.R.L." }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "AGROPYME S.R.L.",
    title: "AGROPYME — Herramientas que definen el estándar del esquilado profesional",
    description:
      "Importación directa de maquinaria para esquilado, corte y rasurado animal. Stock, garantía oficial y soporte técnico en Argentina.",
    images: [{ url: "/media/hero.jpg", width: 1920, height: 1280, alt: "Esquilado profesional" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AGROPYME — Maquinaria para esquilado animal",
    description: "Importación directa, stock en Buenos Aires y servicio técnico propio.",
    images: ["/media/hero.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F3EF" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-AR"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Saltar al contenido principal
        </a>

        <Providers>
          <ScrollProgress />
          <CustomCursor />
          <SiteHeader />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
