<template>
  <div v-if="typingStore.isFinished" class="grid gap-6" :class="gridCols">
    <div v-if="settingsStore.settings.showWpm" class="text-center p-4 bg-slate-900/50 rounded-xl border border-blue-500/20">
      <div class="text-slate-400 text-sm mb-2">WPM</div>
      <div class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        {{ typingStore.wpm }}
      </div>
    </div>
    <div v-if="settingsStore.settings.showAccuracy" class="text-center p-4 bg-slate-900/50 rounded-xl border border-emerald-500/20">
      <div class="text-slate-400 text-sm mb-2">Accuracy</div>
      <div class="text-3xl font-bold text-emerald-400">
        {{ typingStore.accuracy }}%
      </div>
    </div>
    <div class="text-center p-4 bg-slate-900/50 rounded-xl border border-red-500/20">
      <div class="text-slate-400 text-sm mb-2">Errors</div>
      <div class="text-3xl font-bold text-red-400">
        {{ typingStore.incorrectChars }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTypingStore } from '@/stores/typing'
import { useSettingsStore } from '@/stores/settings'

const typingStore = useTypingStore()
const settingsStore = useSettingsStore()

const gridCols = computed(() => {
  const visibleCount = [
    settingsStore.settings.showWpm,
    settingsStore.settings.showAccuracy,
    true // Errors always visible
  ].filter(Boolean).length
  
  if (visibleCount === 1) return 'grid-cols-1'
  if (visibleCount === 2) return 'grid-cols-2'
  return 'grid-cols-2 md:grid-cols-3'
})
</script>
