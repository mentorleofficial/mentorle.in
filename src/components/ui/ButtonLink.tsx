import Link from "next/link";
import { prefetchFor } from "@/lib/routes";
import type { ReactNode } from "react";

export type ButtonVariant = "light" | "ghost" | "brand" | "dark";

const variantClasses: Record<ButtonVariant, string> = {
  light: "bg-white text-ink border-white hover:bg-white/85",
  ghost: "bg-black/20 text-white border-white/30 hover:bg-white/10 hover:border-white/60",
  brand: "bg-brand text-white border-brand hover:bg-brand-dark hover:border-brand-dark",
  dark: "bg-ink text-white border-ink hover:bg-black",
};

export const buttonClasses = (variant: ButtonVariant = "light", className = "") =>
  `inline-flex h-[2.3125rem] items-center justify-center whitespace-nowrap border px-[1.125rem] text-sm font-normal transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${variantClasses[variant]} ${className}`;

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ href, variant = "light", external, className, children }: ButtonLinkProps) {
  const classes = buttonClasses(variant, className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={prefetchFor(href)} className={classes}>
      {children}
    </Link>
  );
}
