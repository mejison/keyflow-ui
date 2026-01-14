<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-4xl px-4">
      <!-- Welcome Section -->
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-6xl font-bold text-slate-50 mb-5 tracking-tight">
          Improve Your Typing Speed
        </h2>
        <p class="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Practice typing and track your progress in real-time
        </p>
      </div>

      <!-- Typing Area Card -->
      <div class="bg-slate-800/40 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-700/30 p-12">
        <TypingArea />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TypingArea from '@/components/TypingArea.vue'
import SelectLanguage from '@/components/LanguageSelector.vue'
</script>
