"use client";

import { useSyncExternalStore } from "react";

/**
 * Detección de montaje en cliente sin hydration mismatch.
 * `useSyncExternalStore` usa el snapshot del servidor durante la hidratación
 * y recién después pasa al real, así que el primer render coincide siempre
 * (patrón recomendado en lugar de `useEffect(() => setMounted(true))`).
 */
const subscribe = () => () => undefined;
const getMounted = () => true;
const getServerMounted = () => false;

export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getMounted, getServerMounted);
}

/**
 * Media query reactiva. Útil para apagar el cursor custom, el parallax y las
 * animaciones pesadas según el dispositivo del usuario.
 */
export function useMediaQuery(query: string): boolean {
  const subscribeQuery = (callback: () => void) => {
    if (typeof window === "undefined") return () => undefined;
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
  const getSnapshot = () =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribeQuery, getSnapshot, getServerSnapshot);
}
