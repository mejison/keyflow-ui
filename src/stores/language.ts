import { defineStore } from 'pinia'
import { ref } from 'vue'

export type WordSet = '1k' | '5k' | '10k'

export const useLanguageStore = defineStore('language', () => {
  const currentWordSet = ref<WordSet>('1k')

  const setWordSet = (wordSet: WordSet) => {
    currentWordSet.value = wordSet
    localStorage.setItem('wordSet', wordSet)
  }

  const initWordSet = () => {
    const saved = localStorage.getItem('wordSet') as WordSet
    if (saved && ['1k', '5k', '10k'].includes(saved)) {
      currentWordSet.value = saved
    }
  }

  return {
    currentWordSet,
    setWordSet,
    initWordSet,
  }
})
