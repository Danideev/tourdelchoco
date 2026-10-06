"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Rango de desplazamiento vertical en píxeles (la imagen "viaja" dentro del marco). */
  offset?: number;
  sizes?: string;
  priority?: boolean;
  /** Contenido superpuesto (overlays, texto). */
  children?: React.ReactNode;
};

/**
 * Imagen con parallax suave: el marco recorta y la imagen se desplaza dentro
 * mientras el scroll la atraviesa. Se anula con `prefers-reduced-motion`.
 * Nota: se usa <img> nativo porque las fotos son locales y ya vienen
 * precortadas; next/image se reserva para el catálogo (ver product-card).
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  offset = 50,
  sizes = "100vw",
  priority = false,
  children,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute -inset-y-[12%] inset-x-0"
        style={reduced ? undefined : { y }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      </motion.div>
      {children}
    </div>
  );
}
