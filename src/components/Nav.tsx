import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import { alt, cta, links, nav } from "../content";
import { Button } from "./ui";

const base = import.meta.env.BASE_URL;

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#top" className="flex min-h-11 items-center gap-3">
          <img src={`${base}ams-mark.svg`} alt={alt.mark} width={25} height={28} className="h-7 w-auto" />
          <span className="text-[15px] font-medium tracking-[-0.01em] text-text">{nav.brand}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="inline-flex h-11 items-center px-3 text-sm text-muted transition-colors hover:text-text"
            >
              {it.label}
            </a>
          ))}
          <Button href={links.startFree} className="ml-3">
            {cta.start}
          </Button>
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? nav.menuClose : nav.menuOpen}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-hairline text-text md:hidden"
        >
          {open ? <X size={20} weight="light" /> : <List size={20} weight="light" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="border-t border-hairline bg-bg md:hidden"
          >
            <nav aria-label="Primary" className="mx-auto flex w-full max-w-[1280px] flex-col gap-1 px-5 py-4 sm:px-8">
              {nav.items.map((it) => (
                <a
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center px-2 text-base text-text"
                >
                  {it.label}
                </a>
              ))}
              <Button href={links.startFree} className="mt-3 w-full">
                {cta.start}
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
