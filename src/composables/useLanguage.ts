import { ref } from 'vue'

export type Language = 'en' | 'ua' | 'es'

const currentLanguage = ref<Language>('en')

export function useLanguage() {
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
}
