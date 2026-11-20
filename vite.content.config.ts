import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "output",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/content.ts"),
      formats: ["iife"],
      name: "ContentScript",
      fileName: () => "content.js",
    },
  },
});
