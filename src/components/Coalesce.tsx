import { useEffect, useRef } from "react";
import { story } from "../content";
import { fieldStore } from "../lib/fieldStore";
import { getGsap } from "../lib/gsap";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";
import { Container } from "./ui";

// Pinned scroll story. The section pins for 300vh; scroll progress drives the
// particle field from scattered (0) to loop (1) and crossfades three captions at thirds.
export default function Coalesce() {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduced) {
      fieldStore.target = 1;
      return () => {
        fieldStore.target = 0;
      };
    }
    const el = ref.current;
    if (!el) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const caps = gsap.utils.toArray<HTMLElement>("[data-caption]", el);
      gsap.set(caps, { autoAlpha: 0, y: 14 });
      gsap.set(caps[0], { autoAlpha: 1, y: 0 });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            fieldStore.target = self.progress;
          },
        },
      });
      // A one-unit spine so timeline positions map 1:1 onto scroll progress.
      tl.to({}, { duration: 1 }, 0);
      tl.to(caps[0], { autoAlpha: 0, y: -14, duration: 0.06 }, 0.3);
      tl.fromTo(caps[1], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.34);
      tl.to(caps[1], { autoAlpha: 0, y: -14, duration: 0.06 }, 0.63);
      tl.fromTo(caps[2], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.67);
    }, el);
    return () => {
      ctx.revert();
      fieldStore.target = 0;
    };
  }, [reduced]);

  return (
    <section id="story" ref={ref} aria-label={story.ariaLabel} className="relative z-10 min-h-[100dvh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-[linear-gradient(180deg,rgb(10_13_17/0)_0%,rgb(10_13_17/0.72)_100%)]"
      />
      <Container className="relative flex min-h-[100dvh] items-end pb-16 pt-24 lg:pb-24">
        <div className={reduced ? "grid max-w-[40rem] gap-12" : "grid max-w-[40rem]"}>
          {story.captions.map((c) => (
            <div key={c.label} data-caption className={reduced ? "" : "[grid-area:1/1]"}>
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{c.label}</p>
              <p className="mt-4 text-balance text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.025em] text-text">
                {c.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
