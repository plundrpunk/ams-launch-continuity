import { useEffect, useRef } from "react";
import { loop } from "../content";
import { getGsap } from "../lib/gsap";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { Container, Reveal } from "./ui";

// GSAP sticky stack: each full-height card pins at "top top" with no pin spacing;
// as the next card arrives the previous one scales to 0.94 and dims.
// Under reduced motion, or below 768px, the cards simply stack.
export default function OperatingLoop() {
  const reduced = usePrefersReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const container = stackRef.current;
    if (!container) return;
    const { gsap, ScrollTrigger } = getGsap();
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", container);
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: container,
          end: "bottom bottom",
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        });
        const inner = card.querySelector<HTMLElement>("[data-card-inner]");
        if (inner && i < cards.length - 1) {
          gsap.to(inner, {
            scale: 0.94,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        }
      });
    });
    return () => mm.revert();
  }, [reduced]);

  return (
    <section id="loop" aria-labelledby="loop-title" className="py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal>
          <h2 id="loop-title" className="display-h2 text-text">
            {loop.heading}
          </h2>
        </Reveal>
      </Container>

      <div ref={stackRef} className="relative mt-12 lg:mt-16">
        {loop.cards.map((c, i) => (
          <article
            key={c.verb}
            data-card
            aria-labelledby={`loop-${c.verb.toLowerCase()}`}
            style={{ zIndex: i + 1 }}
            className={`relative isolate flex items-center bg-bg py-3 ${reduced ? "" : "md:h-[100dvh] md:py-0"}`}
          >
            <div data-card-inner className="mx-auto w-full max-w-[1120px] origin-center px-5 will-change-transform sm:px-8 lg:px-10">
              <div className="grid gap-10 rounded-panel border border-hairline bg-surface p-7 shadow-panel sm:p-10 md:min-h-[50dvh] lg:grid-cols-12 lg:gap-12 lg:p-14">
                <div className="lg:col-span-4">
                  <h3
                    id={`loop-${c.verb.toLowerCase()}`}
                    className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-medium leading-none tracking-[-0.04em] text-text"
                  >
                    {c.verb}
                  </h3>
                </div>
                <div className="flex flex-col justify-between gap-10 lg:col-span-8">
                  <p className="max-w-[56ch] text-[17px] leading-relaxed text-muted sm:text-lg lg:text-xl">{c.body}</p>
                  <pre className="whitespace-pre-wrap rounded-[10px] border border-hairline bg-bg/70 p-5 font-mono text-[13px] leading-[1.7] text-text [overflow-wrap:anywhere] sm:p-6 sm:text-sm">
                    <code>{c.code.join("\n")}</code>
                  </pre>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Container>
        <Reveal>
          <p className="mt-12 text-sm text-muted lg:mt-16">{loop.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
