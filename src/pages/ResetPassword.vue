<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-md px-4">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-50 mb-2">Set New Password</h2>
          <p class="text-slate-400">Enter your new password below</p>
        </div>

        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="8"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
            <p class="text-slate-500 text-xs mt-1">At least 8 characters</p>
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-slate-300 mb-2">
              Confirm New Password
            </label>
            <input
              id="password_confirmation"
              v-model="passwordConfirmation"
              type="password"
              required
              minlength="8"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Reset Password</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting...
            </span>
          </button>
        </form>

        <div v-else class="text-center py-6">
          <div class="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-100 mb-2">Password Reset Successful</h3>
          <p class="text-slate-400 mb-6">
            Your password has been successfully reset.
          </p>
          <RouterLink
            to="/login"
            class="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium transition-all"
          >
            Sign In
          </RouterLink>
        </div>

        <div class="mt-6 text-center">
          <RouterLink to="/login" class="text-slate-400 hover:text-slate-300 text-sm inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to login
          </RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const route = useRoute()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const success = ref(false)
const error = ref('')
const isLoading = ref(false)

// Get token from URL query params
const token = ref(route.query.token as string || '')

onMounted(() => {
  // Get email from URL if provided
  if (route.query.email) {
    email.value = route.query.email as string
  }

  // Validate token exists
  if (!token.value) {
    error.value = 'Reset token is missing. Please request a new reset link.'
  }
})

const handleSubmit = async () => {
  error.value = ''
  
  // Client-side validation
  if (!token.value) {
    error.value = 'Reset token is missing'
    return
  }

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return
  }
  
  isLoading.value = true
  
  try {
    await authStore.resetPassword(token.value, email.value, password.value, passwordConfirmation.value)
    success.value = true
  } catch (err: any) {
    console.error('Reset password error:', err)
    
    // Display detailed error from backend
    if (err.response?.data) {
      const responseData = err.response.data
      
      // Check for errors in data.data (Laravel validation structure)
      if (responseData.data && typeof responseData.data === 'object') {
        const errorMessages = Object.entries(responseData.data)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return messages.join(', ')
            }
            return String(messages)
          })
          .join('; ')
        error.value = errorMessages || responseData.message || 'Password reset failed'
      }
      // Check for Laravel validation errors in data.errors
      else if (responseData.errors) {
        const errorMessages = Object.entries(responseData.errors)
          .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
          .join('; ')
        error.value = errorMessages || responseData.message
      }
      // Just message
      else {
        error.value = responseData.message || err.message || 'Password reset failed'
      }
    } else {
      error.value = err.message || 'Password reset failed. Please try again or request a new reset link.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
