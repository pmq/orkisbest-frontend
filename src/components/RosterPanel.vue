<script setup>
import { ref } from 'vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const fileInput = ref(null)
const emit = defineEmits(['remove', 'clear', 'show-detail', 'save', 'import'])

function triggerImport() {
  fileInput.value.click()
}

function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      emit('import', data)
    } catch {
      alert('Invalid JSON file')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

defineProps({
  roster: Array,
  totalPoints: Number,
  pointsLimit: Number,
})
</script>

<template>
  <Card class="sticky top-4">
    <CardHeader class="pb-3">
      <div class="flex justify-between items-center">
        <CardTitle class="text-lg">Army Roster</CardTitle>
        <Button v-if="roster.length" variant="ghost" size="sm" @click="$emit('clear')">Clear</Button>
      </div>
    </CardHeader>
    <CardContent>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onFileSelected" />
      <div v-if="!roster.length" class="text-muted-foreground text-center py-8 text-sm space-y-3">
        <p>Add units from the left panel to build your roster.</p>
        <Button variant="outline" size="sm" @click="triggerImport">Import from JSON</Button>
      </div>

      <ScrollArea v-else class="max-h-[calc(100vh-16rem)]">
        <div class="space-y-1">
          <div
            v-for="entry in roster"
            :key="entry.unit.id"
            class="flex items-center gap-2 p-2 rounded-md bg-background hover:bg-accent cursor-pointer transition-colors"
            @click="$emit('show-detail', entry.unit)"
          >
            <div class="flex-1 flex justify-between items-center min-w-0">
              <span class="text-sm truncate">
                {{ entry.unit.name }}
                <span v-if="entry.count > 1" class="text-primary font-semibold">x{{ entry.count }}</span>
              </span>
              <span class="text-xs text-muted-foreground whitespace-nowrap ml-2">{{ entry.unit.points * entry.count }} pts</span>
            </div>
            <Button variant="outline" size="icon" class="h-6 w-6 shrink-0" @click.stop="$emit('remove', entry.unit.id)">-</Button>
          </div>
        </div>
      </ScrollArea>
    </CardContent>
    <CardFooter v-if="roster.length" class="flex-col items-stretch pt-0">
      <Separator class="mb-3" />
      <div class="flex justify-between text-base font-bold">
        <span>Total</span>
        <span :class="{ 'text-destructive': totalPoints > pointsLimit }">
          {{ totalPoints }} / {{ pointsLimit }} pts
        </span>
      </div>
      <div class="text-xs text-muted-foreground mt-1">
        {{ roster.reduce((s, e) => s + e.count, 0) }} models/units
      </div>
      <div class="flex gap-2 mt-3">
        <Button variant="outline" class="flex-1" @click="triggerImport">Import</Button>
        <Button variant="outline" class="flex-1" @click="$emit('save')">Save as JSON</Button>
      </div>
    </CardFooter>
  </Card>
</template>
