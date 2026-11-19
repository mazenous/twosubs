import { createApp } from "vue";
import App from "./App.vue";
// @ts-ignore CSS is loaded by the bundler and has no TypeScript module declaration.
import "./assets/styles.css";

createApp(App).mount("#app");
