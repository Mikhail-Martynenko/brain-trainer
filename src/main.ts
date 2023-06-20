import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/task'

createApp(App)
    .use(store, 'taskStore')
    .use(router)
    .mount('#app')
