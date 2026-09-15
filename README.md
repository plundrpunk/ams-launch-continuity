# Automaton Memory System launch page. Direction 1: Continuity

Dark, cinematic launch page for Automaton Memory System (Dead Reckoning Foundry). The medium is a Canvas 2D particle field that reads as "runs": scattered in the hero, pulled into linked clusters, then settled onto one glowing operating loop as the visitor scrolls a pinned story. Built from `_template/` per `DESIGN.md` section 2.

## Stack

- Vite 7, React 19, TypeScript strict, Tailwind v4 (`@tailwindcss/vite`).
- `motion/react` for UI motion (entry fades, mobile menu), wrapped in `MotionConfig reducedMotion="user"`.
- GSAP 3 ScrollTrigger, registered once in `src/lib/gsap.ts`, used only for the pinned Coalesce story and the sticky-stack loop. All GSAP work lives inside `gsap.context` and is reverted on unmount; `gsap.matchMedia` scopes the stack to viewports 768px and wider.
- `@phosphor-icons/react`, weight `light` only (menu toggle, external-link arrows in the footer).
- Fonts self-hosted through `@fontsource-variable/geist` and `@fontsource-variable/geist-mono`, imported in `src/index.css`. No Google Fonts tags.

## Fonts and palette

- Display and body: Geist Variable, weights 400 to 600, tight tracking on display sizes.
- Records, tool names, numerals: Geist Mono Variable.
- Background `#0A0D11`, surface `#11161C`, surface-2 `#171D25`, hairline `rgba(232,236,241,0.10)`, text `#E8ECF1`, muted `#98A2AE`, accent `#63A4E6` (the only accent), accent-deep `#2E6FA9` used only inside the canvas glow. Shadows are blue-black (`rgba(4,8,14,0.6)`). No pure black or white anywhere.
- Radius system: 14px panels, 10px buttons and inner code cores, double-bezel frames 16px outer and 12px inner.
- Theme locked dark, `color-scheme: dark` on `:root`.

## Sections and layout families

| # | Section (id) | Component | Layout family |
|---|---|---|---|
| 1 | Hero (`#top`) | `Hero.tsx` | Asymmetric copy-left over a full-bleed generative canvas at t = 0 |
| 2 | Coalesce (`#story`) | `Coalesce.tsx` | GSAP-pinned full-viewport scroll story, 300vh scrub, captions lower-left crossfading at thirds |
| 3 | Three kinds of memory (`#memory`) | `MemoryTiers.tsx` | 7/5 asymmetric panel grid; tall double-bezel photo panel plus two stacked panels |
| 4 | The operating loop (`#loop`) | `OperatingLoop.tsx` | GSAP sticky stack of four full-height cards (`start: "top top"`, previous card scales to 0.94 and dims) |
| 5 | Evidence (`#evidence`) | `Evidence.tsx` | Plain typographic figures and two mono tables, no cards |
| 6 | Boundary (`#boundary`) | `Boundary.tsx` | Full-width display statement plus a framed real screenshot |
| 7 | Interfaces (`#interfaces`) | `Interfaces.tsx` | Typographic pill cluster of the eleven real MCP tool names |
| 8 | Pricing (`#pricing`) | `Pricing.tsx` | Asymmetric 4/5/3 panels plus a full-width Enterprise strip |
| 9 | Closing and footer (`#closing`) | `Closing.tsx`, `Footer.tsx` | Centered statement over a low-opacity photograph, then a two-column footer |

No two sections share a layout family. There are no consecutive image-and-text splits.

## The canvas

`src/lib/field.ts` is a framework-free particle engine; `src/components/ParticleCanvas.tsx` owns its lifecycle. One fixed canvas is shared by the hero and the pinned story; every later section carries an opaque background and covers it.

- 1200 points at 1024px and wider, 760 at tablet, 420 below 768px. DPR capped at 2.
- Three states blended by `t`: scattered (per-point sinusoidal drift, muted grey at 30 to 50% alpha, density weighted to the right half at desktop and the lower half on mobile), linked (six cluster centers, two nearest neighbors per point joined by accent hairlines at up to 17% alpha, 13% of points brighten), loop (a slightly irregular rotated ellipse; points travel along a narrow band; the path glows softly with three accent strokes; one brighter head point leads).
- `t` is written by the story's ScrollTrigger into `src/lib/fieldStore.ts`, a plain mutable object read once per frame. Pointer parallax (max 12px, smoothed) goes through the same store. Nothing touches React state.
- Pauses via IntersectionObserver on the hero-plus-story stage and on `visibilitychange`; the rAF loop is cancelled and observers disconnected on unmount.
- Reduced motion: a single static render at t = 1, no drift, no parallax, redrawn only on resize.

## Eyebrows

Two eyebrow positions on the page:

1. The pinned story label (mono, accent, uppercase tracked). It is one position whose text crossfades through "Disconnected runs", "Durable memory", "One operating loop". Because the three labels are separate DOM nodes, the QA harness heuristic reports them as three.
2. "MCP, REST, CLI" above the Interfaces heading.

Nothing else on the page is uppercase-tracked. No numbered eyebrows, step labels, version labels, scroll cues, decorative dots, or middle-dot chains. The single middle dot on the page is the permitted one in the Procedural figure.

## Copy

Every visible string lives in `src/content.ts`. Self-audit against `DESIGN.md` sections 0 and 1, done after the final build:

