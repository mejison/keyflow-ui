<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ToastContainer from '@/components/ToastContainer.vue'
import { startSessionMonitoring, stopSessionMonitoring } from '@/utils/session'
import { initAnalytics, trackPageView } from '@/utils/analytics'

const authStore = useAuthStore()
const router = useRouter()

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
})

// Track page views on route change
watch(() => router.currentRoute.value, (route) => {
  trackPageView(route.path, route.meta.title as string)
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  stopSessionMonitoring()
})
</script>
