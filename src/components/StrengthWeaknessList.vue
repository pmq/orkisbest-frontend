<script setup>
import { Badge } from '@/components/ui/badge'

defineProps({
  strengths: Object,
  factionA: String,
  factionB: String,
})
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <h4 class="text-sm font-semibold mb-2 text-emerald-400">{{ factionA }} Strengths</h4>
      <div class="flex flex-wrap gap-1.5">
        <Badge
          v-for="(s, i) in strengths.a"
          :key="'a-' + i"
          class="bg-emerald-600/20 text-emerald-400 border-emerald-600/30"
        >
          {{ s }}
        </Badge>
      </div>
    </div>
    <div>
      <h4 class="text-sm font-semibold mb-2 text-blue-400">{{ factionB }} Strengths</h4>
      <div class="flex flex-wrap gap-1.5">
        <Badge
          v-for="(s, i) in strengths.b"
          :key="'b-' + i"
          class="bg-blue-600/20 text-blue-400 border-blue-600/30"
        >
          {{ s }}
        </Badge>
      </div>
    </div>
  </div>
</template>
