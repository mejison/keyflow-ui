<template>
  <div>
    <!-- Timer (reserved space to avoid jumping) -->
    <div 
      class="text-center mb-4 flex items-center justify-center transition-all duration-300"
      :class="settingsStore.settings.cinemaMode ? 'fixed top-10 left-1/2 -translate-x-1/2 z-[60]' : 'h-[50px]'"
    >
      <div 
        v-if="typingStore.isStarted && !typingStore.isFinished" 
        class="inline-flex items-center gap-3 backdrop-blur-sm rounded-full border border-primary/30 shadow-lg transition-all"
        :class="settingsStore.settings.cinemaMode ? 'bg-slate-900/80 px-10 py-5 scale-125' : 'bg-slate-800/60 px-8 py-4'"
      >
        <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span style="background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;" class="text-4xl font-bold">{{ typingStore.timeLeft }}</span>
        <span class="text-slate-400 text-lg">sec</span>
      </div>
    </div>

    <!-- Hint message before start (reserved space to avoid jumping) -->
    <div class="text-center mb-6 h-[60px] flex flex-col items-center justify-center gap-2">
      <div v-if="!typingStore.isStarted" class="flex flex-col gap-2">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 rounded-full border border-slate-700/40">
          <span class="text-lg">👇</span>
          <span class="text-slate-300 text-sm font-medium">Click below and start typing to begin</span>
          <span class="text-slate-400 text-xs px-2 py-0.5 bg-slate-700/50 rounded-full">({{ currentTestDuration }}s)</span>
        </div>
        <div class="flex items-center justify-center gap-2">
          <span class="text-slate-500 text-xs">Restart:</span>
          <kbd class="px-2 py-1 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 rounded text-xs text-slate-300 font-medium transition-colors">Tab+Enter</kbd>
          <kbd class="px-2 py-1 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 rounded text-xs text-slate-300 font-medium transition-colors">⌘R</kbd>
          <kbd class="px-2 py-1 bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 rounded text-xs text-slate-300 font-medium transition-colors">Esc</kbd>
        </div>
      </div>
    </div>

    <div
      ref="typingAreaRef"
      tabindex="0"
      @keydown="handleKeyDown"
      @click="focusArea"
      @blur="handleBlur"
      :style="{ fontSize: settingsStore.settings.cinemaMode ? '64px' : fontSizeMap[settingsStore.settings.fontSize] + 'px' }"
      class="rounded-2xl font-mono leading-[1.9] focus:outline-none cursor-text transition-all min-h-[320px] select-none break-words"
      :class="{ 
        'pointer-events-none opacity-50': typingStore.isFinished,
        'opacity-75': !typingStore.isStarted,
        'p-12 bg-slate-900/30 hover:bg-slate-900/40': !settingsStore.settings.cinemaMode,
        'fixed inset-0 z-50 flex flex-wrap content-center items-center justify-center p-20 bg-slate-950/95 backdrop-blur-xl': settingsStore.settings.cinemaMode
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
          index === typingStore.currentPosition && typingStore.isStarted && 'animate-pulse rounded'
        ]"
        :style="index === typingStore.currentPosition && typingStore.isStarted ? { backgroundColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)' } : {}"
      >{{ charState.char }}</span>
    </div>

    <!-- Results Modal -->
    <div v-if="typingStore.isFinished" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" @click.self="restart">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-10 max-w-xl w-full mx-4 shadow-2xl border border-slate-700/50 animate-scaleIn">
        <div class="text-center">
          <!-- Rank Badge -->
          <div class="mb-4">
            <span :class="[
              'inline-block px-4 py-2 rounded-full text-sm font-bold',
              rankData.color
            ]">
              {{ rankData.emoji }} {{ rankData.name }}
            </span>
          </div>
          
          <h2 class="text-2xl font-semibold text-slate-300 mb-8">{{ motivationalText }}</h2>
          
          <!-- Main WPM - Large and centered -->
          <div class="mb-8">
            <div class="text-slate-400 text-sm uppercase tracking-wide mb-2">Words Per Minute</div>
            <div style="background-image: linear-gradient(to right, var(--color-primary), var(--color-secondary)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;" class="text-9xl font-black leading-none mb-3 animate-countUp">
              {{ typingStore.wpm }}
            </div>
            <div class="text-slate-500 text-sm">{{ rankData.message }}</div>
          </div>
          
          <!-- Secondary Metrics - Smaller -->
          <div class="flex justify-center gap-8 mb-8 text-center">
            <div>
              <div class="text-5xl font-bold text-emerald-400 mb-1">{{ typingStore.accuracy }}%</div>
              <div class="text-slate-500 text-xs uppercase tracking-wide">Accuracy</div>
            </div>
            <div class="w-px bg-slate-700"></div>
            <div>
              <div class="text-5xl font-bold text-secondary mb-1">{{ typingStore.correctChars }}</div>
              <div class="text-slate-500 text-xs uppercase tracking-wide">Characters</div>
            </div>
            <div class="w-px bg-slate-700"></div>
            <div>
              <div class="text-5xl font-bold text-red-400 mb-1">{{ typingStore.incorrectChars }}</div>
              <div class="text-slate-500 text-xs uppercase tracking-wide">Errors</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="restart"
              class="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Restart
            </button>
            <button
              @click="handleShare"
              class="flex-1 px-6 py-3 bg-primary hover:bg-primary rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
            <button
              v-if="!authStore.isAuthenticated"
              @click="handleSave"
              class="flex-1 px-6 py-3 bg-secondary hover:bg-secondary rounded-xl transition-all font-semibold text-sm flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Cinema Mode Exit Hint -->
    <div 
      v-if="settingsStore.settings.cinemaMode"
      class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] text-slate-500 text-sm opacity-0 hover:opacity-100 transition-opacity duration-300 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm cursor-pointer"
      @click="settingsStore.updateSetting('cinemaMode', false)"
    >
      Press <kbd class="font-bold text-slate-300">Esc</kbd> or <kbd class="font-bold text-slate-300">Alt+C</kbd> to exit
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useTypingStore } from '@/stores/typing'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import { typingConfig } from '@/config/typing'

