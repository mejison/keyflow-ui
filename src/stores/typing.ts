import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useSettingsStore } from '@/stores/settings'
import { typingTestsApi } from '@/services/api'
import { analytics } from '@/utils/analytics'
import english1k from '@/assets/english_1k.json'
import english5k from '@/assets/english_5k.json'
import english10k from '@/assets/english_10k.json'

interface CharState {
  char: string
  isCorrect: boolean | null // null = не введено, true = правильно, false = помилка
}

// Словники слів
const wordSets = {
  '1k': english1k.words,
  '5k': english5k.words,
  '10k': english10k.words,
}

// Генератор "речень" з випадкових слів
const generateText = (wordCount: number, wordSet: '1k' | '5k' | '10k'): string => {
  const words = wordSets[wordSet]
  const result: string[] = []
  
  for (let i = 0; i < wordCount; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)]
    if (randomWord) {
      result.push(randomWord)
    }
  }
  
  return result.join(' ')
}

export const useTypingStore = defineStore('typing', () => {
  const settingsStore = useSettingsStore()
  
  // Audio for keyboard sounds
  let keyAudio: HTMLAudioElement | null = null
  const playKeySound = () => {
    if (!keyAudio) {
      keyAudio = new Audio()
      keyAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LVjjcHHWu98N2QQAoUX6rl8K1hGgU7k9r03IQ1BxlqvPDej0ALElynX+myXxoEO5XZ8tiJNwgZaLzv3pE/ChFbp+Twq2AaBDuU2fPaiTYIGGm97t+PQAoRXKfj8K1hGgU7k9n03IQ1BxlqvO/ejkALEVyn4/CsYRoFO5PZ9N2INQcZarz'
    }
    const sound = keyAudio.cloneNode() as HTMLAudioElement
    sound.volume = 0.3
    sound.play().catch(() => {})
  }
  
  const text = ref<string>('')
  const userInput = ref<string>('')
  const isStarted = ref(false)
  const isFinished = ref(false)
  const startTime = ref<number | null>(null)
  const timeLeft = ref(60)
  const timerInterval = ref<number | null>(null)

  // Get test duration from settings
  const testDuration = computed(() => settingsStore.settings.testDuration)

  // Розбиваємо текст на символи зі станом
  const chars = computed<CharState[]>(() => {
    return text.value.split('').map((char, index) => {
      if (index >= userInput.value.length) {
        return { char, isCorrect: null }
      }
      const userChar = userInput.value[index]
      return { char, isCorrect: userChar === char }
    })
  })

  const currentPosition = computed(() => userInput.value.length)
  const totalChars = computed(() => text.value.length)
  const correctChars = computed(() => 
    chars.value.filter(c => c.isCorrect === true).length
  )
  const incorrectChars = computed(() => 
    chars.value.filter(c => c.isCorrect === false).length
  )
  const accuracy = computed(() => {
    if (userInput.value.length === 0) return 100
    return Math.round((correctChars.value / userInput.value.length) * 100)
  })

  const wpm = computed(() => {
    if (correctChars.value === 0) return 0
    const averageWordLength = 5
    const wordsTyped = correctChars.value / averageWordLength
    if (isFinished.value) {
      // Фінальний WPM за testDuration
      return Math.round(wordsTyped)
    }
    // Поточний WPM (екстраполяція)
    const secondsElapsed = testDuration.value - timeLeft.value
    if (secondsElapsed === 0) return 0
    return Math.round((wordsTyped / secondsElapsed) * testDuration.value)
  })

  const setText = (newText: string) => {
    text.value = newText
    reset()
  }

  const generateNewText = () => {
    const languageStore = useLanguageStore()
    const wordSet = languageStore.currentWordSet
    text.value = generateText(50, wordSet) // Генеруємо 50 слів
    reset()
    
    // Analytics - track test start when user starts typing
    if (isStarted.value) {
      analytics.startTest(testDuration.value, wordSet)
    }
  }

  const startTimer = () => {
    if (timerInterval.value) return
    
    timerInterval.value = window.setInterval(() => {
      timeLeft.value--
      
      if (timeLeft.value <= 0) {
        finishTest()
      }
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    
    // Analytics
    analytics.completeTest(wpm.value, accuracy.value, testDuration.value)
  }

  const finishTest = async () => {
    isFinished.value = true
    stopTimer()

    // Save test results to backend if user is authenticated
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        // Calculate final statistics
        const averageWordLength = 5
        const totalWords = userInput.value.trim().split(/\s+/).length
        const correctWords = Math.round((correctChars.value / averageWordLength))
        const incorrectWords = totalWords - correctWords

        await typingTestsApi.saveTest({
          wpm: wpm.value,
          accuracy: accuracy.value,
          duration: testDuration.value,
          correct_words: correctWords,
          incorrect_words: Math.max(0, incorrectWords),
          total_words: totalWords,
          text_content: text.value.substring(0, 500) // Send first 500 chars
        })
      } catch (error) {
        console.error('Failed to save test results:', error)
        // Don't show error to user, just log it
      }
    }
  }

  const handleKeyPress = (key: string) => {
    if (!isStarted.value) {
      
      // Analytics - track test start
      const languageStore = useLanguageStore()
      analytics.startTest(testDuration.value, languageStore.currentWordSet)
      isStarted.value = true
      startTime.value = Date.now()
      startTimer()
    }

    if (isFinished.value) return

    // Play sound if enabled
    if (settingsStore.settings.soundEnabled) {
      playKeySound()
    }

    // Backspace
    if (key === 'Backspace') {
      userInput.value = userInput.value.slice(0, -1)
      return
    }

    // Ігноруємо спеціальні клавіші
    if (key.length > 1) return

    // Додаємо символ
    userInput.value += key

    // Якщо текст закінчився, генеруємо ще
    const textBufferThreshold = 10
    const wordsToAddWhenExtending = 20
    if (userInput.value.length >= text.value.length - textBufferThreshold) {
      // Додаємо ще слів
      const languageStore = useLanguageStore()
      const wordSet = languageStore.currentWordSet
      text.value += ' ' + generateText(wordsToAddWhenExtending, wordSet)
    }
  }

  const reset = () => {
    userInput.value = ''
    isStarted.value = false
    isFinished.value = false
    startTime.value = null
    timeLeft.value = testDuration.value
    stopTimer()
  }

  return {
    text,
    userInput,
    isStarted,
    isFinished,
    timeLeft,
    chars,
    currentPosition,
    totalChars,
    correctChars,
    incorrectChars,
    accuracy,
    wpm,
    generateNewText,
    setText,
    handleKeyPress,
    reset,
  }
})
