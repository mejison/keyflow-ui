<template>
  <div v-if="typingStore.isFinished" class="grid gap-6 grid-cols-2 md:grid-cols-3">
    <div class="text-center p-4 bg-slate-900/50 rounded-xl border border-primary/20">
      <div class="text-slate-500 text-sm mb-1">WPM</div>
      <div style="background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;" class="text-3xl font-bold">
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
