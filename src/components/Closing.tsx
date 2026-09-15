import { alt, closing, cta, links } from "../content";
import { Button, Container, Reveal } from "./ui";

const base = import.meta.env.BASE_URL;

export default function Closing() {
  return (
    <section id="closing" aria-labelledby="closing-title" className="relative overflow-hidden py-28 md:py-36 lg:py-48">
      {/* Machined hexagon photograph at low opacity behind the closing statement. Hidden if the file is missing. */}
      <img
        src={`${base}img/continuity-hex.webp`}
        alt={alt.hex}
        width={1376}
        height={768}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[min(1180px,150%)] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.3] [mask-image:radial-gradient(55%_60%_at_50%_50%,rgb(0_0_0/0.9),transparent_78%)]"
      />
      <Container className="relative text-center">
        <Reveal>
          <h2
            id="closing-title"
            className="text-[clamp(2.5rem,5.6vw,5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-text"
          >
            {closing.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-[58ch] text-balance text-[17px] leading-relaxed text-muted sm:text-lg">{closing.body}</p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button href={links.startFree} size="lg">
              {cta.start}
            </Button>
            <Button href={links.whitepaper} variant="ghost" size="lg">
              {cta.docs}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
