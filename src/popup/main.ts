import { createApp } from "vue";
import App from "./App.vue";
import naive from "naive-ui";
//@ts-ignore
import "./assets/styles.css";

const app = createApp(App);

app.use(naive);
app.mount("#app");
