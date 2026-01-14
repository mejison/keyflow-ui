import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsApi } from '@/services/api'
import { useToast } from '@/composables/useToast'

export interface Settings {
  testDuration: 15 | 30 | 60 | 120
  soundEnabled: boolean
  fontSize: 'small' | 'medium' | 'large'
}

const DEFAULT_SETTINGS: Settings = {
  testDuration: 60,
  soundEnabled: false,
  fontSize: 'medium',
}

export const useSettingsStore = defineStore('settings', () => {
  const toast = useToast()
  const settings = ref<Settings>({ ...DEFAULT_SETTINGS })
  const loading = ref(false)

  // Convert API format to local format
  const apiToLocal = (apiSettings: any): Settings => {
    // Map font_size number to string
    let fontSize: 'small' | 'medium' | 'large' = 'medium'
    if (apiSettings.font_size) {
      if (apiSettings.font_size <= 14) fontSize = 'small'
      else if (apiSettings.font_size <= 18) fontSize = 'medium'
      else fontSize = 'large'
    }

    return {
      testDuration: apiSettings.test_duration || 60,
      soundEnabled: apiSettings.sound_enabled !== undefined ? apiSettings.sound_enabled : false,
      fontSize: fontSize,
    }
  }

  // Convert local format to API format
  const localToApi = (localSettings: Settings) => {
    // Map font size string to number for API
    const fontSizeMap: Record<string, number> = {
      'small': 14,
      'medium': 16,
      'large': 20
    }

    return {
      test_duration: localSettings.testDuration,
      sound_enabled: localSettings.soundEnabled,
      font_size: fontSizeMap[localSettings.fontSize] || 16,
    }
  }

  // Load settings from localStorage or API
  const loadSettings = async () => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('keyflow_settings')
    if (saved) {
      try {
        settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      } catch (e) {
        console.error('Failed to load settings from localStorage:', e)
      }
    }

    // If user is authenticated, load from API
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        loading.value = true
        const response = await settingsApi.getSettings()
        console.log('API Settings Response:', response)
        
        // API returns data.settings, not just data
        const apiData = (response.data as any)?.settings || response.data
        const apiSettings = apiToLocal(apiData)
        
        console.log('Converted Settings:', apiSettings)
        settings.value = apiSettings
        // Save to localStorage as backup
        localStorage.setItem('keyflow_settings', JSON.stringify(apiSettings))
      } catch (e) {
        console.error('Failed to load settings from API:', e)
      } finally {
        loading.value = false
      }
    }
  }

  // Save settings to localStorage and API
  const saveSettings = async () => {
    // Save to localStorage
    localStorage.setItem('keyflow_settings', JSON.stringify(settings.value))
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        await settingsApi.updateSettings(localToApi(settings.value))
        toast.success('Settings saved')
      } catch (e) {
        console.error('Failed to save settings to API:', e)
        toast.error('Failed to save settings')
      }
    }
  }

  // Update a specific setting
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    settings.value[key] = value
    saveSettings()
  }

  // Reset to defaults
  const resetSettings = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        loading.value = true
        const response = await settingsApi.resetSettings()
        const apiData = (response.data as any)?.settings || response.data
        const apiSettings = apiToLocal(apiData)
        settings.value = apiSettings
        localStorage.setItem('keyflow_settings', JSON.stringify(apiSettings))
        toast.success('Settings reset to defaults')
      } catch (e) {
        console.error('Failed to reset settings on API:', e)
        settings.value = { ...DEFAULT_SETTINGS }
        localStorage.setItem('keyflow_settings', JSON.stringify(settings.value))
        toast.error('Failed to reset settings')
      } finally {
        loading.value = false
      }
    } else {
      settings.value = { ...DEFAULT_SETTINGS }
      await saveSettings()
      toast.success('Settings reset to defaults')
    }
  }

  // Initialize
  loadSettings()

  return {
    settings,
    loading,
    updateSetting,
    resetSettings,
    loadSettings,
  }
})

