import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true,
    outDir: "output",
    rollupOptions: {
      input: {
        content: resolve(import.meta.dirname, "src/content.ts"),
        //TODO popup should be in output/popup not in src/popup
        popup: resolve(import.meta.dirname, "src/popup/popup.html"),
        // background: resolve(__dirname, "src/background/background.ts"), // background script
      },

      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
  base: "./",
});
