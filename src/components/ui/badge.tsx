import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-forest-600/20 bg-forest-600/8 text-forest-700 dark:bg-forest-400/12 dark:text-forest-200",
        accent: "border-ochre-500/30 bg-ochre-500/15 text-ochre-800 dark:text-ochre-300",
        burnt: "border-burnt-500/30 bg-burnt-500/12 text-burnt-600 dark:text-burnt-300",
        outline: "border-foreground/20 bg-transparent text-foreground/70",
        muted: "border-transparent bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
