<template>
  <div class="inline-flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-3 shadow-lg">
    <div class="flex items-center gap-2 text-slate-400 text-sm font-medium">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      <span>Word Set:</span>
    </div>
    <div class="flex gap-2">
      <button
        v-for="option in options"
        :key="option.value"
        @click="store.setWordSet(option.value)"
        :class="[
          'px-4 py-1.5 rounded-lg font-medium text-sm transition-all',
          store.currentWordSet === option.value
            ? 'bg-primary text-white shadow-md shadow-primary/30'
            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore, type WordSet } from '@/stores/language'

const store = useLanguageStore()

const options = [
  { value: '1k' as WordSet, label: '1k' },
  { value: '5k' as WordSet, label: '5k' },
  { value: '10k' as WordSet, label: '10k' }
]
</script>
