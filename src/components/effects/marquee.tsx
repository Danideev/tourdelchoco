"use client";

import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: React.ReactNode;
  /** Segundos por vuelta completa. */
  duration?: number;
  reverse?: boolean;
  className?: string;
  /** Pausa al hacer hover (útil cuando hay links dentro). */
  pauseOnHover?: boolean;
  label?: string;
};

/**
 * Marquee infinito en CSS: el track contiene dos copias idénticas del
 * contenido y translada -50%, de modo que el bucle es perfecto y no pestaña.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  className,
  pauseOnHover = true,
  label,
}: MarqueeProps) {
  return (
    <div
      className={cn("relative overflow-hidden", pauseOnHover && "marquee-group", className)}
      role={label ? "region" : undefined}
      aria-label={label}
    >
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center" aria-hidden={label ? undefined : true}>
          {children}
        </div>
        {/* Copia duplicada: invisible para lectores de pantalla, necesaria para el loop. */}
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
