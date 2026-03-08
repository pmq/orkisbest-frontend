import { createRouter, createWebHistory } from 'vue-router'
import FactionList from '../views/FactionList.vue'
import RosterBuilder from '../views/RosterBuilder.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'factions', component: FactionList },
    { path: '/roster/:factionId', name: 'roster', component: RosterBuilder, props: true },
  ],
})

export default router
