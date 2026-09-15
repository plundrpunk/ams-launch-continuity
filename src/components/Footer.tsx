import { ArrowUpRight } from "@phosphor-icons/react";
import { alt, cta, footer, links } from "../content";
import { Container } from "./ui";

const base = import.meta.env.BASE_URL;

const items = [
  { label: footer.siteLabel, href: links.site },
  { label: cta.code, href: links.github },
  { label: cta.community, href: links.discord },
  { label: cta.docs, href: links.whitepaper },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-hairline bg-bg">
      <Container className="py-12 lg:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <img src={`${base}ams_logo5.svg`} alt={alt.logo} width={900} height={360} className="h-20 w-auto md:h-24" />
            <p className="mt-6 text-sm text-muted">{footer.copyright}</p>
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-0">
            {items.map((it) => (
              <li key={it.href}>
                <a
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 text-sm text-muted transition-colors hover:text-text"
                >
                  {it.label}
                  <ArrowUpRight size={14} weight="light" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
