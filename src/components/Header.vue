<template>
  <header class="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-40">
    <div class="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="hover:opacity-80 transition-opacity flex items-center gap-2">
        <h1 
          class="text-3xl font-bold bg-clip-text text-transparent"
          style="background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary))"
        >
          Keyflow
        </h1>
        <span class="text-xs font-semibold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
          BETA
        </span>
      </RouterLink>
      
      <div class="flex items-center gap-4">
        <RouterLink 
          to="/leaderboard" 
          class="text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          🏆 Leaderboard
        </RouterLink>
        <RouterLink 
          to="/settings" 
          class="text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          ⚙️ Settings
        </RouterLink>
        <RouterLink 
          v-if="!authStore.isAuthenticated"
          to="/login" 
          class="text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          Sign In
        </RouterLink>
        <RouterLink 
          v-else
          to="/profile" 
          class="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          <div 
            class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style="background-image: linear-gradient(to bottom right, var(--color-primary), var(--color-secondary))"
          >
            {{ userInitials }}
          </div>
          Profile
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>