const router = useRouter()
const languageStore = useLanguageStore()
const typingStore = useTypingStore()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const toast = useToast()
const typingAreaRef = ref<HTMLDivElement>()
const lastKeyWasTab = ref(false)
let lastWarningTime = 0

const fontSizeMap: Record<string, number> = {
  small: 20,
  medium: 24,
  large: 32
}

// Отримуємо актуальну тривалість тесту (завжди з settingsStore, який сам обробляє localStorage/API)
const currentTestDuration = computed(() => {
  return settingsStore.settings.testDuration
})

// Визначення рангу базуючись на WPM
const rankData = computed(() => {
  const wpm = typingStore.wpm
  if (wpm < 20) return { 
    name: 'Beginner', 
    emoji: '🌱', 
    color: 'bg-slate-600/30 text-slate-300 border border-slate-500',
    message: 'Keep practicing, you\'re just getting started!'
  }
  if (wpm < 40) return { 
    name: 'Intermediate', 
    emoji: '📈', 
    color: 'bg-primary/30 text-primary border border-primary',
    message: 'Good progress! Keep it up!'
  }
  if (wpm < 60) return { 
    name: 'Advanced', 
    emoji: '⚡', 
    color: 'bg-secondary/30 text-secondary border border-secondary',
    message: 'Impressive speed and accuracy!'
  }
  if (wpm < 80) return { 
    name: 'Expert', 
    emoji: '🔥', 
    color: 'bg-orange-600/30 text-orange-300 border border-orange-500',
    message: 'You\'re typing like a pro!'
  }
  return { 
    name: 'Master', 
    emoji: '👑', 
    color: 'bg-yellow-600/30 text-yellow-300 border border-yellow-500',
    message: 'Incredible! You\'re a typing master!'
  }
})

// Мотиваційний текст
const motivationalText = computed(() => {
  const accuracy = typingStore.accuracy
  if (accuracy === 100) return 'Perfect! No mistakes!'
  if (accuracy >= 95) return 'Excellent work!'
  if (accuracy >= 85) return 'Great job!'
  if (accuracy >= 70) return 'Good effort!'
  return 'Keep practicing!'
})

// Функція для визначення розкладки символу
const getCharLayout = (char: string): 'latin' | 'cyrillic' | 'other' => {
  if (/[a-zA-Z]/.test(char)) return 'latin'
  if (/[а-яА-ЯіїєґІЇЄҐ]/.test(char)) return 'cyrillic'
  return 'other'
}

// Визначаємо розкладку тексту (більшість символів)
const textLayout = computed(() => {
  const chars = typingStore.text.replace(/\s/g, '').split('')
  const latinCount = chars.filter(c => getCharLayout(c) === 'latin').length
  const cyrillicCount = chars.filter(c => getCharLayout(c) === 'cyrillic').length
  return latinCount > cyrillicCount ? 'latin' : 'cyrillic'
})

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
    // If Cinema Mode is on, let the global handler in App.vue handle it
    if (settingsStore.settings.cinemaMode) return
    
    event.preventDefault()
    restart()
    return
  }

  // Ігноруємо спеціальні клавіші (крім Backspace)
  if (event.key.length > 1 && event.key !== 'Backspace') return

  // Перевірка розкладки (показуємо toast не частіше ніж раз на 3 секунди)
  const keyLayout = getCharLayout(event.key)
  const now = Date.now()
  if (keyLayout !== 'other' && keyLayout !== textLayout.value) {
    if (now - lastWarningTime > 3000) {
      const message = textLayout.value === 'latin' 
        ? 'Wrong layout! Switch to English' 
        : 'Wrong layout! Switch to Cyrillic'
      toast.warning(message, 2000)
      lastWarningTime = now
    }
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

const handleShare = async () => {
  const shareText = `I just typed ${typingStore.wpm} WPM with ${typingStore.accuracy}% accuracy on Keyflow! 🚀\n\nTry it yourself: ${window.location.origin}`
  
  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Keyflow Results',
        text: shareText,
      })
      toast.success('Shared successfully!')
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Fallback to clipboard
        copyToClipboard(shareText)
      }
    }
  } else {
    // Fallback to clipboard
    copyToClipboard(shareText)
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Results copied to clipboard!')
  }).catch(() => {
    toast.error('Failed to copy results')
  })
}

const handleSave = () => {
  // Prompt user to sign in to save results
  toast.info('Sign in to save your results and track progress!')
  setTimeout(() => {
    router.push('/login')
  }, 1500)
}

</script>