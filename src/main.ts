import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.css'

import App from './App.vue'

import { router } from './router'
import { useLanguageStore } from './stores/language'
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import { initSentry } from './utils/sentry'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize Sentry error monitoring
initSentry(app, router)

// Global error handler for uncaught errors
app.config.errorHandler = (err, _instance, info) => {
  console.error('Global error:', err, info)
  // Sentry will automatically capture this
}

// Initialize word set from localStorage
const languageStore = useLanguageStore()
languageStore.initWordSet()

// Initialize theme from localStorage
const themeStore = useThemeStore()

// Initialize auth - restore user session if token exists
const authStore = useAuthStore()
const token = localStorage.getItem('auth_token')
if (token && !authStore.user) {
  authStore.fetchUser().catch(() => {
    // If token is invalid, clear it
    localStorage.removeItem('auth_token')
  })
}

app.mount('#app')