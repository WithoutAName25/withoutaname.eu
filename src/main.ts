import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from "./routes";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCaretDown, faCircleHalfStroke, faHouse } from "@fortawesome/free-solid-svg-icons";

const router = createRouter({
    history: createWebHistory(),
    routes
})

library.add(
        faGithub,
        faHouse,
        faCircleHalfStroke,
        faCaretDown,
)

createApp(App)
        .component('FontAwesomeIcon', FontAwesomeIcon)
        .use(router)
        .mount('#app')
