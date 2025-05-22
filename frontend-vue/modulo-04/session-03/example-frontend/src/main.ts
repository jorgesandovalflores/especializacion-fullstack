import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as Sentry from "@sentry/vue";
import 'bootstrap/dist/css/bootstrap.min.css'

const app = createApp(App)
Sentry.init({
  app,
  dsn: "https://fb38148e028841da8d12c0d9e02a59b2@o4509369188679680.ingest.us.sentry.io/4509369190055936",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

app.use(createPinia())
app.use(router)
app.mount('#app')