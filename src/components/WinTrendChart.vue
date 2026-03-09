<script setup>
import { computed } from 'vue'

const props = defineProps({
  results: Array,
  factionA: String,
  factionB: String,
})

const width = 500
const height = 250
const padLeft = 45
const padRight = 20
const padTop = 20
const padBottom = 40

const chartW = width - padLeft - padRight
const chartH = height - padTop - padBottom

const pointsLimits = [500, 1000, 1500, 2000, 3000]

const dataPoints = computed(() =>
  pointsLimits.map((pl, i) => {
    const r = props.results.find((d) => d.pointsLimit === pl)
    const x = padLeft + (i / (pointsLimits.length - 1)) * chartW
    return {
      pl,
      x,
      aWin: r?.armyAWinPct ?? 50,
      bWin: r?.armyBWinPct ?? 50,
    }
  })
)

function yPos(pct) {
  return padTop + (1 - pct / 100) * chartH
}

const polylineA = computed(() =>
  dataPoints.value.map((d) => `${d.x},${yPos(d.aWin)}`).join(' ')
)

const polylineB = computed(() =>
  dataPoints.value.map((d) => `${d.x},${yPos(d.bWin)}`).join(' ')
)

const midY = computed(() => yPos(50))
</script>

<template>
  <div>
    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full h-auto">
      <!-- Grid lines -->
      <line
        v-for="pct in [0, 25, 50, 75, 100]"
        :key="'grid-' + pct"
        :x1="padLeft"
        :y1="yPos(pct)"
        :x2="width - padRight"
        :y2="yPos(pct)"
        stroke="currentColor"
        class="text-muted-foreground/20"
        stroke-width="0.5"
      />
      <!-- Y axis labels -->
      <text
        v-for="pct in [0, 25, 50, 75, 100]"
        :key="'ylabel-' + pct"
        :x="padLeft - 6"
        :y="yPos(pct) + 3.5"
        text-anchor="end"
        class="fill-muted-foreground"
        font-size="9"
      >
        {{ pct }}%
      </text>
      <!-- 50% dashed reference -->
      <line
        :x1="padLeft"
        :y1="midY"
        :x2="width - padRight"
        :y2="midY"
        stroke="currentColor"
        class="text-muted-foreground/50"
        stroke-width="1"
        stroke-dasharray="6 4"
      />
      <!-- Faction A line -->
      <polyline
        :points="polylineA"
        fill="none"
        stroke="#10b981"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <!-- Faction B line -->
      <polyline
        :points="polylineB"
        fill="none"
        stroke="#3b82f6"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <!-- Data points and labels -->
      <template v-for="d in dataPoints" :key="'ptA-' + d.pl">
        <circle :cx="d.x" :cy="yPos(d.aWin)" r="4" fill="#10b981" />
        <text
          :x="d.x"
          :y="yPos(d.aWin) - 8"
          text-anchor="middle"
          fill="#10b981"
          font-size="8.5"
          font-weight="600"
        >
          {{ d.aWin.toFixed(1) }}%
        </text>
      </template>
      <template v-for="d in dataPoints" :key="'ptB-' + d.pl">
        <circle :cx="d.x" :cy="yPos(d.bWin)" r="4" fill="#3b82f6" />
        <text
          :x="d.x"
          :y="yPos(d.bWin) + 15"
          text-anchor="middle"
          fill="#3b82f6"
          font-size="8.5"
          font-weight="600"
        >
          {{ d.bWin.toFixed(1) }}%
        </text>
      </template>
      <!-- X axis labels -->
      <text
        v-for="d in dataPoints"
        :key="'xlabel-' + d.pl"
        :x="d.x"
        :y="height - 8"
        text-anchor="middle"
        class="fill-muted-foreground"
        font-size="10"
      >
        {{ d.pl }} pts
      </text>
    </svg>
    <!-- Legend -->
    <div class="flex justify-center gap-6 mt-2 text-sm">
      <div class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-3 rounded-full bg-emerald-500"></span>
        <span class="text-emerald-500 font-medium">{{ factionA }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
        <span class="text-blue-500 font-medium">{{ factionB }}</span>
      </div>
    </div>
  </div>
</template>
