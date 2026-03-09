<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto max-w-[1400px] px-4">
      <header class="border-b-2 border-primary py-4 mb-6">
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-2xl font-bold text-primary uppercase tracking-widest hover:text-primary/80 no-underline">
            Ork is Best - 40K Roster Builder
          </router-link>
          <router-link to="/compare" class="text-sm font-medium text-muted-foreground hover:text-primary no-underline transition-colors">
            Compare
          </router-link>
          <router-link to="/factions/compare" class="text-sm font-medium text-muted-foreground hover:text-primary no-underline transition-colors">
            Faction vs Faction
          </router-link>
        </div>
      </header>
      <main class="pb-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
