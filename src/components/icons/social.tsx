import type { SVGProps } from "react";

/**
 * Iconos de redes sociales dibujados a mano.
 * Lucide removió las marcas de terceros, así que resolvemos con SVG propio
 * (24×24, stroke 1.6, mismo peso visual que el resto de los íconos).
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path
        d="M15.2 8.2h-1.4c-.9 0-1.4.5-1.4 1.4v1.6h2.6l-.4 2.6h-2.2v6.4"
        fill="none"
      />
      <path d="M9.6 13.8h2.8" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.4 9.4 15.2 12l-4.8 2.6Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="7.6" cy="7.9" r="1.15" fill="currentColor" stroke="none" />
      <path d="M6.6 10.7h2v6.4h-2z" fill="currentColor" stroke="none" />
      <path
        d="M10.9 17.1v-6.4h1.9v.9c.4-.6 1.2-1.1 2.2-1.1 1.8 0 2.6 1.1 2.6 3v3.6h-2v-3.3c0-1-.4-1.5-1.2-1.5-.8 0-1.3.5-1.3 1.5v3.3z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
