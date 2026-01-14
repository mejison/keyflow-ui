<template>
  <div>
    <!-- Timer -->
    <div v-if="typingStore.isStarted && !typingStore.isFinished" class="text-center mb-8">
      <div class="inline-flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm px-8 py-4 rounded-full border border-blue-500/30 shadow-lg">
        <svg class="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{{ typingStore.timeLeft }}</span>
        <span class="text-slate-400 text-lg">sec</span>
      </div>
    </div>

    <!-- Hint message before start -->
    <div v-if="!typingStore.isStarted" class="text-center mb-6">
      <p class="text-slate-400 text-base mb-2">
        <span class="inline-block mr-2 text-xl">👆</span>
        Click below and start typing to begin
        <span class="text-slate-500 ml-2 text-sm">({{ typingConfig.testDuration }}s)</span>
      </p>
      <p class="text-slate-500 text-sm mt-3 flex items-center justify-center gap-2">
        <span>💡</span>
        <span>Restart: <kbd class="px-2 py-0.5 bg-slate-700/50 rounded text-xs">Tab+Enter</kbd>, <kbd class="px-2 py-0.5 bg-slate-700/50 rounded text-xs">⌘R</kbd>, or <kbd class="px-2 py-0.5 bg-slate-700/50 rounded text-xs">Esc</kbd></span>
      </p>
    </div>

    <div
      ref="typingAreaRef"
      tabindex="0"
      @keydown="handleKeyDown"
      @click="focusArea"
      @blur="handleBlur"
      :style="{ fontSize: fontSizeMap[settingsStore.settings.fontSize] + 'px' }"
      class="rounded-2xl p-12 font-mono leading-[1.8] focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-text transition-all min-h-[320px] bg-slate-900/30 select-none break-words"
      :class="{ 
        'pointer-events-none opacity-50': typingStore.isFinished,
        'opacity-75': !typingStore.isStarted 
      }"
    >
      <span
        v-for="(charState, index) in typingStore.chars"
        :key="index"
        :class="[
          'relative transition-colors duration-150',
          !typingStore.isStarted && 'text-slate-500',
          typingStore.isStarted && charState.isCorrect === null && 'text-slate-200',
          charState.isCorrect === true && 'text-emerald-300',
          charState.isCorrect === false && 'text-red-300 bg-red-500/10 rounded',
          index === typingStore.currentPosition && typingStore.isStarted && 'bg-blue-400/25 animate-pulse rounded px-1'
        ]"
      >{{ charState.char }}</span>
    </div>

    <!-- Results Modal -->
    <div v-if="typingStore.isFinished" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" @click.self="restart">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-slate-700">
        <div class="text-center">
          <div class="text-6xl mb-4">🎉</div>
          <h2 class="text-3xl font-bold text-slate-100 mb-6">Time's Up!</h2>
          
          <!-- Results -->
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
              <div class="text-slate-400 text-sm mb-1">WPM</div>
              <div class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {{ typingStore.wpm }}
              </div>
            </div>
            <div class="bg-slate-900/50 rounded-xl p-4 border border-emerald-500/30">
              <div class="text-slate-400 text-sm mb-1">Accuracy</div>
              <div class="text-4xl font-bold text-emerald-400">
                {{ typingStore.accuracy }}%
              </div>
            </div>
            <div class="bg-slate-900/50 rounded-xl p-4 border border-purple-500/30">
              <div class="text-slate-400 text-sm mb-1">Characters</div>
              <div class="text-4xl font-bold text-purple-400">
                {{ typingStore.correctChars }}
              </div>
            </div>
            <div class="bg-slate-900/50 rounded-xl p-4 border border-red-500/30">
              <div class="text-slate-400 text-sm mb-1">Errors</div>
              <div class="text-4xl font-bold text-red-400">
                {{ typingStore.incorrectChars }}
              </div>
            </div>
          </div>

          <button
            @click="restart"
            class="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl transition-all font-semibold text-lg shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useTypingStore } from '@/stores/typing'
import { useSettingsStore } from '@/stores/settings'
import { typingConfig } from '@/config/typing'

const languageStore = useLanguageStore()
const typingStore = useTypingStore()
const settingsStore = useSettingsStore()
const typingAreaRef = ref<HTMLDivElement>()
const lastKeyWasTab = ref(false)

const fontSizeMap = {
  small: 20,
  medium: 24,
  large: 32
}

// Ініціалізація тексту при завантаженні
onMounted(() => {
  typingStore.generateNewText()
})

// Генеруємо новий текст при зміні набору слів
watch(() => languageStore.currentWordSet, () => {
  typingStore.generateNewText()
  // Знімаємо фокус щоб випадково не запустити таймер
  typingAreaRef.value?.blur()
})

const handleBlur = () => {
  // Дозволяємо зняти фокус
}

const handleKeyDown = (event: KeyboardEvent) => {
  // Cmd+R (Mac) або Ctrl+R (Windows/Linux) - перезапуск
  if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
    event.preventDefault()
    restart()
    return
  }

  // Tab+Enter - перезапуск
  if (event.key === 'Tab') {
    event.preventDefault()
    lastKeyWasTab.value = true
    setTimeout(() => { lastKeyWasTab.value = false }, 1000)
    return
  }

  if (event.key === 'Enter' && lastKeyWasTab.value) {
    event.preventDefault()
    restart()
    lastKeyWasTab.value = false
    return
  }

  // Esc - перезапуск
  if (event.key === 'Escape') {
    event.preventDefault()
    restart()
    return
  }

  event.preventDefault()
  typingStore.handleKeyPress(event.key)
}

const focusArea = () => {
  typingAreaRef.value?.focus()
}

const restart = () => {
  typingStore.generateNewText()
}

</script>