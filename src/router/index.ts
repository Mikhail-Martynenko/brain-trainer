import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import GamePage from "@/views/GamePage.vue";
import SettingsPage from "@/views/SettingsPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'settingsPage',
    component: SettingsPage
  },
  {
    path: '/game',
    name: 'gamePage',
    component: GamePage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
