<script setup>
import { ref, onMounted } from 'vue'
import { fetchFactions } from '../composables/useApi'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const factions = ref([])
const loading = ref(true)

onMounted(async () => {
  factions.value = await fetchFactions()
  loading.value = false
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-1">Choose Your Faction</h1>
    <p class="text-muted-foreground mb-6">Select a faction to start building your army roster</p>

    <div v-if="loading" class="text-center py-12 text-muted-foreground">Loading factions...</div>

    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      <router-link
        v-for="faction in factions"
        :key="faction.id"
        :to="{ name: 'roster', params: { factionId: faction.id } }"
        class="no-underline"
      >
        <Card class="h-full transition-all hover:border-primary hover:-translate-y-0.5 cursor-pointer">
          <CardHeader>
            <CardTitle>{{ faction.name }}</CardTitle>
            <CardDescription>{{ faction.unitCount }} units</CardDescription>
          </CardHeader>
        </Card>
      </router-link>
    </div>
  </div>
</template>
