import { BadgeCheck, PackageCheck, Truck } from "lucide-react";
import { TRUST_BADGES } from "@/data/site";
import { BRANDS } from "@/data/products";
import { Marquee } from "@/components/effects/marquee";
import { Reveal } from "@/components/effects/reveal";

const ICONS = [BadgeCheck, PackageCheck, Truck, BadgeCheck, Truck] as const;

/** TRUST BAR — logotipos monocromáticos en loop + insignias de respaldo. */
export function TrustBar() {
  return (
    <section aria-label="Marcas y certificaciones" className="border-b border-border bg-surface">
      <div className="container-site flex flex-wrap items-center justify-between gap-4 border-b border-border py-5">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {TRUST_BADGES.map((badge, i) => {
            const Icon = ICONS[i] ?? BadgeCheck;
            return (
              <li key={badge} className="flex items-center gap-2 text-xs font-medium text-foreground/75">
                <Icon className="h-3.5 w-3.5 text-forest-600 dark:text-ochre-500" />
                {badge}
              </li>
            );
          })}
        </ul>
        <p className="eyebrow text-muted-foreground">Distribuidor autorizado desde 2014</p>
      </div>

      <div className="py-7">
        <Marquee duration={44} label="Marcas representadas" className="mask-edge-x">
          {BRANDS.map((brand, i) => (
            <span
              key={brand}
              className="mx-8 inline-flex items-center gap-8 whitespace-nowrap text-2xl font-bold uppercase tracking-[-0.03em] text-foreground/35 transition-colors duration-300 hover:text-foreground/80 md:text-3xl"
            >
              {brand}
              <span
                className={
                  i % 2 === 0
                    ? "h-1.5 w-1.5 rotate-45 bg-ochre-500/70"
                    : "h-1.5 w-1.5 rounded-full bg-forest-600/50 dark:bg-forest-300/50"
                }
                aria-hidden="true"
              />
            </span>
          ))}
        </Marquee>
      </div>

      <div className="container-site hidden border-t border-border py-4 md:block">
        <Reveal>
          <p className="text-center text-xs text-muted-foreground">
            Importación oficial de <strong className="font-semibold text-foreground/80">LISTER</strong> ·{" "}
            <strong className="font-semibold text-foreground/80">HEINIGER</strong> ·{" "}
            <strong className="font-semibold text-foreground/80">OSTER</strong> ·{" "}
            <strong className="font-semibold text-foreground/80">ANDIS</strong> ·{" "}
            <strong className="font-semibold text-foreground/80">BEIYUAN</strong> con garantía de
            fábrica y servicio técnico en Argentina.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
