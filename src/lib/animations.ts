import type { Variants } from "framer-motion";

/**
 * Variantes reutilizables de Framer Motion.
 * Easing "outExpo" da el carácter editorial del sitio: arranca rápido,
 * termina con precisión mecánica (como un filo que corta).
 */
const EASE = [0.16, 1, 0.3, 1] as const;

/** Fade + slide up, disparado por IntersectionObserver (whileInView). */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

/** Variante para listas/hijos: stagger escalonado. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Revelado por clip: la tipografía "sube" desde una máscara. */
export const maskRise: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 1, ease: EASE } },
};

/** Escala + fade para imágenes y cards cinematográficas. */
export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.08 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.1, ease: EASE } },
};

/** Transición estándar de entradas de página. */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: EASE } },
};

export const MOTION_EASE = EASE;

/** Valores respetados por `useReducedMotion` de Framer Motion. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
