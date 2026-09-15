// Mutable, render-free channel between the scroll story and the particle field.
// Written by GSAP ScrollTrigger and pointer handlers, read once per animation frame.
// Never mirrored into React state.
export const fieldStore = {
  /** Interpolation parameter: 0 scattered, 0.5 linked, 1 loop. */
  target: 0,
  /** Pointer position normalized to [-1, 1] from the viewport center. */
  pointerX: 0,
  pointerY: 0,
};
