import { createRouter, createWebHistory } from 'vue-router'
import FactionList from '../views/FactionList.vue'
import RosterBuilder from '../views/RosterBuilder.vue'
import RosterCompare from '../views/RosterCompare.vue'
import FactionCompare from '../views/FactionCompare.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'factions', component: FactionList },
    { path: '/factions/compare', name: 'factionCompare', component: FactionCompare },
    { path: '/roster/:factionId', name: 'roster', component: RosterBuilder, props: true },
    { path: '/compare', name: 'compare', component: RosterCompare },
  ],
})

export default router
