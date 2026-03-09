<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFactionUnits, fetchFactions } from '../composables/useApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const pointsLimit = ref('2000')

const pointsLimitNum = computed(() => Number(pointsLimit.value))

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

function saveRoster() {
  const data = {
    faction: factionName.value,
    pointsLimit: pointsLimitNum.value,
    totalPoints: totalPoints.value,
    units: roster.value.map(entry => ({
      id: entry.unit.id,
      name: entry.unit.name,
      points: entry.unit.points,
      count: entry.count,
    })),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${factionName.value.toLowerCase().replace(/\s+/g, '-')}-roster.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importRoster(data) {
  if (!data?.units?.length) return
  roster.value = data.units.map(entry => {
    const unit = units.value.find(u => u.id === entry.id)
    if (!unit) return null
    return { unit, count: entry.count || 1 }
  }).filter(Boolean)
  if (data.pointsLimit) {
    pointsLimit.value = String(data.pointsLimit)
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-start mb-4 flex-wrap gap-2">
      <div>
        <router-link to="/" class="text-primary text-sm hover:underline no-underline">&larr; Factions</router-link>
        <h1 class="text-2xl font-bold mt-1">{{ factionName }}</h1>
      </div>
      <div class="flex items-center gap-4 text-lg font-semibold">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground">Limit:</span>
          <Select v-model="pointsLimit">
            <SelectTrigger class="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">500 pts</SelectItem>
              <SelectItem value="1000">1000 pts</SelectItem>
              <SelectItem value="1500">1500 pts</SelectItem>
              <SelectItem value="2000">2000 pts</SelectItem>
              <SelectItem value="3000">3000 pts</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span :class="{ 'text-destructive': totalPoints > pointsLimitNum }">
          {{ totalPoints }} / {{ pointsLimitNum }} pts
        </span>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12 text-muted-foreground">Loading units...</div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
      <div>
        <Input
          v-model="search"
          type="text"
          placeholder="Search units or keywords..."
          class="mb-4"
        />
        <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
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
        :pointsLimit="pointsLimitNum"
        @remove="removeFromRoster"
        @clear="clearRoster"
        @show-detail="showDetail"
        @save="saveRoster"
        @import="importRoster"
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
