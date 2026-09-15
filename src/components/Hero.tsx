import { motion } from "motion/react";
import { cta, hero, links } from "../content";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { Button, Container, EASE } from "./ui";

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section id="top" aria-labelledby="hero-title" className="relative z-10 flex min-h-[100dvh] items-center">
      {/* Legibility wash over the canvas on the copy side. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(10_13_17/0.7)_0%,rgb(10_13_17/0.25)_55%,rgb(10_13_17/0)_100%)] lg:bg-[linear-gradient(90deg,rgb(10_13_17/0.82)_0%,rgb(10_13_17/0.5)_38%,rgb(10_13_17/0)_64%)]"
      />
      <Container className="relative pb-16 pt-28 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pt-24">
        <div className="lg:col-span-8 xl:col-span-7">
          <motion.h1
            id="hero-title"
            className="text-balance text-[clamp(2.375rem,4.1vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.035em] text-text"
            {...enter(0)}
          >
            <span className="block">{hero.line1}</span>
            <span className="block text-muted">{hero.line2}</span>
          </motion.h1>
          <motion.p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-muted sm:text-lg" {...enter(0.08)}>
            {hero.subtext}
          </motion.p>
          <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" {...enter(0.16)}>
            <Button href={links.startFree} size="lg">
              {cta.start}
            </Button>
            <Button href={links.whitepaper} variant="ghost" size="lg">
              {cta.docs}
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
