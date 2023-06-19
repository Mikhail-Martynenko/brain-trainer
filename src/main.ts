import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/task'
import sessionStore from "@/store/session";

createApp(App)
    .use(store, 'taskStore')
    .use(sessionStore, 'sessionStore')
    .use(router)
    .mount('#app')
