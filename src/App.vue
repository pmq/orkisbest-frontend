<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="mx-auto max-w-[1400px] px-4">
      <header class="border-b-2 border-primary py-4 mb-6">
        <router-link to="/" class="text-2xl font-bold text-primary uppercase tracking-widest hover:text-primary/80 no-underline">
          Ork is Best - 40K Roster Builder
        </router-link>
      </header>
      <main class="pb-8">
        <router-view />
      </main>
    </div>
  </div>
</template>
