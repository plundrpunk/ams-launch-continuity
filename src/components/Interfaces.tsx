import { motion } from "motion/react";
import { interfaces } from "../content";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { Container, EASE, Reveal } from "./ui";

export default function Interfaces() {
  const reduced = usePrefersReducedMotion();
  return (
    <section id="interfaces" aria-labelledby="interfaces-title" className="py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal className="max-w-[62rem]">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{interfaces.eyebrow}</p>
          <h2 id="interfaces-title" className="display-h2 mt-5 max-w-[24ch] text-text">
            {interfaces.heading}
          </h2>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-relaxed text-muted sm:text-lg">{interfaces.body}</p>
        </Reveal>

        {/* Typographic cluster of the eleven real MCP tool names. */}
        <ul aria-label={interfaces.listLabel} className="mt-14 flex max-w-[62rem] flex-wrap gap-3 lg:mt-20">
          {interfaces.tools.map((t, i) =>
            reduced ? (
              <li
                key={t}
                className="rounded-btn border border-hairline bg-surface px-4 py-2.5 font-mono text-[14px] text-text sm:text-[15px]"
              >
                {t}
              </li>
            ) : (
              <motion.li
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{ duration: 0.6, delay: 0.04 * i, ease: EASE }}
                className="rounded-btn border border-hairline bg-surface px-4 py-2.5 font-mono text-[14px] text-text sm:text-[15px]"
              >
                {t}
              </motion.li>
            ),
          )}
        </ul>
      </Container>
    </section>
  );
}
