<script setup>
import { ref, onMounted } from 'vue'
import { fetchFactions } from '../composables/useApi'

const factions = ref([])
const loading = ref(true)

onMounted(async () => {
  factions.value = await fetchFactions()
  loading.value = false
})
</script>

<template>
  <div>
    <h1>Choose Your Faction</h1>
    <p class="subtitle">Select a faction to start building your army roster</p>

    <div v-if="loading" class="loading">Loading factions...</div>

    <div v-else class="faction-grid">
      <router-link
        v-for="faction in factions"
        :key="faction.id"
        :to="{ name: 'roster', params: { factionId: faction.id } }"
        class="faction-card"
      >
        <h2>{{ faction.name }}</h2>
        <span class="unit-count">{{ faction.unitCount }} units</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.faction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.faction-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
  text-decoration: none;
  color: var(--text);
  transition: all 0.2s;
}

.faction-card:hover {
  background: var(--bg-hover);
  border-color: var(--accent);
  transform: translateY(-2px);
}

.faction-card h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.unit-count {
  color: var(--text-muted);
  font-size: 0.85rem;
}
</style>
