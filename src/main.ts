import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.css'

import App from './App.vue'

import { router } from './router'
import { useLanguageStore } from './stores/language'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize word set from localStorage
const languageStore = useLanguageStore()
languageStore.initWordSet()

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