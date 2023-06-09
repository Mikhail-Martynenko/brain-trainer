import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Settings from "@/components/SettingsPage.vue";
import GamePage from "@/components/GamePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'settings',
    component: Settings
  },
  {
    path: '/game',
    name: 'game',
    component: GamePage,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
