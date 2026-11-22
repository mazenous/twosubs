import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  root: "src/popup",
  build: {
    outDir: "../../dist-popup",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, "src/popup/popup.html"),
      },
      output: {
        codeSplitting: {
          groups: [
            {
              name: "naive-ui",
              test: /node_modules\/naive-ui/,
            },
            {
              name: "vue",
              test: /node_modules\/(vue|@vue)/,
            },
          ],
        },
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/[name][extname]";
          }
          if (assetInfo.name?.endsWith(".html")) {
            return "[name][extname]";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
  base: "./",
});
