<script setup>
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

defineProps({ unit: Object })
defineEmits(['add'])
</script>

<template>
  <Card class="cursor-pointer transition-all hover:border-primary" @click="$emit('click')">
    <CardHeader class="p-3 pb-0">
      <div class="flex justify-between items-start">
        <CardTitle class="text-sm leading-tight">{{ unit.name }}</CardTitle>
        <span class="text-sm font-bold text-primary whitespace-nowrap ml-2">{{ unit.points }} pts</span>
      </div>
    </CardHeader>
    <CardContent class="p-3 pt-2 space-y-2">
      <div v-if="unit.stats" class="flex flex-wrap gap-1">
        <Badge variant="secondary" class="font-mono text-xs" v-for="(value, label) in {
          M: unit.stats.movement,
          T: unit.stats.toughness,
          SV: unit.stats.save,
          W: unit.stats.wounds,
          LD: unit.stats.leadership,
          OC: unit.stats.objectiveControl,
        }" :key="label">{{ label }} {{ value }}</Badge>
      </div>
      <div v-if="unit.keywords?.length" class="flex flex-wrap gap-1">
        <Badge variant="outline" class="text-xs" v-for="kw in unit.keywords" :key="kw">{{ kw }}</Badge>
      </div>
    </CardContent>
    <CardFooter class="p-3 pt-0">
      <Button variant="outline" size="sm" class="w-full" @click.stop="$emit('add')">+ Add</Button>
    </CardFooter>
  </Card>
</template>
