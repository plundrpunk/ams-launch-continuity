import type { ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

export const EASE = [0.16, 1, 0.3, 1] as const;

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>;
}

// Fade-up on entry. Collapses to a plain block under reduced motion so every
// section renders complete without scrolling.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

export function Button({ href, children, variant = "primary", size = "md", className = "" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98]";
  const sz = size === "lg" ? "h-12 px-6 text-[15px]" : "h-11 px-5 text-sm";
  const v =
    variant === "primary"
      ? "bg-accent text-bg hover:bg-[#7bb3eb]"
      : "border border-hairline text-text hover:border-[rgb(232_236_241/0.24)] hover:bg-surface";
  const external = /^https?:/i.test(href);
  return (
    <a
      href={href}
      className={`${base} ${sz} ${v} ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

// Double-bezel frame: 16px outer, 12px inner core.
export function Frame({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`rounded-frame border border-hairline bg-surface p-1.5 shadow-frame ${className}`}>
      <div
        className={`relative overflow-hidden rounded-frame-inner border border-[rgb(232_236_241/0.06)] bg-surface-2 ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
