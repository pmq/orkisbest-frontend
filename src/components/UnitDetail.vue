<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const props = defineProps({ unit: Object })
const emit = defineEmits(['close', 'add'])
</script>

<template>
  <Dialog :open="!!unit" @update:open="val => { if (!val) emit('close') }">
    <DialogContent class="!bg-white !text-slate-900 !border !border-slate-200 max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <DialogHeader>
        <div class="flex justify-between items-start">
          <DialogTitle class="text-xl">{{ unit.name }}</DialogTitle>
          <span class="text-xl font-bold text-primary">{{ unit.points }} pts</span>
        </div>
        <DialogDescription>Unit datasheet</DialogDescription>
      </DialogHeader>

      <div class="flex flex-wrap gap-2 my-2" v-if="unit.stats">
        <div v-for="(value, label) in {
          'M': unit.stats.movement,
          'T': unit.stats.toughness,
          'SV': unit.stats.save,
          'W': unit.stats.wounds,
          'LD': unit.stats.leadership,
          'OC': unit.stats.objectiveControl,
        }" :key="label" class="flex flex-col items-center bg-muted rounded-md px-3 py-1.5 min-w-[50px]">
          <span class="text-[0.65rem] text-muted-foreground uppercase">{{ label }}</span>
          <span class="text-lg font-bold font-mono">{{ value }}</span>
        </div>
      </div>

      <section v-if="unit.rangedWeapons?.length">
        <h3 class="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Ranged Weapons</h3>
        <div class="overflow-x-auto rounded-md border">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-muted">
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">Weapon</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">Range</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">A</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">BS</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">S</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">AP</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">D</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">Keywords</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in unit.rangedWeapons" :key="w.name" class="border-t">
                <td class="p-2">{{ w.name }}</td>
                <td class="p-2">{{ w.range }}</td>
                <td class="p-2">{{ w.attacks }}</td>
                <td class="p-2">{{ w.skill }}</td>
                <td class="p-2">{{ w.strength }}</td>
                <td class="p-2">{{ w.ap }}</td>
                <td class="p-2">{{ w.damage }}</td>
                <td class="p-2 text-xs text-muted-foreground max-w-[150px]">{{ w.keywords }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="unit.meleeWeapons?.length" class="mt-4">
        <h3 class="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Melee Weapons</h3>
        <div class="overflow-x-auto rounded-md border">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-muted">
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">Weapon</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">Range</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">A</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">WS</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">S</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">AP</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">D</th>
                <th class="text-left p-2 text-xs text-muted-foreground font-semibold uppercase">Keywords</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="w in unit.meleeWeapons" :key="w.name" class="border-t">
                <td class="p-2">{{ w.name }}</td>
                <td class="p-2">{{ w.range }}</td>
                <td class="p-2">{{ w.attacks }}</td>
                <td class="p-2">{{ w.skill }}</td>
                <td class="p-2">{{ w.strength }}</td>
                <td class="p-2">{{ w.ap }}</td>
                <td class="p-2">{{ w.damage }}</td>
                <td class="p-2 text-xs text-muted-foreground max-w-[150px]">{{ w.keywords }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="unit.abilities?.length" class="mt-4">
        <h3 class="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Abilities</h3>
        <div v-for="a in unit.abilities" :key="a.name" class="text-sm mb-1.5 leading-relaxed">
          <strong class="text-primary">{{ a.name }}:</strong> {{ a.description }}
        </div>
      </section>

      <div v-if="unit.keywords?.length" class="mt-4">
        <h3 class="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Keywords</h3>
        <div class="flex flex-wrap gap-1.5">
          <Badge variant="secondary" v-for="kw in unit.keywords" :key="kw">{{ kw }}</Badge>
          <Badge v-if="unit.factionKeyword" variant="default">{{ unit.factionKeyword }}</Badge>
        </div>
      </div>

      <DialogFooter class="mt-4">
        <Button class="w-full" @click="emit('add')">+ Add to Roster</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
