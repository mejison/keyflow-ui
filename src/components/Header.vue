<template>
  <header class="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50 sticky top-0 z-40">
    <div class="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
          KF
        </div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Keyflow
        </h1>
      </RouterLink>
      
      <div class="flex items-center gap-6">
        <RouterLink 
          to="/leaderboard" 
          class="text-slate-400 hover:text-slate-200 transition-colors text-sm font-medium"
        >
          🏆 Leaderboard
        </RouterLink>
        <LanguageSelector />
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
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white">
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
import LanguageSelector from '@/components/LanguageSelector.vue'

const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>
