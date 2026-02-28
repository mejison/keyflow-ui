<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import ToastContainer from '@/components/ToastContainer.vue'
import { startSessionMonitoring, stopSessionMonitoring } from '@/utils/session'
import { initAnalytics, trackPageView } from '@/utils/analytics'

const authStore = useAuthStore()
const router = useRouter()
const settingsStore = useSettingsStore()

const handleGlobalKeyDown = (event: KeyboardEvent) => {
  // Alt+C - Toggle Cinema Mode
  if (event.altKey && (event.key === 'c' || event.key === 'с')) { // Latin 'c' or Cyrillic 'с'
    event.preventDefault()
    settingsStore.updateSetting('cinemaMode', !settingsStore.settings.cinemaMode)
    // Toast is handled in the components or we can add it here if needed, 
    // but settingsStore doesn't trigger toast by itself usually.
    // Let's rely on the UI feedback or add toast here if we imported it.
  }

  // Esc - Exit Cinema Mode
  if (event.key === 'Escape' && settingsStore.settings.cinemaMode) {
    event.preventDefault()
    settingsStore.updateSetting('cinemaMode', false)
  }
}

// Auto-restore session on app load
onMounted(async () => {
  // Initialize Google Analytics
  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (gaId) {
    initAnalytics(gaId)
  }

  const token = localStorage.getItem('auth_token')
  if (token && !authStore.user) {
    try {
      await authStore.fetchUser()
      // Start monitoring session validity
      startSessionMonitoring()
    } catch (error) {
      // Token invalid, clear it
      localStorage.removeItem('auth_token')
    }
  } else if (token && authStore.user) {
    // Already authenticated, start monitoring
    startSessionMonitoring()
  }

  window.addEventListener('keydown', handleGlobalKeyDown)
})

// Track page views on route change
watch(() => router.currentRoute.value, (route) => {
  trackPageView(route.path, route.meta.title as string)
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  stopSessionMonitoring()
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>
