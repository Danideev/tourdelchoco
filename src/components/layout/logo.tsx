import { cn } from "@/lib/utils";

/**
 * Isotipo AGROPYME: la "A" construida con dos hojas de tijera y una
 * barra dentada (el filo). Se dibuja en SVG para que escale y pueda
 * heredar `currentColor`.
 */
export function IsoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8", className)}
      fill="none"
      role="img"
      aria-label="Isotipo AGROPYME"
    >
      {/* Hojas / piernas de la A */}
      <path
        d="M5.6 27.2 16 4.6 26.4 27.2"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Travesaño dentado: el filo */}
      <path
        d="M10 20.2l1.45-2.6L12.9 20.2l1.45-2.6L15.8 20.2l1.45-2.6L18.7 20.2l1.45-2.6L21.6 20.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Punto de pivote de la tijera */}
      <circle cx="16" cy="4.6" r="1.9" fill="currentColor" />
    </svg>
  );
}

/** Wordmark completo: isotipo + logotipo tipográfico. */
export function Logo({
  className,
  isoClassName,
  compact = false,
}: {
  className?: string;
  isoClassName?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <IsoMark className={cn("text-highlight dark:text-ochre-500", isoClassName)} />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-extrabold uppercase tracking-[-0.04em]">
          Agropyme
        </span>
        {!compact && (
          <span className="eyebrow mt-0.5 text-[0.5rem] opacity-60">
            Soluciones en esquilado
          </span>
        )}
      </span>
    </span>
  );
}
