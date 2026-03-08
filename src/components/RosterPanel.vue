<script setup>
defineProps({
  roster: Array,
  totalPoints: Number,
  pointsLimit: Number,
})
defineEmits(['remove', 'clear', 'show-detail'])
</script>

<template>
  <aside class="roster-panel">
    <div class="roster-header">
      <h2>Army Roster</h2>
      <button v-if="roster.length" class="clear-btn" @click="$emit('clear')">Clear</button>
    </div>

    <div v-if="!roster.length" class="empty">
      Add units from the left panel to build your roster.
    </div>

    <div v-else class="roster-list">
      <div
        v-for="entry in roster"
        :key="entry.unit.id"
        class="roster-entry"
        @click="$emit('show-detail', entry.unit)"
      >
        <div class="entry-info">
          <span class="entry-name">
            {{ entry.unit.name }}
            <span v-if="entry.count > 1" class="count">x{{ entry.count }}</span>
          </span>
          <span class="entry-pts">{{ entry.unit.points * entry.count }} pts</span>
        </div>
        <button class="remove-btn" @click.stop="$emit('remove', entry.unit.id)">-</button>
      </div>
    </div>

    <div class="roster-footer" v-if="roster.length">
      <div class="total-line">
        <strong>Total</strong>
        <strong :class="{ over: totalPoints > pointsLimit }">
          {{ totalPoints }} / {{ pointsLimit }} pts
        </strong>
      </div>
      <div class="unit-count">{{ roster.reduce((s, e) => s + e.count, 0) }} models/units</div>
    </div>
  </aside>
</template>

<style scoped>
.roster-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  position: sticky;
  top: 1rem;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
}

.roster-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.roster-header h2 {
  font-size: 1.1rem;
}

.clear-btn {
  background: transparent;
  border: 1px solid var(--text-muted);
  color: var(--text-muted);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
}

.clear-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem 0.5rem;
  font-size: 0.9rem;
}

.roster-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.roster-entry {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: var(--bg-dark);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}

.roster-entry:hover {
  background: var(--bg-hover);
}

.entry-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.entry-name {
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count {
  color: var(--accent);
  font-weight: 600;
}

.entry-pts {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  margin-left: 0.5rem;
}

.remove-btn {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: var(--accent);
  color: #fff;
}

.roster-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
}

.total-line {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
}

.over {
  color: var(--accent);
}

.unit-count {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}
</style>
