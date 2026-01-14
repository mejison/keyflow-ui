<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-md px-4">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-50 mb-2">Create Account</h2>
          <p class="text-slate-400">Join us to track your typing progress</p>
        </div>

        <!-- OAuth Buttons -->
        <div class="space-y-3 mb-6">
          <button
            @click="handleOAuthSignup('github')"
            class="w-full py-3 px-4 bg-slate-900/50 hover:bg-slate-900/70 border border-slate-600 rounded-xl font-medium text-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
          
          <button
            @click="handleOAuthSignup('google')"
            class="w-full py-3 px-4 bg-slate-900/50 hover:bg-slate-900/70 border border-slate-600 rounded-xl font-medium text-slate-200 transition-all flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-800/40 text-slate-500">Or sign up with email</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p class="text-red-400 text-sm">{{ error }}</p>
          </div>

          <div>
            <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              minlength="2"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="John Doe"
            />
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
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              :disabled="isLoading"
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
              Password
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
              Confirm Password
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
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-slate-400 text-sm">
            Already have an account?
            <RouterLink to="/login" class="text-blue-400 hover:text-blue-300 font-medium">Sign in</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const router = useRouter()
const authStore = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  
  // Client-side validation
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
    await authStore.signup(name.value, email.value, password.value, passwordConfirmation.value)
    router.push('/profile')
  } catch (err: any) {
    console.error('Signup error:', err)
    
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
        error.value = errorMessages || responseData.message || 'Registration failed'
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
        error.value = responseData.message || err.message || 'Registration failed'
      }
    } else {
      error.value = err.message || 'Registration failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleOAuthSignup = async (provider: 'github' | 'google') => {
  error.value = ''
  try {
    await authStore.loginWithProvider(provider)
    // Redirect happens in the store
  } catch (err: any) {
    console.error('OAuth signup error:', err)
    
    if (err.response?.data) {
      const responseData = err.response.data
      if (responseData.data?.error) {
        error.value = responseData.data.error
      } else if (responseData.message) {
        error.value = responseData.message
      } else if (responseData.error) {
        error.value = responseData.error
      } else {
        error.value = 'OAuth signup failed. Please try again.'
      }
    } else {
      error.value = err.message || 'OAuth signup failed. Please try again.'
    }
  }
}
</script>
