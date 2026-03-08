const API_BASE = 'http://localhost:8080/api'

export async function fetchFactions() {
  const res = await fetch(`${API_BASE}/factions`)
  return res.json()
}

export async function fetchFactionUnits(factionId) {
  const res = await fetch(`${API_BASE}/factions/${factionId}/units`)
  return res.json()
}
