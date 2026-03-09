<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  valueA: Number,
  valueB: Number,
})

const total = computed(() => props.valueA + props.valueB || 1)
const pctA = computed(() => (props.valueA / total.value) * 100)
const pctB = computed(() => (props.valueB / total.value) * 100)
</script>

<template>
  <div class="space-y-1">
    <div class="flex justify-between text-sm">
      <span class="font-mono text-emerald-400">{{ valueA }}</span>
      <span class="text-muted-foreground font-medium text-xs uppercase tracking-wide">{{ label }}</span>
      <span class="font-mono text-blue-400">{{ valueB }}</span>
    </div>
    <div class="flex h-2.5 rounded-full overflow-hidden bg-muted">
      <div
        class="bg-emerald-600 transition-all duration-500"
        :style="{ width: pctA + '%' }"
      />
      <div
        class="bg-blue-600 transition-all duration-500"
        :style="{ width: pctB + '%' }"
      />
    </div>
  </div>
</template>
