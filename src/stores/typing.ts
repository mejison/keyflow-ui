import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { typingConfig } from '@/config/typing'

interface CharState {
  char: string
  isCorrect: boolean | null // null = не введено, true = правильно, false = помилка
}

export const useTypingStore = defineStore('typing', () => {
  const text = ref<string>('')
  const userInput = ref<string>('')
  const isStarted = ref(false)
  const isFinished = ref(false)
  const startTime = ref<number | null>(null)
  const timeLeft = ref(typingConfig.testDuration)
  const timerInterval = ref<number | null>(null)

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
    const wordsTyped = correctChars.value / typingConfig.averageWordLength
    if (isFinished.value) {
      // Фінальний WPM за testDuration
      return Math.round(wordsTyped)
    }
    // Поточний WPM (екстраполяція)
    const secondsElapsed = typingConfig.testDuration - timeLeft.value
    if (secondsElapsed === 0) return 0
    return Math.round((wordsTyped / secondsElapsed) * typingConfig.testDuration)
  })

  const setText = (newText: string) => {
    text.value = newText
    reset()
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
  }

  const finishTest = () => {
    isFinished.value = true
    stopTimer()
  }

  const handleKeyPress = (key: string) => {
    if (!isStarted.value) {
      isStarted.value = true
      startTime.value = Date.now()
      startTimer()
    }

    if (isFinished.value) return

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
    if (userInput.value.length >= text.value.length - typingConfig.textBufferThreshold) {
      // Додаємо ще текст, щоб можна було продовжити друкувати
      const words = text.value.split(' ')
      text.value += ' ' + words.slice(0, typingConfig.wordsToAddWhenExtending).join(' ')
    }
  }

  const reset = () => {
    userInput.value = ''
    isStarted.value = false
    isFinished.value = false
    startTime.value = null
    timeLeft.value = typingConfig.testDuration
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
    setText,
    handleKeyPress,
    reset,
  }
})
