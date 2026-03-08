<template>
  <div id="app">
    <header>
      <router-link to="/" class="logo">Ork is Best - 40K Roster Builder</router-link>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
:root {
  --bg-dark: #1a1a2e;
  --bg-card: #16213e;
  --bg-hover: #0f3460;
  --accent: #e94560;
  --accent-light: #ff6b6b;
  --text: #eee;
  --text-muted: #aaa;
  --border: #333;
  --success: #4caf50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-dark);
  color: var(--text);
  min-height: 100vh;
}

#app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

header {
  padding: 1rem 0;
  border-bottom: 2px solid var(--accent);
  margin-bottom: 1.5rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.logo:hover {
  color: var(--accent-light);
}

main {
  padding-bottom: 2rem;
}
</style>
