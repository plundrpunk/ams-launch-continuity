import { useRef } from "react";
import { MotionConfig } from "motion/react";
import { nav } from "./content";
import Nav from "./components/Nav";
import ParticleCanvas from "./components/ParticleCanvas";
import Hero from "./components/Hero";
import Coalesce from "./components/Coalesce";
import MemoryTiers from "./components/MemoryTiers";
import OperatingLoop from "./components/OperatingLoop";
import Evidence from "./components/Evidence";
import Boundary from "./components/Boundary";
import Interfaces from "./components/Interfaces";
import Pricing from "./components/Pricing";
import Closing from "./components/Closing";
import Footer from "./components/Footer";

export default function App() {
  // The stage wraps the hero and the pinned story; the canvas pauses when it leaves the viewport.
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] inline-flex h-11 -translate-y-24 items-center rounded-btn bg-accent px-4 text-sm font-medium text-bg transition-transform focus-visible:translate-y-0"
      >
        {nav.skip}
      </a>
      <Nav />
      <ParticleCanvas stageRef={stageRef} />
      <main id="main">
        <div ref={stageRef} className="relative">
          <Hero />
          <Coalesce />
        </div>
        <div className="relative z-10 bg-bg">
          <MemoryTiers />
          <OperatingLoop />
          <Evidence />
          <Boundary />
          <Interfaces />
          <Pricing />
          <Closing />
        </div>
      </main>
      <Footer />
    </MotionConfig>
  );
}
