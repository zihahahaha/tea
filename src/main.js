import { createApp } from 'vue'
import * as vue from "vue";


requirejs.config({
    baseUrl: "/app",
});

const t = vue;
define("vue", [], () => {
    return t;
});

import App from "./Tea.vue";
const app = createApp(App);

app.mount('#tea');

