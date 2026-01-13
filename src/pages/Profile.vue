<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-4xl px-4">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-10">
        <!-- Header -->
        <div class="flex items-start justify-between mb-8">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-blue-500/20">
              {{ initials }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-slate-50 mb-1">{{ authStore.user?.name }}</h1>
              <p class="text-slate-400">{{ authStore.user?.email }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  {{ authStore.user?.provider?.toUpperCase() }}
                </span>
              </div>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded-lg transition-all text-sm font-medium"
          >
            Logout
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-blue-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Best WPM</div>
            <div class="text-4xl font-bold text-blue-400">78</div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-emerald-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Avg Accuracy</div>
            <div class="text-4xl font-bold text-emerald-400">95%</div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-purple-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Tests Taken</div>
            <div class="text-4xl font-bold text-purple-400">42</div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h2 class="text-xl font-bold text-slate-50 mb-4">Recent Activity</h2>
          <div class="space-y-3">
            <div class="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-200 font-medium">Completed test</p>
                  <p class="text-slate-500 text-sm">2 hours ago</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-slate-200 font-bold">75 WPM</p>
                <p class="text-emerald-400 text-sm">94% accuracy</p>
              </div>
            </div>

            <div class="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-200 font-medium">Completed test</p>
                  <p class="text-slate-500 text-sm">5 hours ago</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-slate-200 font-bold">68 WPM</p>
                <p class="text-emerald-400 text-sm">91% accuracy</p>
              </div>
            </div>

            <div class="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-200 font-medium">Completed test</p>
                  <p class="text-slate-500 text-sm">1 day ago</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-slate-200 font-bold">82 WPM</p>
                <p class="text-emerald-400 text-sm">97% accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const initials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

// Redirect if not authenticated
if (!authStore.isAuthenticated) {
  router.push('/login')
}
</script>
