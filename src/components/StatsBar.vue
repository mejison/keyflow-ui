<template>
  <div v-if="typingStore.isFinished" class="grid grid-cols-2 md:grid-cols-3 gap-6">
    <div class="text-center p-4 bg-slate-900/50 rounded-xl border border-blue-500/20">
      <div class="text-slate-400 text-sm mb-2">WPM</div>
      <div class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
        {{ typingStore.wpm }}
      </div>
    </div>
    <div class="text-center p-4 bg-slate-900/50 rounded-xl border border-emerald-500/20">
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
import { useTypingStore } from '@/stores/typing'

const typingStore = useTypingStore()
</script>
