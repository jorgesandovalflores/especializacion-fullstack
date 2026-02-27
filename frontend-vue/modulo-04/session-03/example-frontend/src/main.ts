import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import * as Sentry from "@sentry/vue";
import LogRocket from "logrocket";
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);
Sentry.init({
    app,
    dsn: "https://cd938d7c612a4eca2807e9a83a9a5c9c@o4510955156340736.ingest.us.sentry.io/4510955165122560",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});
LogRocket.init("frbxh8/javascript-vue");
app.use(createPinia());
app.use(router);
app.mount("#app");
