<script setup>
import { ref, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

defineProps({ label: String })

const fileInput = ref(null)
const roster = ref(null)
const dragging = ref(false)

const emit = defineEmits(['loaded', 'cleared'])

const unitCount = computed(() => {
  if (!roster.value) return 0
  return roster.value.units.reduce((sum, u) => sum + (u.count || 1), 0)
})

function triggerBrowse() {
  fileInput.value.click()
}

function handleFile(file) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (!data?.units?.length) {
        alert('Invalid roster file: no units found')
        return
      }
      roster.value = data
      emit('loaded', data)
    } catch {
      alert('Invalid JSON file')
    }
  }
  reader.readAsText(file)
}

function onFileSelected(event) {
  handleFile(event.target.files[0])
  event.target.value = ''
}

function onDrop(event) {
  dragging.value = false
  const file = event.dataTransfer.files[0]
  handleFile(file)
}

function onDragOver() {
  dragging.value = true
}

function onDragLeave() {
  dragging.value = false
}

function clear() {
  roster.value = null
  emit('cleared')
}
</script>

<template>
  <Card>
    <CardHeader class="pb-3">
      <CardTitle class="text-lg">{{ label }}</CardTitle>
    </CardHeader>
    <CardContent>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onFileSelected" />

      <div
        v-if="!roster"
        class="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary/50"
        :class="{ 'border-primary bg-primary/5': dragging }"
        @click="triggerBrowse"
        @drop.prevent="onDrop"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
      >
        <div class="text-muted-foreground space-y-2">
          <div class="text-4xl">&#128193;</div>
          <p class="text-sm font-medium">Drop a roster JSON file here</p>
          <p class="text-xs">or click to browse</p>
        </div>
      </div>

      <div v-else class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-base">{{ roster.faction }}</h3>
            <p class="text-sm text-muted-foreground">
              {{ roster.totalPoints }} pts &middot; {{ unitCount }} units
            </p>
          </div>
          <Button variant="ghost" size="sm" @click="clear">Clear</Button>
        </div>

        <ScrollArea class="max-h-[240px]">
          <div class="space-y-1">
            <div
              v-for="unit in roster.units"
              :key="unit.id"
              class="flex justify-between items-center text-sm p-1.5 rounded bg-background"
            >
              <span class="truncate">
                {{ unit.name }}
                <span v-if="unit.count > 1" class="text-primary font-semibold">x{{ unit.count }}</span>
              </span>
              <Badge variant="secondary" class="ml-2 shrink-0">{{ unit.points * (unit.count || 1) }} pts</Badge>
            </div>
          </div>
        </ScrollArea>
      </div>
    </CardContent>
  </Card>
</template>
