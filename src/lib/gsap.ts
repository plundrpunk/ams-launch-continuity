import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

// Register ScrollTrigger exactly once and refresh after web fonts settle so
// pin positions are measured against the final layout.
export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
    }
  }
  return { gsap, ScrollTrigger };
}
