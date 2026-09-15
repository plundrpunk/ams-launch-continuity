import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { preloadAssets } from "./preload-assets";

// BASE_PATH is set by deploy.sh to "/<repo>/" for GitHub Pages project sites.
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss(), preloadAssets({ fonts: [/geist-latin-wght-normal.*\.woff2$/, /geist-mono-latin-wght-normal.*\.woff2$/] })],
  build: {
    target: "es2022",
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap")) return "gsap";
          if (id.includes("node_modules/motion") || id.includes("node_modules/framer-motion")) return "motion";
        },
      },
    },
  },
});
