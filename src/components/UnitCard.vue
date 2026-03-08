<script setup>
defineProps({ unit: Object })
defineEmits(['add'])
</script>

<template>
  <div class="unit-card" @click="$emit('click')">
    <div class="card-header">
      <h3>{{ unit.name }}</h3>
      <span class="pts">{{ unit.points }} pts</span>
    </div>
    <div class="stats-row" v-if="unit.stats">
      <span title="Movement">M {{ unit.stats.movement }}</span>
      <span title="Toughness">T {{ unit.stats.toughness }}</span>
      <span title="Save">SV {{ unit.stats.save }}</span>
      <span title="Wounds">W {{ unit.stats.wounds }}</span>
      <span title="Leadership">LD {{ unit.stats.leadership }}</span>
      <span title="Objective Control">OC {{ unit.stats.objectiveControl }}</span>
    </div>
    <div class="keywords" v-if="unit.keywords?.length">
      <span v-for="kw in unit.keywords" :key="kw" class="keyword">{{ kw }}</span>
    </div>
    <button class="add-btn" @click.stop="$emit('add')">+ Add</button>
  </div>
</template>

<style scoped>
.unit-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
}

.unit-card:hover {
  border-color: var(--accent);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.card-header h3 {
  font-size: 0.95rem;
  line-height: 1.2;
}

.pts {
  font-weight: 700;
  color: var(--accent);
  white-space: nowrap;
  margin-left: 0.5rem;
  font-size: 0.85rem;
}

.stats-row {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.stats-row span {
  background: var(--bg-dark);
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-family: monospace;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.keyword {
  background: var(--bg-hover);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.add-btn {
  width: 100%;
  padding: 0.35rem;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.15s;
}

.add-btn:hover {
  background: var(--accent);
  color: #fff;
}
</style>
