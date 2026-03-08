<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFactionUnits, fetchFactions } from '../composables/useApi'
import UnitCard from '../components/UnitCard.vue'
import RosterPanel from '../components/RosterPanel.vue'
import UnitDetail from '../components/UnitDetail.vue'

const props = defineProps({ factionId: String })

const factionName = ref('')
const units = ref([])
const roster = ref([])
const loading = ref(true)
const search = ref('')
const selectedUnit = ref(null)

const filteredUnits = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return units.value
  return units.value.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.keywords?.some(k => k.toLowerCase().includes(q))
  )
})

const totalPoints = computed(() =>
  roster.value.reduce((sum, entry) => sum + entry.unit.points * entry.count, 0)
)

const pointsLimit = ref(2000)

onMounted(async () => {
  const [factions, unitList] = await Promise.all([
    fetchFactions(),
    fetchFactionUnits(props.factionId),
  ])
  const faction = factions.find(f => f.id === props.factionId)
  factionName.value = faction?.name ?? 'Unknown Faction'
  units.value = unitList
  loading.value = false
})

function addToRoster(unit) {
  const existing = roster.value.find(e => e.unit.id === unit.id)
  if (existing) {
    existing.count++
  } else {
    roster.value.push({ unit, count: 1 })
  }
}

function removeFromRoster(unitId) {
  const idx = roster.value.findIndex(e => e.unit.id === unitId)
  if (idx === -1) return
  if (roster.value[idx].count > 1) {
    roster.value[idx].count--
  } else {
    roster.value.splice(idx, 1)
  }
}

function clearRoster() {
  roster.value = []
}

function showDetail(unit) {
  selectedUnit.value = unit
}

function closeDetail() {
  selectedUnit.value = null
}
</script>

<template>
  <div>
    <div class="top-bar">
      <div>
        <router-link to="/" class="back">&larr; Factions</router-link>
        <h1>{{ factionName }}</h1>
      </div>
      <div class="points-bar">
        <label>
          Limit:
          <select v-model.number="pointsLimit">
            <option :value="500">500 pts</option>
            <option :value="1000">1000 pts</option>
            <option :value="1500">1500 pts</option>
            <option :value="2000">2000 pts</option>
            <option :value="3000">3000 pts</option>
          </select>
        </label>
        <span :class="{ over: totalPoints > pointsLimit }">
          {{ totalPoints }} / {{ pointsLimit }} pts
        </span>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading units...</div>

    <div v-else class="builder-layout">
      <div class="unit-browser">
        <input
          v-model="search"
          type="text"
          placeholder="Search units or keywords..."
          class="search-input"
        />
        <div class="unit-list">
          <UnitCard
            v-for="unit in filteredUnits"
            :key="unit.id"
            :unit="unit"
            @add="addToRoster(unit)"
            @click="showDetail(unit)"
          />
        </div>
      </div>

      <RosterPanel
        :roster="roster"
        :totalPoints="totalPoints"
        :pointsLimit="pointsLimit"
        @remove="removeFromRoster"
        @clear="clearRoster"
        @show-detail="showDetail"
      />
    </div>

    <UnitDetail
      v-if="selectedUnit"
      :unit="selectedUnit"
      @close="closeDetail"
      @add="addToRoster(selectedUnit)"
    />
  </div>
</template>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.back {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.85rem;
}

.back:hover {
  text-decoration: underline;
}

h1 {
  font-size: 1.5rem;
  margin-top: 0.25rem;
}

.points-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.points-bar select {
  background: var(--bg-card);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.points-bar .over {
  color: var(--accent);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.builder-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 900px) {
  .builder-layout {
    grid-template-columns: 1fr;
  }
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.unit-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}
</style>
