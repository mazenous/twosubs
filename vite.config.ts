import { defineConfig } from "vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "output",
    rollupOptions: {
      input: {
        content: resolve(__dirname, "src/content.ts"), // main popup
        // background: resolve(__dirname, "src/background/background.ts"), // background script
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "content" ? "content.js" : "assets/[name]-[hash].js",
      },
    },
  },
  base: "./",
});
