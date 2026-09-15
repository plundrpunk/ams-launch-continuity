import type { Plugin } from "vite";

// Injects <link rel="preload"> tags for hashed font files that match the given
// patterns (discovered from the final bundle) and for a responsive LCP image.
export function preloadAssets(opts: { fonts: RegExp[]; image?: { srcset: string[]; sizes: string } }): Plugin {
  let base = "/";
  return {
    name: "preload-assets",
    configResolved(c) { base = c.base; },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const tags: { tag: string; attrs: Record<string, string>; injectTo: "head" }[] = [];
        const names = Object.keys(ctx.bundle ?? {});
        for (const re of opts.fonts) {
          const f = names.find((n) => re.test(n));
          if (f) tags.push({ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", crossorigin: "", href: base + f }, injectTo: "head" });
        }
        if (opts.image) {
          const srcset = opts.image.srcset.map((s) => { const [p, w] = s.split(" "); return `${base}${p} ${w}`; }).join(", ");
          tags.push({ tag: "link", attrs: { rel: "preload", as: "image", imagesrcset: srcset, imagesizes: opts.image.sizes, fetchpriority: "high" }, injectTo: "head" });
        }
        return tags;
      },
    },
  };
}
