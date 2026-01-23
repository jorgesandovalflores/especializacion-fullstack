import { createApp } from "vue";
import "./style.css";
//import App from './App.vue'
import AppNavitation from "./AppNavitation.vue";
import router from "./router/routes";

createApp(AppNavitation).use(router).mount("#app");
