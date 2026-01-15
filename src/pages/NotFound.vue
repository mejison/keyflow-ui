<template>
  <DefaultLayout>
    <div class="container mx-auto px-4 flex items-center justify-center min-h-[60vh]">
      <div class="text-center max-w-md">
        <!-- 404 Icon -->
        <div class="mb-6">
          <svg class="w-24 h-24 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- 404 Text -->
        <h1 class="text-6xl font-bold text-slate-100 mb-3">404</h1>
        <h2 class="text-2xl font-semibold text-slate-300 mb-4">Page Not Found</h2>
        <p class="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <RouterLink
            to="/"
            style="background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary))"
            class="px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            Go Home
          </RouterLink>
          <button
            @click="$router.back()"
            class="px-6 py-3 bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/30 rounded-xl font-semibold text-slate-300 transition-all"
          >
            Go Back
          </button>
        </div>

        <!-- Helpful Links -->
        <div class="mt-8 pt-8 border-t border-slate-700/30">
          <p class="text-sm text-slate-500 mb-3">Maybe you're looking for:</p>
          <div class="flex flex-wrap gap-3 justify-center text-sm">
            <RouterLink to="/" class="text-primary hover:text-primary transition-colors">Home</RouterLink>
            <span class="text-slate-600">•</span>
            <RouterLink to="/leaderboard" class="text-primary hover:text-primary transition-colors">Leaderboard</RouterLink>
            <span class="text-slate-600">•</span>
            <RouterLink to="/profile" class="text-primary hover:text-primary transition-colors">Profile</RouterLink>
            <span class="text-slate-600">•</span>
            <RouterLink to="/settings" class="text-primary hover:text-primary transition-colors">Settings</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>
