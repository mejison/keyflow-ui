import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/main.css'

import App from './App.vue'

import { router } from './router'
import { useLanguageStore } from './stores/language'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize language from localStorage
const languageStore = useLanguageStore()
languageStore.initLanguage()

app.mount('#app')