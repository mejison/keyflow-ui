<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-md px-4">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-50 mb-2">Reset Password</h2>
          <p class="text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-6">
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

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isLoading">Send Reset Link</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          </button>
        </form>

        <div v-else class="text-center py-6">
          <div class="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-slate-100 mb-2">Check Your Email</h3>
          <p class="text-slate-400 mb-6">
            We've sent a password reset link to<br />
            <span class="text-slate-300 font-medium">{{ email }}</span>
          </p>
          <p class="text-slate-500 text-sm">
            Didn't receive the email? Check your spam folder or
            <button @click="submitted = false" class="text-blue-400 hover:text-blue-300">try again</button>
          </p>
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
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const authStore = useAuthStore()
const email = ref('')
const submitted = ref(false)
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    await authStore.requestPasswordReset(email.value)
    submitted.value = true
  } catch (err: any) {
    console.error('Forgot password error:', err)
    
    // Display detailed error from backend
    if (err.response?.data) {
      const responseData = err.response.data
      
      // Check for errors in data.data (Laravel validation structure)
      if (responseData.data && typeof responseData.data === 'object') {
        const errorMessages = Object.entries(responseData.data)
          .map(([_field, messages]) => {
            if (Array.isArray(messages)) {
              return messages.join(', ')
            }
            return String(messages)
          })
          .join('; ')
        error.value = errorMessages || responseData.message || 'Failed to send reset link'
      }
      // Check for Laravel validation errors in data.errors
      else if (responseData.errors) {
        const firstError = Object.values(responseData.errors)[0] as string[]
        error.value = firstError ? firstError[0] : responseData.message
      }
      // Just message
      else {
        error.value = responseData.message || err.message || 'Failed to send reset link'
      }
    } else {
      error.value = err.message || 'Failed to send reset link. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>
