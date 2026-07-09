import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { deviconCdnPlugin } from "./scripts/lib/devicon-cdn";

/**
 * Dedicated Vite build config for the self-contained HTML export (see
 * PLAN.md, milestone 0019, Task 4). Produces a single JS chunk and a single
 * CSS file with no content-hashed filenames, so `build-bundle.ts` can locate
 * and inline them into the exported HTML. This is a separate build target
 * from `vite.config.ts` — the export build never runs as part of `pnpm
 * build`.
 */
export default defineConfig({
  plugins: [react(), tailwindcss(), deviconCdnPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@data": path.resolve(__dirname, "../data"),
    },
  },
  build: {
    outDir: "dist-export",
    cssCodeSplit: false,
    assetsInlineLimit: Infinity,
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "./src/export/entry-client.tsx"),
      output: {
        entryFileNames: "entry-client.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
        inlineDynamicImports: true,
      },
    },
  },
});
