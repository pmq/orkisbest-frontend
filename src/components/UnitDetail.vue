<script setup>
defineProps({ unit: Object })
defineEmits(['close', 'add'])
</script>

<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="detail-panel">
      <div class="detail-header">
        <h2>{{ unit.name }}</h2>
        <div class="header-right">
          <span class="pts">{{ unit.points }} pts</span>
          <button class="close-btn" @click="$emit('close')">&times;</button>
        </div>
      </div>

      <div class="stats-table" v-if="unit.stats">
        <div class="stat" v-for="(value, label) in {
          'M': unit.stats.movement,
          'T': unit.stats.toughness,
          'SV': unit.stats.save,
          'W': unit.stats.wounds,
          'LD': unit.stats.leadership,
          'OC': unit.stats.objectiveControl,
        }" :key="label">
          <span class="stat-label">{{ label }}</span>
          <span class="stat-value">{{ value }}</span>
        </div>
      </div>

      <section v-if="unit.rangedWeapons?.length">
        <h3>Ranged Weapons</h3>
        <table>
          <thead>
            <tr><th>Weapon</th><th>Range</th><th>A</th><th>BS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr>
          </thead>
          <tbody>
            <tr v-for="w in unit.rangedWeapons" :key="w.name">
              <td>{{ w.name }}</td><td>{{ w.range }}</td><td>{{ w.attacks }}</td>
              <td>{{ w.skill }}</td><td>{{ w.strength }}</td><td>{{ w.ap }}</td>
              <td>{{ w.damage }}</td><td class="kw-cell">{{ w.keywords }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="unit.meleeWeapons?.length">
        <h3>Melee Weapons</h3>
        <table>
          <thead>
            <tr><th>Weapon</th><th>Range</th><th>A</th><th>WS</th><th>S</th><th>AP</th><th>D</th><th>Keywords</th></tr>
          </thead>
          <tbody>
            <tr v-for="w in unit.meleeWeapons" :key="w.name">
              <td>{{ w.name }}</td><td>{{ w.range }}</td><td>{{ w.attacks }}</td>
              <td>{{ w.skill }}</td><td>{{ w.strength }}</td><td>{{ w.ap }}</td>
              <td>{{ w.damage }}</td><td class="kw-cell">{{ w.keywords }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="unit.abilities?.length">
        <h3>Abilities</h3>
        <div v-for="a in unit.abilities" :key="a.name" class="ability">
          <strong>{{ a.name }}:</strong> {{ a.description }}
        </div>
      </section>

      <div class="keywords-section" v-if="unit.keywords?.length">
        <h3>Keywords</h3>
        <div class="keyword-list">
          <span v-for="kw in unit.keywords" :key="kw" class="keyword">{{ kw }}</span>
          <span v-if="unit.factionKeyword" class="keyword faction-kw">{{ unit.factionKeyword }}</span>
        </div>
      </div>

      <button class="add-btn" @click="$emit('add')">+ Add to Roster</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  z-index: 100;
  overflow-y: auto;
}

.detail-panel {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.5rem;
  max-width: 800px;
  width: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.detail-header h2 {
  font-size: 1.3rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.pts {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: var(--text);
}

.stats-table {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-dark);
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  min-width: 50px;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  font-family: monospace;
}

section {
  margin-bottom: 1rem;
}

section h3 {
  font-size: 0.9rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

th {
  text-align: left;
  padding: 0.3rem 0.5rem;
  background: var(--bg-dark);
  color: var(--text-muted);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
}

td {
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid var(--border);
}

.kw-cell {
  font-size: 0.75rem;
  color: var(--text-muted);
  max-width: 150px;
}

.ability {
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
  line-height: 1.4;
}

.ability strong {
  color: var(--accent-light);
}

.keywords-section h3 {
  margin-bottom: 0.4rem;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.keyword {
  background: var(--bg-hover);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.faction-kw {
  background: var(--accent);
  color: #fff;
}

.add-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.6rem;
  background: var(--accent);
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.15s;
}

.add-btn:hover {
  background: var(--accent-light);
}
</style>
