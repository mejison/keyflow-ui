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
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 animate-pulse">
            <div class="h-4 bg-slate-700 rounded w-20 mb-2"></div>
            <div class="h-10 bg-slate-700 rounded w-16"></div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 animate-pulse">
            <div class="h-4 bg-slate-700 rounded w-20 mb-2"></div>
            <div class="h-10 bg-slate-700 rounded w-16"></div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-slate-700/30 animate-pulse">
            <div class="h-4 bg-slate-700 rounded w-20 mb-2"></div>
            <div class="h-10 bg-slate-700 rounded w-16"></div>
          </div>
        </div>

        <div v-else-if="statistics" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-blue-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Best WPM</div>
            <div class="text-4xl font-bold text-blue-400">{{ statistics.best_wpm || 0 }}</div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-emerald-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Avg Accuracy</div>
            <div class="text-4xl font-bold text-emerald-400">{{ statistics.avg_accuracy || 0 }}%</div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-purple-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Tests Taken</div>
            <div class="text-4xl font-bold text-purple-400">{{ statistics.tests_taken || 0 }}</div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-blue-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Best WPM</div>
            <div class="text-4xl font-bold text-blue-400">0</div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-emerald-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Avg Accuracy</div>
            <div class="text-4xl font-bold text-emerald-400">0%</div>
          </div>
          <div class="bg-slate-900/40 rounded-2xl p-6 border border-purple-500/10">
            <div class="text-slate-400 text-sm mb-2 uppercase tracking-wide font-medium">Tests Taken</div>
            <div class="text-4xl font-bold text-purple-400">0</div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div>
          <h2 class="text-xl font-bold text-slate-50 mb-4">Recent Activity</h2>
          
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 animate-pulse">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-slate-700 rounded-lg"></div>
                  <div>
                    <div class="h-4 bg-slate-700 rounded w-32 mb-2"></div>
                    <div class="h-3 bg-slate-700 rounded w-20"></div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="h-4 bg-slate-700 rounded w-16 mb-2"></div>
                  <div class="h-3 bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="recentActivity.length > 0" class="space-y-3">
            <div v-for="activity in recentActivity" :key="activity.id" class="bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-slate-200 font-medium">Completed test</p>
                  <p class="text-slate-500 text-sm">{{ formatDate(activity.completed_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-slate-200 font-bold">{{ activity.wpm }} WPM</p>
                <p class="text-emerald-400 text-sm">{{ Number(activity.accuracy).toFixed(1) }}% accuracy</p>
              </div>
            </div>
          </div>

          <div v-else class="bg-slate-900/40 rounded-xl p-8 border border-slate-700/30 text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-lg font-semibold text-slate-300 mb-2">No tests yet</h3>
            <p class="text-slate-500 mb-4">Start typing to see your progress here</p>
            <button @click="router.push('/')" class="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all">
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { typingTestsApi } from '@/services/api'
import type { TypingStatistics, RecentActivity } from '@/services/api'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const statistics = ref<TypingStatistics | null>(null)
const recentActivity = ref<RecentActivity[]>([])
const loading = ref(true)
const error = ref('')

const initials = computed(() => {
  const name = authStore.user?.name || 'U'
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

// Format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date:', dateString)
    return 'Unknown'
  }
  
  const diff = now.getTime() - date.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 7) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (seconds > 30) return `${seconds} seconds ago`
  return 'Just now'
}

// Load user data and statistics on mount
onMounted(async () => {
  // Check if we have a token but no user data
  const token = localStorage.getItem('auth_token')
  if (token && !authStore.user) {
    await authStore.fetchUser()
  }
  
  // Redirect if not authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Load typing statistics
  try {
    loading.value = true
    
    // Fetch statistics and recent activity in parallel
    const [statsResponse, activityResponse] = await Promise.all([
      typingTestsApi.getStatistics(),
      typingTestsApi.getRecentActivity(5)
    ])
    
    console.log('Stats Response:', statsResponse)
    console.log('Activity Response:', activityResponse)
    
    statistics.value = statsResponse.data.data || statsResponse.data
    recentActivity.value = activityResponse.data.data || activityResponse.data
  } catch (err: any) {
    console.error('Failed to load statistics:', err)
    error.value = 'Failed to load statistics'
  } finally {
    loading.value = false
  }
})
</script>
