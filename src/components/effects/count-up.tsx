"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  value: number;
  duration?: number;
  className?: string;
  /** Formatea el valor final (miles, sufijos, etc.). */
  format?: (n: number) => string;
};

/** Números que suben al entrar en viewport, con easing outCubic. */
export function CountUp({
  value,
  duration = 1.6,
  className,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      // Con movimiento reducido mostramos el valor final al primer frame.
      if (reduced) {
        setDisplay(value);
        return;
      }
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  const text = format ? format(display) : new Intl.NumberFormat("es-AR").format(display);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
