import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')