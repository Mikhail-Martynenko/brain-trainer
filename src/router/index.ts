import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Settings from "@/components/SettingsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'SettingsPage',
    component: Settings
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
