import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  root: "src/popup",
  build: {
    outDir: "../../output/popup",
    emptyOutDir: true,
    sourcemap: true,

    rollupOptions: {
      input: {
        popup: resolve(import.meta.dirname, "src/popup/popup.html"),
      },
      output: {
        entryFileNames: "assets/js/[name].js",
        chunkFileNames: "assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/css/[name][extname]";
          }
          if (assetInfo.name?.endsWith(".html")) {
            console.log("haha");
            return "[name][extname]";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
  base: "./",
});
