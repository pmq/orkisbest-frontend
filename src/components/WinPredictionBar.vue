<script setup>
defineProps({
  armyAWinPct: Number,
  armyBWinPct: Number,
  factionA: String,
  factionB: String,
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex justify-between text-sm font-medium">
      <span>{{ factionA }}</span>
      <span>{{ factionB }}</span>
    </div>
    <div class="flex h-10 rounded-lg overflow-hidden">
      <div
        class="bg-emerald-600 flex items-center justify-center text-sm font-bold text-white transition-all duration-500"
        :style="{ width: armyAWinPct + '%' }"
      >
        {{ armyAWinPct.toFixed(1) }}%
      </div>
      <div
        class="bg-blue-600 flex items-center justify-center text-sm font-bold text-white transition-all duration-500"
        :style="{ width: armyBWinPct + '%' }"
      >
        {{ armyBWinPct.toFixed(1) }}%
      </div>
    </div>
    <div class="flex justify-between text-xs text-muted-foreground">
      <span>Win Probability</span>
      <span>Win Probability</span>
    </div>
  </div>
</template>
