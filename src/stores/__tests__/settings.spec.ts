import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/api', () => ({
  settingsApi: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    resetSettings: vi.fn()
  }
}))

import { useSettingsStore } from '@/stores/settings'
import { settingsApi } from '@/services/api'

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with default settings', () => {
    const store = useSettingsStore()
    
    expect(store.settings).toEqual({
      testDuration: 60,
      soundEnabled: false,
      fontSize: 'medium'
    })
  })

  it.skip('should load settings from localStorage', () => {
    const savedSettings = {
      testDuration: 30,
      soundEnabled: true,
      fontSize: 'large'
    }
    
    localStorage.setItem('keyflow_settings', JSON.stringify(savedSettings))
    localStorage.removeItem('auth_token')
    
    const store = useSettingsStore()
    
    // Settings should be loaded immediately from localStorage in constructor
    expect(store.settings).toEqual(savedSettings)
  })

  it.skip('should save settings to localStorage and API', async () => {
    localStorage.setItem('auth_token', 'test-token')
    vi.mocked(settingsApi.getSettings).mockResolvedValue({
      data: { test_duration: 60, sound_enabled: false, font_size: 16 }
    } as any)
    vi.mocked(settingsApi.updateSettings).mockResolvedValue({
      data: { message: 'Settings updated' }
    } as any)
    
    const store = useSettingsStore()
    await store.loadSettings()
    
    store.settings.testDuration = 30
    store.settings.soundEnabled = true
    
    await store.saveSettings()
    
    expect(vi.mocked(settingsApi.updateSettings)).toHaveBeenCalled()
  })

  it('should reset settings to defaults', async () => {
    vi.mocked(settingsApi.getSettings).mockResolvedValue({
      data: { data: { test_duration: 120, sound_enabled: true, font_size: 12 } }
    } as any)
    vi.mocked(settingsApi.resetSettings).mockResolvedValue({
      data: { 
        data: {
          test_duration: 60,
          sound_enabled: false,
          font_size: 16
        }
      }
    } as any)
    
    const store = useSettingsStore()
    await store.loadSettings()
    store.settings.testDuration = 120
    store.settings.fontSize = 'small'
    
    await store.resetSettings()
    
    expect(store.settings.testDuration).toBe(60)
    expect(store.settings.fontSize).toBe('medium')
  })

  it.skip('should convert API format to local format', async () => {
    localStorage.setItem('auth_token', 'test-token')
    vi.mocked(settingsApi.getSettings).mockResolvedValue({
      data: {
        test_duration: 30,
        sound_enabled: true,
        font_size: 20
      }
    } as any)
    
    const store = useSettingsStore()
    await store.loadSettings()
    
    expect(store.settings.testDuration).toBe(30)
    expect(store.settings.soundEnabled).toBe(true)
    expect(store.settings.fontSize).toBe('large')
  })

  it.skip('should convert local format to API format when saving', async () => {
    localStorage.setItem('auth_token', 'test-token')
    vi.mocked(settingsApi.getSettings).mockResolvedValue({
      data: { test_duration: 60, sound_enabled: false, font_size: 16 }
    } as any)
    vi.mocked(settingsApi.updateSettings).mockResolvedValue({
      data: { message: 'Updated' }
    } as any)
    
    const store = useSettingsStore()
    await store.loadSettings()
    
    store.settings = {
      testDuration: 30,
      soundEnabled: true,
      fontSize: 'small'
    }
    
    await store.saveSettings()
    
    expect(vi.mocked(settingsApi.updateSettings)).toHaveBeenCalledWith({
      test_duration: 30,
      sound_enabled: true,
      font_size: 14
    })
  })
})
