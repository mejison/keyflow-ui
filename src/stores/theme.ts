import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'default' | 'ocean' | 'sunset' | 'forest' | 'violet' | 'rose'

export interface ThemeColors {
  id: Theme
  name: string
  emoji: string
  primary: string
  secondary: string
}

export const themes: ThemeColors[] = [
  {
    id: 'default',
    name: 'Default',
    emoji: '💙',
    primary: '#3b82f6', // blue-500
    secondary: '#a855f7', // purple-500
  },
  {
    id: 'ocean',
    name: 'Ocean',
    emoji: '🌊',
    primary: '#06b6d4', // cyan-500
    secondary: '#0ea5e9', // sky-500
  },
  {
    id: 'sunset',
    name: 'Sunset',
    emoji: '🌅',
    primary: '#f97316', // orange-500
    secondary: '#ef4444', // red-500
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    primary: '#10b981', // emerald-500
    secondary: '#14b8a6', // teal-500
  },
  {
    id: 'violet',
    name: 'Violet',
    emoji: '💜',
    primary: '#8b5cf6', // violet-500
    secondary: '#d946ef', // fuchsia-500
  },
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    primary: '#ec4899', // pink-500
    secondary: '#f43f5e', // rose-500
  },
]

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>('default')

  // Load theme from localStorage
  const loadTheme = () => {
    const saved = localStorage.getItem('keyflow_theme')
    if (saved && themes.find(t => t.id === saved)) {
      currentTheme.value = saved as Theme
    }
    applyTheme()
  }

  // Apply theme to document
  const applyTheme = () => {
    const theme = themes.find(t => t.id === currentTheme.value)
    if (!theme) return

    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.primary)
    root.style.setProperty('--color-secondary', theme.secondary)
    root.setAttribute('data-theme', theme.id)
  }

  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    localStorage.setItem('keyflow_theme', theme)
    applyTheme()
  }

  // Watch for changes
  watch(currentTheme, () => {
    applyTheme()
  })

  // Initialize
  loadTheme()

  return {
    currentTheme,
    themes,
    setTheme,
  }
})
