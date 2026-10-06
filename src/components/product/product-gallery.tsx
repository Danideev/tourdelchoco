"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type ProductGalleryProps = {
  images: string[];
  name: string;
  badge?: string;
  /** Activa el zoom que sigue al puntero. */
  zoom?: boolean;
};

/**
 * Galería interactiva: miniaturas + zoom que sigue al cursor
 * (transform-origin calculado desde la posición del puntero).
 */
export function ProductGallery({ images, name, badge, zoom = true }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState("50% 50%");

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin(
      `${((e.clientX - rect.left) / rect.width) * 100}% ${
        ((e.clientY - rect.top) / rect.height) * 100
      }%`,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="group relative aspect-4/3 overflow-hidden rounded-xl border border-border bg-surface"
        data-cursor={zoom ? "view" : undefined}
        data-cursor-label={zoom ? "Zoom" : undefined}
        onMouseMove={onMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            alt={`${name} — vista ${active + 1}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.35]"
            style={{ transformOrigin: origin }}
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-950/30 via-transparent to-transparent" />
        {badge && (
          <span className="pointer-events-none absolute left-5 top-5">
            <Badge variant="accent">{badge}</Badge>
          </span>
        )}
        {zoom && (
          <span className="eyebrow pointer-events-none absolute bottom-5 right-5 rounded-md bg-ink-950/70 px-2.5 py-1.5 text-[0.625rem] text-bone/80 opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
            Pasá el cursor para ampliar
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1} de ${name}`}
              aria-pressed={active === i}
              className={`relative aspect-4/3 overflow-hidden rounded-lg border transition-all duration-300 ${
                active === i
                  ? "border-ochre-500 ring-2 ring-ochre-500/30"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
