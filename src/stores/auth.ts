import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, api, type User as ApiUser } from '@/services/api'
import { AxiosError } from 'axios'
import { useToast } from '@/composables/useToast'
import { stopSessionMonitoring, startSessionMonitoring } from '@/utils/session'
import { analytics } from '@/utils/analytics'
import { setUserContext, clearUserContext } from '@/utils/sentry'
import { useSettingsStore } from '@/stores/settings'

export interface User {
  id: string | number
  name: string
  email: string
  avatar?: string
  provider?: 'email' | 'github' | 'google'
}

interface ErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

export const useAuthStore = defineStore('auth', () => {
  const toast = useToast()
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Helper to convert API user to store user
  const convertUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    avatar: apiUser.avatar,
    provider: (apiUser.provider as 'email' | 'github' | 'google') || 'email',
  })

  // Helper to handle API errors
  const handleError = (err: unknown): string => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as ErrorResponse
      if (data?.errors) {
        // Laravel validation errors
        const firstError = Object.values(data.errors)[0]
        return firstError?.[0] || data.message || 'An error occurred'
      }
      return data?.message || err.message || 'An error occurred'
    }
    return err instanceof Error ? err.message : 'An error occurred'
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.login(email, password)
      
      // Save token
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
      }
      
      // Save user
      user.value = convertUser(response.data.user)
      toast.success(`Welcome back, ${user.value.name}!`)
      
      // Analytics
      analytics.login('email')
      
      // Sentry user context
      setUserContext(user.value)
      
      // Start session monitoring
      startSessionMonitoring()
      
      return true
    } catch (err) {
      error.value = handleError(err)
      toast.error(error.value)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  const signup = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.register(name, email, password, passwordConfirmation)
      
      // Save token
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
      }
      
      // Save user
      user.value = convertUser(response.data.user)
      toast.success(`Account created! Welcome, ${user.value.name}!`)
      
      // Analytics
      analytics.signup('email')
      
      // Sentry user context
      setUserContext(user.value)
      
      // Start session monitoring
      startSessionMonitoring()
      
      return true
    } catch (err) {
      error.value = handleError(err)
      toast.error(error.value)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  const loginWithProvider = async (provider: 'github' | 'google') => {
    loading.value = true
    error.value = null
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      
      // Initialize CSRF cookie for Laravel Sanctum
      try {
        await api.get('/sanctum/csrf-cookie')
      } catch (csrfError) {
        console.warn('CSRF cookie initialization failed, continuing anyway:', csrfError)
      }
      
      // Redirect to backend OAuth endpoint
      window.location.href = `${API_BASE_URL}/api/v1/auth/social/${provider}`
    } catch (err) {
      error.value = handleError(err)
      loading.value = false
      throw new Error(error.value)
    }
  }

  const handleOAuthCallback = async (provider: 'github' | 'google', code: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await authApi.handleOAuthCallback(provider, code)
      
      // Save token
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token)
      }
      
      // Save user
      user.value = {
        ...convertUser(response.data.user),
        provider,
      }
      
      toast.success(`Welcome, ${user.value.name}!`)
      
      // Analytics
      analytics.login(provider)
      
      return true
    } catch (err) {
      error.value = handleError(err)
      toast.error('OAuth authentication failed')
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    loading.value = true
    error.value = null
    try {
      const response = await authApi.me()
      user.value = convertUser(response.data)
    } catch (err) {
      error.value = handleError(err)
      // Clear invalid token
      localStorage.removeItem('auth_token')
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await authApi.logout()
      toast.info('Logged out successfully')
      
      // Analytics
      analytics.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      localStorage.removeItem('auth_token')
      sessionStorage.removeItem('intended_route')
      
      // Reset settings to defaults
      const settingsStore = useSettingsStore()
      settingsStore.resetToDefaults()
      
      // Clear Sentry user context
      clearUserContext()
      
      stopSessionMonitoring()
      loading.value = false
    }
  }

  const requestPasswordReset = async (email: string) => {
    loading.value = true
    error.value = null
    try {
      await authApi.forgotPassword(email)
      toast.success('Password reset link sent to your email')
      return true
    } catch (err) {
      error.value = handleError(err)
      toast.error(error.value)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (token: string, email: string, password: string, passwordConfirmation: string) => {
    loading.value = true
    error.value = null
    try {
      await authApi.resetPassword(token, email, password, passwordConfirmation)
      toast.success('Password reset successfully! Please login.')
      return true
    } catch (err) {
      error.value = handleError(err)
      toast.error(error.value)
      throw new Error(error.value)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    loginWithProvider,
    handleOAuthCallback,
    fetchUser,
    logout,
    requestPasswordReset,
    resetPassword,
  }
})
