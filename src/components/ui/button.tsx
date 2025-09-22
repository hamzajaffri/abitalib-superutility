import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-orbitron touch-target active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow-sm border border-primary/20 active:shadow-glow-sm",
        neon: "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow animate-glow-pulse border border-primary/40 active:animate-none",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:shadow-[0_0_10px_hsl(var(--secondary)/0.3)] border border-secondary/20 active:shadow-[0_0_10px_hsl(var(--secondary)/0.3)]",
        accent: "bg-gradient-accent text-accent-foreground hover:shadow-[0_0_10px_hsl(var(--accent)/0.3)] border border-accent/20 active:shadow-[0_0_10px_hsl(var(--accent)/0.3)]",
        glass: "glass text-foreground hover:bg-card-glass/60 hover:border-primary/30 active:bg-card-glass/80",
        outline: "border border-primary/40 bg-transparent text-primary hover:bg-primary/10 hover:shadow-glow-sm active:bg-primary/20",
        ghost: "text-foreground-muted hover:bg-card-glass/40 hover:text-foreground active:bg-card-glass/60",
        destructive: "bg-gradient-to-r from-destructive to-destructive-glow text-destructive-foreground hover:shadow-[0_0_15px_hsl(var(--destructive)/0.4)] border border-destructive/30 active:shadow-[0_0_15px_hsl(var(--destructive)/0.4)]",
        warning: "bg-gradient-to-r from-warning to-warning-glow text-foreground hover:shadow-[0_0_15px_hsl(var(--warning)/0.4)] border border-warning/30 active:shadow-[0_0_15px_hsl(var(--warning)/0.4)]",
      },
      size: {
        default: "h-10 px-4 py-2 text-responsive-sm",
        sm: "h-8 rounded-md px-3 text-xs min-h-[32px]",
        lg: "h-12 rounded-lg px-6 sm:px-8 text-responsive-base min-h-[44px]",
        xl: "h-14 rounded-xl px-8 sm:px-10 text-responsive-lg min-h-[48px]",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
        "icon-sm": "h-8 w-8 min-h-[32px] min-w-[32px]",
        "icon-lg": "h-12 w-12 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
