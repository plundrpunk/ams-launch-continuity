import { evidence } from "../content";
import { Container, Reveal } from "./ui";

function Table({ columns, rows, label }: { columns: readonly string[]; rows: readonly (readonly string[])[]; label: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[13px] sm:text-sm" aria-label={label}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`border-b border-hairline pb-3 font-normal text-muted ${i === 0 ? "text-left" : "text-right"}`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-hairline last:border-b-0">
              {r.map((cell, i) => (
                <td key={`${r[0]}-${i}`} className={`py-4 text-text ${i === 0 ? "pr-4 text-left" : "pl-3 text-right whitespace-nowrap"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Evidence() {
  return (
    <section id="evidence" aria-labelledby="evidence-title" className="py-24 md:py-32 lg:py-40">
      <Container>
        <Reveal>
          <h2 id="evidence-title" className="display-h2 max-w-[24ch] text-text">
            {evidence.heading}
          </h2>
        </Reveal>

        {/* Two large typographic figures. No cards. */}
        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {evidence.figures.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.08}>
              <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[clamp(2.25rem,5vw,4.5rem)] leading-none tracking-[-0.04em] text-text">
                <span>{f.value}</span>
                <span className="text-[0.36em] tracking-normal text-muted">{evidence.vs}</span>
                <span className="text-muted">{f.against}</span>
              </p>
              <p className="mt-4 text-sm text-muted">{f.label}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 lg:mt-24">
          <Table columns={evidence.benchmark.columns} rows={evidence.benchmark.rows} label="MemoryArena benchmark results" />
          <p className="mt-5 max-w-[72ch] text-sm leading-relaxed text-muted">{evidence.benchmark.caption}</p>
        </Reveal>

        <Reveal className="mt-20 lg:mt-28">
          <h3 className="text-xl font-medium tracking-[-0.02em] text-text">{evidence.safety.heading}</h3>
          <div className="mt-6">
            <Table columns={evidence.safety.columns} rows={evidence.safety.rows} label="Memory-safety harness results" />
          </div>
          <p className="mt-5 max-w-[72ch] text-sm leading-relaxed text-muted">{evidence.safety.caption}</p>
        </Reveal>
      </Container>
    </section>
  );
}
