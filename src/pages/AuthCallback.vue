<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-md px-4">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-10">
        <div class="text-center">
          <div v-if="loading" class="space-y-4">
            <div class="w-16 h-16 mx-auto">
              <svg class="animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-50">Authenticating...</h2>
            <p class="text-slate-400">Please wait while we sign you in</p>
          </div>

          <div v-else-if="error" class="space-y-4">
            <div class="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-slate-50">Authentication Failed</h2>
            <p class="text-slate-400">{{ error }}</p>
            <RouterLink
              to="/login"
              class="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all"
            >
              Back to Login
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  const provider = route.params.provider as 'google' | 'github'
  const token = route.query.token as string
  const errorParam = route.query.error as string

  // Check for errors from OAuth provider
  if (errorParam) {
    error.value = `Authentication was cancelled or failed: ${errorParam}`
    loading.value = false
    return
  }

  // Check if we have a token (new flow - backend returns token directly)
  if (token) {
    try {
      // Token is provided directly, save it
      localStorage.setItem('auth_token', token)
      
      // Fetch user data
      await authStore.fetchUser()
      
      // Redirect to profile on success
      router.push('/profile')
      return
    } catch (err: any) {
      error.value = err.message || 'Authentication failed. Please try again.'
      loading.value = false
      return
    }
  }

  // Fallback: check for code (old flow - for backwards compatibility)
  const code = route.query.code as string
  
  if (!code) {
    error.value = 'Authorization token or code not received'
    loading.value = false
    return
  }

  // Validate provider
  if (!provider || !['google', 'github'].includes(provider)) {
    error.value = 'Invalid OAuth provider'
    loading.value = false
    return
  }

  try {
    // Send code to backend for token exchange
    await authStore.handleOAuthCallback(provider, code)
    
    // Redirect to profile on success
    router.push('/profile')
  } catch (err: any) {
    error.value = err.message || 'Authentication failed. Please try again.'
    loading.value = false
  }
})
</script>
