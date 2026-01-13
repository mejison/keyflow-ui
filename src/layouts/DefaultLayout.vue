<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <Header />

    <!-- Main Content -->
    <main class="py-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="mt-auto py-8 text-center text-slate-500 text-sm">
      <p>Practice makes perfect · Built with Vue 3 + TypeScript</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

