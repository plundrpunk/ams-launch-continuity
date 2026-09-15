import { alt, boundary } from "../content";
import { Container, Frame, Reveal } from "./ui";

const base = import.meta.env.BASE_URL;

export default function Boundary() {
  return (
    <section id="boundary" aria-labelledby="boundary-title" className="py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal className="max-w-[62rem]">
          <h2
            id="boundary-title"
            className="text-[clamp(2.5rem,5.6vw,5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-text"
          >
            {boundary.statement}
          </h2>
          <p className="mt-8 max-w-[52ch] text-[17px] leading-relaxed text-muted sm:text-lg">{boundary.body}</p>
        </Reveal>

        <Reveal className="mt-16 lg:mt-24">
          <Frame>
            <img
              src={`${base}img/scoreboard.webp`}
              alt={alt.scoreboard}
              width={1600}
              height={798}
              decoding="async"
              className="block h-auto w-full"
            />
          </Frame>
          <p className="mt-5 max-w-[72ch] text-sm leading-relaxed text-muted">{boundary.caption}</p>
        </Reveal>
      </Container>
    </section>
  );
}
