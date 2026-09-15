import { cta, links, pricing } from "../content";
import { Button, Container, Reveal } from "./ui";

function Price({ price }: { price: string }) {
  return (
    <p className="mt-6 font-mono text-4xl tracking-[-0.03em] text-text">
      {price} <span className="text-base tracking-normal text-muted">{pricing.period}</span>
    </p>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal>
          <h2 id="pricing-title" className="display-h2 max-w-[20ch] text-text">
            {pricing.heading}
          </h2>
        </Reveal>

        {/* Asymmetric 2 + 1, then a full-width strip. */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 lg:mt-16">
          <Reveal className="md:col-span-6 lg:col-span-4">
            <div className="flex h-full flex-col justify-between gap-10 rounded-panel border border-hairline bg-surface p-7 sm:p-9">
              <div>
                <h3 className="text-xl font-medium tracking-[-0.02em] text-text">{pricing.free.name}</h3>
                <Price price={pricing.free.price} />
                <p className="mt-5 leading-relaxed text-muted">{pricing.free.includes}</p>
              </div>
              <Button href={links.startFree} className="self-start">
                {cta.start}
              </Button>
            </div>
          </Reveal>

          <Reveal className="md:col-span-6 lg:col-span-5" delay={0.06}>
            <div className="relative h-full overflow-hidden rounded-panel border border-hairline bg-surface-2 p-7 sm:p-9">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(99_164_230/0.16),transparent)]"
              />
              <div className="relative">
                <h3 className="text-xl font-medium tracking-[-0.02em] text-text">{pricing.professional.name}</h3>
                <Price price={pricing.professional.price} />
                <p className="mt-5 leading-relaxed text-muted">{pricing.professional.includes}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-12 lg:col-span-3" delay={0.12}>
            <div className="h-full rounded-panel border border-dashed border-[rgb(232_236_241/0.16)] p-7 sm:p-9">
              <h3 className="text-xl font-medium tracking-[-0.02em] text-text">{pricing.runtime.name}</h3>
              <Price price={pricing.runtime.price} />
              <p className="mt-5 leading-relaxed text-muted">{pricing.runtime.includes}</p>
            </div>
          </Reveal>

          <Reveal className="md:col-span-12" delay={0.18}>
            <div className="flex flex-col gap-8 rounded-panel border border-hairline bg-surface-2 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
              <div className="md:flex md:items-baseline md:gap-8">
                <h3 className="text-xl font-medium tracking-[-0.02em] text-text">{pricing.enterprise.name}</h3>
                <p className="mt-3 font-mono text-2xl tracking-[-0.02em] text-text md:mt-0">
                  {pricing.enterprise.price}{" "}
                  <span className="text-base tracking-normal text-muted">{pricing.period}</span>
                </p>
              </div>
              <p className="leading-relaxed text-muted md:max-w-[28ch] md:text-right">{pricing.enterprise.includes}</p>
              <Button href={links.discord} variant="ghost" className="self-start md:self-auto">
                {cta.community}
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <p className="mt-8 text-sm text-muted">{pricing.pilot}</p>
        </Reveal>
      </Container>
    </section>
  );
}
