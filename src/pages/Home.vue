<template>
  <DefaultLayout>
    <div class="container mx-auto max-w-4xl px-4">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h2 class="text-5xl md:text-6xl font-bold text-slate-50 mb-5 tracking-tight">
          Improve Your Typing Speed
        </h2>
        <p class="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
          Practice typing and track your progress in real-time
        </p>
        
        <!-- Language Selector -->
        <div class="flex justify-center">
          <LanguageSelector />
        </div>
      </div>

      <!-- Typing Area Card -->
      <TypingArea />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import TypingArea from '@/components/TypingArea.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import { useMeta } from '@/composables/useMeta'

const { setMeta } = useMeta()

onMounted(() => {
  setMeta({
    title: 'KeyFlow - Improve Your Typing Speed',
    description: 'Practice typing and improve your speed with KeyFlow. Real-time WPM tracking, multiple word sets, and competitive leaderboards. Start typing today!',
    keywords: 'typing test, typing speed, WPM, words per minute, typing practice, keyboard typing, typing game'
  })
})
</script>
