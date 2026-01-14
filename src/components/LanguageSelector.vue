<template>
  <div>
    <select
      v-model="store.currentWordSet"
      @change="handleChange"
      class="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      <option value="1k">English 1k</option>
      <option value="5k">English 5k</option>
      <option value="10k">English 10k</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore, type WordSet } from '@/stores/language'

const store = useLanguageStore()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  store.setWordSet(target.value as WordSet)
}
</script>
