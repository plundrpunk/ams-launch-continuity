import { alt, tiers } from "../content";
import { Container, Frame, Reveal } from "./ui";

const base = import.meta.env.BASE_URL;

export default function MemoryTiers() {
  return (
    <section id="memory" aria-labelledby="memory-title" className="py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal>
          <h2 id="memory-title" className="display-h2 max-w-[20ch] text-text">
            {tiers.heading}
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-12">
          {/* Episodic: tall double-bezel panel with the layered-glass photograph masked behind. */}
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <Frame className="h-full" innerClassName="h-full">
              <img
                src={`${base}img/continuity-layers.webp`}
                alt={alt.layers}
                width={928}
                height={1152}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.34] [mask-image:linear-gradient(205deg,rgb(0_0_0/0.95)_0%,rgb(0_0_0/0.4)_45%,transparent_82%)]"
              />
              <div className="relative flex h-full min-h-[520px] flex-col justify-between gap-10 p-7 sm:p-9 lg:p-12">
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.02em] text-text">{tiers.episodic.name}</h3>
                  <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{tiers.episodic.body}</p>
                </div>
                <div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-[13px] leading-relaxed sm:text-sm">
                    {tiers.episodic.record.map(([k, v]) => (
                      <div key={k} className="contents">
                        <dt className="text-muted">{k}</dt>
                        <dd className="text-text [overflow-wrap:anywhere]">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-6 text-[13px] text-muted">{tiers.episodic.caption}</p>
                </div>
              </div>
            </Frame>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.08}>
            <div className="h-full rounded-panel border border-hairline bg-surface p-7 sm:p-9">
              <h3 className="text-2xl font-medium tracking-[-0.02em] text-text">{tiers.semantic.name}</h3>
              <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{tiers.semantic.body}</p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.16}>
            <div className="flex h-full flex-col justify-between gap-8 rounded-panel border border-hairline bg-surface-2 p-7 sm:p-9">
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-text">{tiers.procedural.name}</h3>
                <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{tiers.procedural.body}</p>
              </div>
              <div>
                <p className="font-mono text-[13px] leading-relaxed text-text sm:text-sm [overflow-wrap:anywhere]">
                  {tiers.procedural.figure}
                </p>
                <p className="mt-2 text-[13px] text-muted">{tiers.procedural.caption}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