- Every number on the page appears in section 0: 730, 0.90, 22,422, 99.97%, 0.50, 0.30, 0.7764, 0.5532, $33.28, $41.46, 19.7%, the safety triples, all prices, 3 slots, $500, 90 days, and the two dates. The Delta row (+0.20, +0.22, 19.7% lower) is the section 0 delta restated in the table's units.
- CTA labels are exactly the four permitted labels, one per intent. "Start free" always points to the free-tier link; "Read the whitepaper" always to the whitepaper.
- "AMS" appears only after the full product name has appeared (hero subtext).
- Illustrative values are labeled in visible text next to them ("Values illustrative.", "Arguments are illustrative.").
- Both required caveats are present verbatim.
- Zero em-dashes or en-dashes in source or rendered text (grep and harness both clean).
- No testimonials, logos, invented names, or invented metrics.

## Accessibility

Skip link, one `h1`, sections with ids matching the nav anchors, `aria-labelledby` on every section, visible accent focus rings, alt text on every image, external links with `target="_blank" rel="noopener noreferrer"`, all interactive targets at least 44px tall at 390px (including the open mobile menu), body text contrast above 4.5:1 (muted `#98A2AE` on `#0A0D11` is about 7.4:1), primary buttons use dark text on the accent fill.

## QA results

Harness: `_tools/qa.mjs` (Playwright). Because `NODE_PATH` does not apply to ESM imports and the global install is `@playwright/test`, the unmodified script was run from a scratchpad copy with a `node_modules/playwright` symlink to `/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright`. `_tools/` was not modified.

Evidence under `_evidence/continuity/`:

- `pass1/`: first build. One failure: horizontal overflow at 320px (372 > 320). Root cause was the hero's 12-column grid with 32px gutters applied at every width (eleven gutters alone exceed a 280px container). Note: in pass1 the normal and reduced runs wrote to the same folder, so its PNGs are from the reduced run.
- `pass2/` and `pass3/`: fixes for the grid, an Evidence figure that wrapped at desktop, a compositing bleed in the sticky stack, and cluster placement. pass3 reached zero failures in both modes, but the normal-mode full-page captures were incomplete because `scroll-behavior: smooth` made programmatic scrolls lag; `whileInView` reveals for the last sections never fired before the capture.
- `pass4/` (final): `failures: []` in normal mode and `failures: []` in reduced mode (`pass4/reduced/`). Desktop and mobile full-page captures are complete in both modes. Zero console errors, zero failed requests, no overflow at 320, 390, 768, 1024, 1440, 1920, hero headline, subtext and both CTAs inside the first viewport at 1440x900 and 390x844, headline on two lines at desktop, subtext 19 words.

Manual Playwright checks at 1440x900 (scratchpad scripts, not committed): the story pins with `position: fixed; top: 0` for the full 300vh and captions switch a to b to c at progress 0.18 / 0.50 / 0.84; each loop card pins at top 0 and the previous card reaches scale 0.94 and opacity 0.35 as the next arrives; the mobile menu opens with five 44px targets; the sub-path build (`BASE_PATH=/ams-launch-continuity/`) rewrites the favicon, `import.meta.env.BASE_URL` image paths, and font URLs correctly.

## Deviations from DESIGN.md and why

1. Nav logo. The spec asks for the official SVG at 28px height. The lockup is 2.5:1, so at 28px it is 70px wide and the wordmark text is about 1px tall (rendered and checked). The nav instead uses `public/ams-mark.svg`, the hex mark cropped from the official file (same artwork, viewBox reduced, wordmark group removed) at 28px, with "Automaton Memory System" set in Geist 500 beside it. The full lockup appears in the footer at 64px, where it reads.
2. Hero copy column. Copy occupies 7 of 12 columns at 1280px and wider (8 at 1024 to 1279) instead of 6 so the 56px headline holds two lines. The canvas density is still weighted to the right half.
3. Sticky stack below 768px. The spec defines the reduced-motion fallback only. On phones the four cards stack without pinning to avoid clipping tall card content in a pinned viewport.
4. Card shells in the sticky stack are opaque page-background rather than transparent, so the dimmed previous card is visible only above the arriving card's top edge. A transparent shell produced a faint compositing bleed of the previous heading through the incoming panel.
5. `scroll-behavior` is `auto`, not smooth, so anchor jumps and programmatic scrolls land exactly, which matters with two long pinned sections.
6. Generated imagery arrived as PNGs (`_assets/gen/continuity-layers-a.png`, `continuity-layers-b.png`, `continuity-hex-a.png`), not WebP. `continuity-layers-a` (steel-framed glass with cool light through the gaps) was chosen over `-b` and converted with `_tools/img.mjs` directly into `public/img/continuity-layers.webp` (928x1152, 31KB). `continuity-hex-a` was judged premium enough and backs the closing at 30% opacity as `public/img/continuity-hex.webp` (1376x768, 28KB). Both images hide themselves through `onError` if missing, leaving a tinted panel and a plain closing.
7. Small copy additions, all from section 0 facts: a one-line Episodic description (the spec gave only the record example for that panel) and an `h3` "Memory-safety harness." above the second table.

## Files

- `src/content.ts`: all copy.
- `src/lib/field.ts`, `src/lib/fieldStore.ts`: particle engine and its render-free channel.
- `src/lib/gsap.ts`: single ScrollTrigger registration, refresh after fonts load.
- `src/lib/usePrefersReducedMotion.ts`: shared media-query hook for canvas, GSAP and Motion branches.
- `src/components/ui.tsx`: `Container`, `Reveal`, `Button`, double-bezel `Frame`.
- `public/ams_logo5.svg` (official lockup), `public/ams-mark.svg` (cropped mark), `public/favicon.svg` (hexagon outline in the accent), `public/img/*.webp`.

## TODO

None blocking. If the art direction ever prefers `continuity-layers-b` (smoked glass, quieter), swap the file at `public/img/continuity-layers.webp`; nothing else changes.
