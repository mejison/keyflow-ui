import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Language = 'en' | 'ua' | 'es'

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref<Language>('en')

  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  const initLanguage = () => {
    const saved = localStorage.getItem('language') as Language
    if (saved && ['en', 'ua', 'es'].includes(saved)) {
      currentLanguage.value = saved
    }
  }

  return {
    currentLanguage,
    setLanguage,
    initLanguage,
  }
})
