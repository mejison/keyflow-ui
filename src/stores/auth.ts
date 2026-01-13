import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { oauthConfig, API_BASE_URL } from '@/config/oauth'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  provider: 'email' | 'github' | 'google'
}

// Helper to generate random state for CSRF protection
const generateState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const login = (email: string, password: string) => {
    // TODO: Implement real authentication
    console.log('Login with email:', email, password)
    user.value = {
      id: '1',
      name: 'John Doe',
      email: email,
      provider: 'email'
    }
  }

  const signup = (name: string, email: string, password: string) => {
    // TODO: Implement real signup
    console.log('Signup:', name, email, password)
    user.value = {
      id: '1',
      name: name,
      email: email,
      provider: 'email'
    }
  }

  const loginWithProvider = (provider: 'github' | 'google') => {
    const config = oauthConfig[provider]
    
    // Generate and save state for CSRF protection
    const state = generateState()
    sessionStorage.setItem('oauth_state', state)
    
    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      state,
      response_type: 'code',
    })
    
    // Add provider-specific parameters
    if (provider === 'google') {
      params.append('access_type', 'offline')
      params.append('prompt', 'consent')
    }
    
    // Redirect to OAuth provider
    window.location.href = `${config.authUrl}?${params.toString()}`
  }

  const handleOAuthCallback = async (provider: 'github' | 'google', code: string) => {
    try {
      // Send authorization code to backend
      const response = await fetch(`${API_BASE_URL}/auth/${provider}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const data = await response.json()
      
      // Save user data and token
      user.value = data.user
      if (data.token) {
        localStorage.setItem('auth_token', data.token)
      }
    } catch (error) {
      console.error('OAuth callback error:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('auth_token')
  }

  const requestPasswordReset = (email: string) => {
    // TODO: Implement real password reset
    console.log('Password reset requested for:', email)
  }

  return {
    user,
    isAuthenticated,
    login,
    signup,
    loginWithProvider,
    handleOAuthCallback,
    logout,
    requestPasswordReset,
  }
})
