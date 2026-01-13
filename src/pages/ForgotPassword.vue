<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-md px-4">
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-50 mb-2">Reset Password</h2>
          <p class="text-slate-400">Enter your email to receive a reset link</p>
        </div>

        <form v-if="!submitted" @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Send Reset Link
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

const handleSubmit = () => {
  authStore.requestPasswordReset(email.value)
  submitted.value = true
}
</script>
