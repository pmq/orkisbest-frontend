<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchFactions, compareFactions } from '../composables/useApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import WinPredictionBar from '../components/WinPredictionBar.vue'
import MetricComparisonRow from '../components/MetricComparisonRow.vue'
import StrengthWeaknessList from '../components/StrengthWeaknessList.vue'
import WinTrendChart from '../components/WinTrendChart.vue'

const factions = ref([])
const factionAId = ref('')
const factionBId = ref('')
const data = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedLevel = ref(2000)
const rostersExpanded = ref(false)

const pointsLevels = [500, 1000, 1500, 2000, 3000]

const canCompare = computed(() => factionAId.value && factionBId.value && factionAId.value !== factionBId.value)

const factionAName = computed(() => data.value?.factionAName ?? 'Faction A')
const factionBName = computed(() => data.value?.factionBName ?? 'Faction B')

const trendData = computed(() => {
  if (!data.value) return []
  return data.value.results.map((r) => ({
    pointsLimit: r.pointsLimit,
    armyAWinPct: r.comparison.prediction.armyAWinPct,
    armyBWinPct: r.comparison.prediction.armyBWinPct,
  }))
})

const trendSummary = computed(() => {
  if (!data.value || data.value.results.length < 2) return ''
  const first = data.value.results[0]
  const last = data.value.results[data.value.results.length - 1]
  const aStart = first.comparison.prediction.armyAWinPct
  const aEnd = last.comparison.prediction.armyAWinPct
  const diff = aEnd - aStart
  const absDiff = Math.abs(diff).toFixed(1)
  if (Math.abs(diff) < 2) {
    return `The matchup stays relatively stable across points levels, with ${factionAName.value} hovering around ${aEnd.toFixed(1)}% win rate.`
  }
  const improving = diff > 0 ? factionAName.value : factionBName.value
  return `${improving} scales better at higher points levels, gaining ${absDiff}% win probability from ${first.pointsLimit} to ${last.pointsLimit} points.`
})

const selectedResult = computed(() => {
  if (!data.value) return null
  return data.value.results.find((r) => r.pointsLimit === selectedLevel.value) ?? data.value.results[0]
})

const selectedComparison = computed(() => selectedResult.value?.comparison ?? null)

const metricLabels = {
  totalWounds: 'Total Wounds',
  rangedOutput: 'Ranged Output',
  meleeOutput: 'Melee Output',
  totalOC: 'Objective Control',
  avgToughness: 'Avg Toughness',
  avgSave: 'Avg Save',
  avgAP: 'Avg AP',
  pointsEfficiency: 'Points Efficiency',
  leadership: 'Leadership',
}

onMounted(async () => {
  try {
    factions.value = await fetchFactions()
  } catch (e) {
    console.error('Failed to load factions', e)
  }
})

