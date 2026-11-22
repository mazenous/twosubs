import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist-content",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/content.ts"),
      formats: ["iife"],
      name: "ContentScript",
      fileName: () => "content.js",
    },
  },
});
