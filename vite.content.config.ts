import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2022",
    minify: "esbuild",
    outDir: "dist-content",
    rollupOptions: {
      input: resolve(__dirname, "src/content.ts"),
      output: {
        format: "esm", // bundle everything for content script
        entryFileNames: "content.js",
      },
    },
  },
});