async function runComparison() {
  loading.value = true
  error.value = null
  try {
    data.value = await compareFactions(factionAId.value, factionBId.value)
    selectedLevel.value = 2000
    rostersExpanded.value = false
  } catch (e) {
    error.value = 'Failed to compare factions. Make sure the backend is running.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function startOver() {
  factionAId.value = ''
  factionBId.value = ''
  data.value = null
  error.value = null
  rostersExpanded.value = false
}
</script>

<template>
  <div>
    <div class="flex justify-between items-start mb-6 flex-wrap gap-2">
      <div>
        <router-link to="/" class="text-primary text-sm hover:underline no-underline">&larr; Home</router-link>
        <h1 class="text-2xl font-bold mt-1">Faction vs Faction</h1>
        <p class="text-sm text-muted-foreground mt-1">Compare two factions across all points levels with auto-built optimal rosters.</p>
      </div>
      <Button v-if="data" variant="outline" @click="startOver">Start Over</Button>
    </div>

    <!-- Selection UI -->
    <div v-if="!data" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent class="pt-4 space-y-2">
            <label class="text-sm font-semibold text-emerald-400">Faction A</label>
            <Select v-model="factionAId">
              <SelectTrigger>
                <SelectValue placeholder="Select faction..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="f in factions"
                  :key="f.id"
                  :value="f.id"
                  :disabled="f.id === factionBId"
                >
                  {{ f.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="pt-4 space-y-2">
            <label class="text-sm font-semibold text-blue-400">Faction B</label>
            <Select v-model="factionBId">
              <SelectTrigger>
                <SelectValue placeholder="Select faction..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="f in factions"
                  :key="f.id"
                  :value="f.id"
                  :disabled="f.id === factionAId"
                >
                  {{ f.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div v-if="error" class="text-destructive text-sm text-center">{{ error }}</div>

      <div class="flex justify-center">
        <Button
          size="lg"
          :disabled="!canCompare || loading"
          @click="runComparison"
        >
          <span v-if="loading">Analyzing...</span>
          <span v-else>Compare Factions</span>
        </Button>
      </div>
    </div>

    <!-- Results -->
    <div v-else class="space-y-6">
      <!-- Win Trend Chart -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Win Probability Across Points Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <WinTrendChart
            :results="trendData"
            :factionA="factionAName"
            :factionB="factionBName"
          />
          <p class="text-sm text-muted-foreground mt-4">{{ trendSummary }}</p>
        </CardContent>
      </Card>

      <!-- Points Level Selector -->
      <div class="flex flex-wrap justify-center gap-2">
        <Button
          v-for="pl in pointsLevels"
          :key="pl"
          :variant="selectedLevel === pl ? 'default' : 'outline'"
          size="sm"
          @click="selectedLevel = pl"
        >
          {{ pl }} pts
        </Button>
      </div>

      <!-- Detail for selected level -->
      <template v-if="selectedComparison">
        <!-- Prediction -->
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between flex-wrap gap-2">
              <CardTitle class="text-lg">Win Prediction &mdash; {{ selectedLevel }} pts</CardTitle>
              <Badge variant="secondary">{{ selectedComparison.prediction.confidence }} confidence</Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <WinPredictionBar
              :armyAWinPct="selectedComparison.prediction.armyAWinPct"
              :armyBWinPct="selectedComparison.prediction.armyBWinPct"
              :factionA="factionAName"
              :factionB="factionBName"
            />
            <p class="text-sm text-muted-foreground">{{ selectedComparison.prediction.summary }}</p>
          </CardContent>
        </Card>

        <!-- Roster Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card v-for="(side, key) in { a: factionAName, b: factionBName }" :key="key">
            <CardContent class="pt-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold" :class="key === 'a' ? 'text-emerald-400' : 'text-blue-400'">{{ side }}</h3>
                <div class="text-sm text-muted-foreground">
                  {{ selectedComparison.rosterDetails[key].totalPoints }} pts &middot;
                  {{ selectedComparison.rosterDetails[key].unitCount }} units
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Metrics -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Metric Breakdown</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex justify-between text-xs text-muted-foreground mb-2">
              <span class="text-emerald-400 font-semibold">{{ factionAName }}</span>
              <span class="text-blue-400 font-semibold">{{ factionBName }}</span>
            </div>
            <MetricComparisonRow
              v-for="(label, key) in metricLabels"
              :key="key"
              :label="label"
              :valueA="selectedComparison.metrics[key]?.a ?? 0"
              :valueB="selectedComparison.metrics[key]?.b ?? 0"
            />
          </CardContent>
        </Card>

        <!-- Strengths -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <StrengthWeaknessList
              :strengths="selectedComparison.strengths"
              :factionA="factionAName"
              :factionB="factionBName"
            />
          </CardContent>
        </Card>

        <!-- Collapsible Rosters -->
        <Card>
          <CardHeader class="cursor-pointer" @click="rostersExpanded = !rostersExpanded">
            <div class="flex items-center justify-between">
              <CardTitle class="text-lg">View Auto-Built Rosters</CardTitle>
              <span class="text-muted-foreground text-sm">{{ rostersExpanded ? '&#9660;' : '&#9654;' }}</span>
            </div>
          </CardHeader>
          <CardContent v-if="rostersExpanded">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-semibold mb-3 text-emerald-400">{{ factionAName }}</h4>
                <ScrollArea class="h-64">
                  <div class="space-y-2 pr-2">
                    <div
                      v-for="unit in selectedResult.rosterAUnits"
                      :key="unit.id"
                      class="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
                    >
                      <span>
                        {{ unit.name }}
                        <span v-if="unit.count > 1" class="text-muted-foreground ml-1">x{{ unit.count }}</span>
                      </span>
                      <Badge variant="secondary">{{ unit.points }} pts</Badge>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div>
                <h4 class="text-sm font-semibold mb-3 text-blue-400">{{ factionBName }}</h4>
                <ScrollArea class="h-64">
                  <div class="space-y-2 pr-2">
                    <div
                      v-for="unit in selectedResult.rosterBUnits"
                      :key="unit.id"
                      class="flex items-center justify-between text-sm p-2 rounded bg-muted/50"
                    >
                      <span>
                        {{ unit.name }}
                        <span v-if="unit.count > 1" class="text-muted-foreground ml-1">x{{ unit.count }}</span>
                      </span>
                      <Badge variant="secondary">{{ unit.points }} pts</Badge>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </template>

      <div class="flex justify-center pb-4">
        <Button variant="outline" @click="startOver">Start Over</Button>
      </div>
    </div>
  </div>
</template>
