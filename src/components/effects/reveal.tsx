"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { revealUp, staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Margen del viewport que dispara el revelado (más negativo = más tarde). */
  margin?: string;
  once?: boolean;
};

/**
 * Revela contenido al entrar en viewport (Intersection Observer nativo de
 * Framer Motion): fade + slide up. Respeta prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  margin = "-60px",
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: margin as never }}
      variants={revealUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Contenedor con stagger para listas y grids. */
export function RevealGroup({
  children,
  className,
  margin = "-80px",
}: {
  children: React.ReactNode;
  className?: string;
  margin?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin as never }}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  variants = staggerItem,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}

/**
 * Una línea de titular dentro de su máscara de recorte.
 *
 * El observeo va en el *contenedor* (siempre visible) y no en el texto:
 * el texto arranca trasladado fuera del `overflow-hidden`, por lo que
 * IntersectionObserver calcula un área de intersección 0 y `whileInView`
 * nunca dispararía — la línea quedaría invisible para siempre.
 */
function MaskedLine({
  children,
  index,
  total,
  delay,
  lineClassName,
  reduced,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  delay: number;
  lineClassName?: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className="block overflow-hidden pb-[0.08em]">
      {reduced ? (
        <span className={cn("block", lineClassName)}>{children}</span>
      ) : (
        <motion.span
          className={cn("block", lineClassName)}
          initial={{ y: "110%" }}
          animate={inView ? { y: "0%" } : { y: "110%" }}
          transition={{
            duration: 0.95,
            delay: delay + index * 0.09,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children}
        </motion.span>
      )}
      {/* Espacio textual entre líneas: evita que el lector de pantalla
          concatene palabras de bloques contiguos. */}
      {index < total - 1 ? " " : null}
    </span>
  );
}

/**
 * Titular con máscara: cada línea sube desde abajo. Requiere recibir las
 * líneas como array para poder animarlas por separado.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <MaskedLine
          key={i}
          index={i}
          total={lines.length}
          delay={delay}
          lineClassName={lineClassName}
          reduced={!!reduced}
        >
          {line}
        </MaskedLine>
      ))}
    </span>
  );
}
