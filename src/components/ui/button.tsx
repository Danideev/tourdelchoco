import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botón base del design system.
 * El variant `shine` agrega el barrido de luz tipo "filo de tijera" al hover
 * (se anima desde `.shine::before` en globals.css).
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-tight transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-forest-700 dark:hover:bg-ochre-400 shadow-[0_1px_0_rgba(255,255,255,0.12)_inset]",
        accent:
          "bg-highlight text-highlight-foreground hover:bg-burnt-600 shadow-[0_1px_0_rgba(255,255,255,0.18)_inset]",
        outline:
          "border border-current/25 bg-transparent text-foreground hover:border-foreground/60 hover:bg-foreground/5",
        ghost: "text-foreground hover:bg-foreground/6",
        dark: "bg-ink-900 text-bone hover:bg-ink-800 dark:bg-bone dark:text-ink-900 dark:hover:bg-white",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-[0.9375rem]",
        icon: "h-10 w-10 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
