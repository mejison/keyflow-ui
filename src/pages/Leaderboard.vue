<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-6xl px-4">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-slate-50 mb-2">🏆 Leaderboard</h1>
        <p class="text-slate-400">Compete with typists around the world</p>
      </div>

      <!-- My Rank Card (if authenticated) -->
      <div v-if="authStore.isAuthenticated && myRank" class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/20 p-6 mb-8">
        <h2 class="text-lg font-bold text-slate-50 mb-4">Your Rankings</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-400">{{ myRank.ranks.wpm || '-' }}</div>
            <div class="text-sm text-slate-400">WPM Rank</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-emerald-400">{{ myRank.ranks.accuracy || '-' }}</div>
            <div class="text-sm text-slate-400">Accuracy Rank</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-400">{{ myRank.ranks.tests || '-' }}</div>
            <div class="text-sm text-slate-400">Tests Rank</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-400">{{ myRank.ranks.combined || '-' }}</div>
            <div class="text-sm text-slate-400">Combined Rank</div>
          </div>
        </div>
      </div>

      <!-- Period Filter -->
      <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <button
          v-for="p in periods"
          :key="p.value"
          @click="period = p.value as typeof period"
          :class="[
            'px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap',
            period === p.value
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          ]"
        >
          {{ p.label }}
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value as typeof activeTab"
          :class="[
            'px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap',
            activeTab === tab.value
              ? 'bg-slate-800 text-slate-50 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- Leaderboard Table -->
      <div class="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/30 overflow-hidden">
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-slate-400">Loading leaderboard...</p>
        </div>

        <div v-else-if="error" class="p-8 text-center">
          <p class="text-red-400">{{ error }}</p>
        </div>

        <div v-else-if="entries.length === 0" class="p-12 text-center">
          <div class="text-6xl mb-4">🏆</div>
          <h3 class="text-xl font-semibold text-slate-300 mb-2">No entries yet</h3>
          <p class="text-slate-400 mb-6">Be the first to complete a test and claim your spot!</p>
          <button @click="$router.push('/')" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all">
            Start Typing Test
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-900/60">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                <th v-if="activeTab === 'wpm'" class="px-6 py-4 text-right text-sm font-semibold text-slate-300">Best WPM</th>
                <th v-if="activeTab === 'accuracy'" class="px-6 py-4 text-right text-sm font-semibold text-slate-300">Avg Accuracy</th>
                <th v-if="activeTab === 'tests'" class="px-6 py-4 text-right text-sm font-semibold text-slate-300">Total Tests</th>
                <th v-if="activeTab === 'combined'" class="px-6 py-4 text-right text-sm font-semibold text-slate-300">Score</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="entry in entries"
                :key="entry.user?.id || entry.rank"
                :class="[
                  'border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors',
                  entry.user?.id === authStore.user?.id ? 'bg-blue-500/5' : ''
                ]"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <span
                      v-if="entry.rank && entry.rank <= 3"
                      class="text-2xl"
                    >
                      {{ entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉' }}
                    </span>
                    <span
                      :class="[
                        'font-bold',
                        entry.rank && entry.rank <= 3 ? 'text-yellow-400' : 'text-slate-400'
                      ]"
                    >
                      #{{ entry.rank || '?' }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                      {{ (entry.user?.name || 'U').substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-medium text-slate-200">
                        {{ entry.user?.name || 'Unknown' }}
                        <span v-if="entry.user?.id === authStore.user?.id" class="text-xs text-blue-400 ml-2">(You)</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td v-if="activeTab === 'wpm'" class="px-6 py-4 text-right">
                  <span class="text-lg font-bold text-blue-400">{{ entry.best_wpm || 0 }}</span>
                  <span class="text-sm text-slate-500 ml-1">WPM</span>
                </td>
                <td v-if="activeTab === 'accuracy'" class="px-6 py-4 text-right">
                  <span class="text-lg font-bold text-emerald-400">{{ Number(entry.avg_accuracy || 0).toFixed(1) }}%</span>
                </td>
                <td v-if="activeTab === 'tests'" class="px-6 py-4 text-right">
                  <span class="text-lg font-bold text-purple-400">{{ entry.total_tests }}</span>
                  <span class="text-sm text-slate-500 ml-1">tests</span>
                </td>
                <td v-if="activeTab === 'combined'" class="px-6 py-4 text-right">
                  <span class="text-lg font-bold text-yellow-400">{{ getScore(entry) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { leaderboardApi } from '@/services/api'
import type { LeaderboardEntry, UserRank } from '@/services/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const authStore = useAuthStore()

const activeTab = ref<'wpm' | 'accuracy' | 'tests' | 'combined'>('wpm')
const period = ref<'today' | 'week' | 'month' | 'year' | 'all'>('all')
const entries = ref<LeaderboardEntry[]>([])
const myRank = ref<UserRank | null>(null)
const loading = ref(false)
const error = ref('')

const tabs = [
  { value: 'wpm', label: 'Best WPM', icon: '⚡' },
  { value: 'accuracy', label: 'Accuracy', icon: '🎯' },
  { value: 'tests', label: 'Most Active', icon: '🔥' },
  { value: 'combined', label: 'Combined', icon: '👑' },
]

const periods = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
]

const loadLeaderboard = async () => {
  try {
    loading.value = true
    error.value = ''
    
    let response
    switch (activeTab.value) {
      case 'wpm':
        response = await leaderboardApi.getTopByWpm(period.value, 50)
        break
      case 'accuracy':
        response = await leaderboardApi.getTopByAccuracy(period.value, 50, 5)
        break
      case 'tests':
        response = await leaderboardApi.getTopByTests(period.value, 50)
        break
      case 'combined':
        response = await leaderboardApi.getTopByCombined(period.value, 50, 5)
        break
    }
    
    console.log('Leaderboard API response:', response)
    console.log('Leaderboard data:', response.data)
    entries.value = response.data.data?.leaderboard || response.data.leaderboard || []
  } catch (err: any) {
    console.error('Failed to load leaderboard:', err)
    error.value = 'Failed to load leaderboard'
  } finally {
    loading.value = false
  }
}

const getScore = (entry: LeaderboardEntry): string => {
  switch (activeTab.value) {
    case 'wpm':
      return (entry.best_wpm || 0).toFixed(0)
    case 'accuracy':
      return (entry.avg_accuracy || 0).toFixed(1) + '%'
    case 'tests':
      return (entry.total_tests || 0).toString()
    case 'combined':
      // Calculate combined score: (best_wpm * accuracy/100)
      const score = entry.combined_score || ((entry.best_wpm || 0) * (entry.avg_accuracy || 0) / 100)
      return score.toFixed(0)
    default:
      return '0'
  }
}

const loadMyRank = async () => {
  const token = localStorage.getItem('auth_token')
  if (!token) return
  
  try {
    const response = await leaderboardApi.getMyRank(period.value)
    myRank.value = response.data
    console.log('My Rank loaded:', myRank.value)
  } catch (err: any) {
    console.error('Failed to load rank:', err)
  }
}

// Watch for changes
watch([activeTab, period], () => {
  loadLeaderboard()
  loadMyRank()
})

onMounted(async () => {
  loadLeaderboard()
  
  // Wait a bit for auth to be ready
  await new Promise(resolve => setTimeout(resolve, 100))
  loadMyRank()
})
</script>
