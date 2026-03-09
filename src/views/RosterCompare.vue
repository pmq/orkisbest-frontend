<script setup>
import { ref, computed } from 'vue'
import { compareRosters } from '../composables/useApi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import RosterUpload from '../components/RosterUpload.vue'
import WinPredictionBar from '../components/WinPredictionBar.vue'
import MetricComparisonRow from '../components/MetricComparisonRow.vue'
import StrengthWeaknessList from '../components/StrengthWeaknessList.vue'

const rosterA = ref(null)
const rosterB = ref(null)
const result = ref(null)
const loading = ref(false)
const error = ref(null)

const bothLoaded = computed(() => rosterA.value && rosterB.value)

const factionA = computed(() => result.value?.rosterDetails?.a?.faction ?? rosterA.value?.faction ?? 'Army A')
const factionB = computed(() => result.value?.rosterDetails?.b?.faction ?? rosterB.value?.faction ?? 'Army B')

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

async function runComparison() {
  loading.value = true
  error.value = null
  try {
    result.value = await compareRosters(rosterA.value, rosterB.value)
  } catch (e) {
    error.value = 'Failed to compare rosters. Make sure the backend is running.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function startOver() {
  rosterA.value = null
  rosterB.value = null
  result.value = null
  error.value = null
}
</script>

<template>
  <div>
    <div class="flex justify-between items-start mb-6 flex-wrap gap-2">
      <div>
        <router-link to="/" class="text-primary text-sm hover:underline no-underline">&larr; Home</router-link>
        <h1 class="text-2xl font-bold mt-1">Roster Comparison</h1>
        <p class="text-sm text-muted-foreground mt-1">Upload two roster files to compare their combat effectiveness.</p>
      </div>
      <Button v-if="result" variant="outline" @click="startOver">Start Over</Button>
    </div>

    <div v-if="!result" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RosterUpload
          label="Army A"
          @loaded="rosterA = $event"
          @cleared="rosterA = null"
        />
        <RosterUpload
          label="Army B"
          @loaded="rosterB = $event"
          @cleared="rosterB = null"
        />
      </div>

      <div v-if="error" class="text-destructive text-sm text-center">{{ error }}</div>

      <div class="flex justify-center">
        <Button
          size="lg"
          :disabled="!bothLoaded || loading"
          @click="runComparison"
        >
          <span v-if="loading">Analyzing...</span>
          <span v-else>Compare Rosters</span>
        </Button>
      </div>
    </div>

    <div v-else class="space-y-6">
      <!-- Prediction Summary -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between flex-wrap gap-2">
            <CardTitle class="text-lg">Win Prediction</CardTitle>
            <Badge variant="secondary">{{ result.prediction.confidence }} confidence</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <WinPredictionBar
            :armyAWinPct="result.prediction.armyAWinPct"
            :armyBWinPct="result.prediction.armyBWinPct"
            :factionA="factionA"
            :factionB="factionB"
          />
          <p class="text-sm text-muted-foreground">{{ result.prediction.summary }}</p>
        </CardContent>
      </Card>

      <!-- Roster Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card v-for="(side, key) in { a: factionA, b: factionB }" :key="key">
          <CardContent class="pt-4">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold" :class="key === 'a' ? 'text-emerald-400' : 'text-blue-400'">{{ side }}</h3>
              <div class="text-sm text-muted-foreground">
                {{ result.rosterDetails[key].totalPoints }} pts &middot;
                {{ result.rosterDetails[key].unitCount }} units
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
            <span class="text-emerald-400 font-semibold">{{ factionA }}</span>
            <span class="text-blue-400 font-semibold">{{ factionB }}</span>
          </div>
          <MetricComparisonRow
            v-for="(label, key) in metricLabels"
            :key="key"
            :label="label"
            :valueA="result.metrics[key]?.a ?? 0"
            :valueB="result.metrics[key]?.b ?? 0"
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
            :strengths="result.strengths"
            :factionA="factionA"
            :factionB="factionB"
          />
        </CardContent>
      </Card>

      <div class="flex justify-center pb-4">
        <Button variant="outline" @click="startOver">Start Over</Button>
      </div>
    </div>
  </div>
</template>
