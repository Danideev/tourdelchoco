"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra de progreso de lectura fija en el borde superior del viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-forest-600 via-ochre-500 to-burnt-500"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
