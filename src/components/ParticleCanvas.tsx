import { useEffect, useRef, type RefObject } from "react";
import { ParticleField } from "../lib/field";
import { fieldStore } from "../lib/fieldStore";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

// One fixed canvas shared by the hero (t = 0) and the pinned story (t 0 to 1).
// Sections after the story carry an opaque background and simply cover it.
export default function ParticleCanvas({ stageRef }: { stageRef: RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const field = new ParticleField(canvas, reduced);
    field.mount();

    let io: IntersectionObserver | null = null;
    const stage = stageRef.current;
    if (stage) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) field.setInView(e.isIntersecting);
        },
        { threshold: 0 },
      );
      io.observe(stage);
    }

    const onVisibility = () => field.setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const onMove = (e: PointerEvent) => {
      fieldStore.pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      fieldStore.pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (!reduced) window.removeEventListener("pointermove", onMove);
      fieldStore.pointerX = 0;
      fieldStore.pointerY = 0;
      field.destroy();
    };
  }, [reduced, stageRef]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
