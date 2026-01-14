import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    me: vi.fn()
  },
  api: {
    defaults: { headers: { common: {} } }
  }
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn()
  })
}))

vi.mock('@/utils/session', () => ({
  startSessionMonitoring: vi.fn(),
  stopSessionMonitoring: vi.fn()
}))

vi.mock('@/utils/analytics', () => ({
  analytics: {
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn()
  }
}))

vi.mock('@/utils/sentry', () => ({
  setUserContext: vi.fn(),
  clearUserContext: vi.fn()
}))

import { useAuthStore } from '../auth'
import { authApi } from '@/services/api'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with no user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should login successfully', async () => {
    const store = useAuthStore()
    const mockUser = { 
      id: 1, 
      name: 'Test User',
      email: 'test@test.com',
      avatar: undefined,
      provider: 'email'
    }
    
    vi.mocked(authApi.login).mockResolvedValue({
      data: {
        access_token: 'test-token',
        user: mockUser
      }
    } as any)

    await store.login('test@test.com', 'password')

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should handle login error', async () => {
    const store = useAuthStore()
    
    vi.mocked(authApi.login).mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    })

    await expect(store.login('test@test.com', 'wrong'))
      .rejects.toThrow()
    
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should signup successfully', async () => {
    const store = useAuthStore()
    const mockUser = { 
      id: 1, 
      name: 'New User',
      email: 'new@test.com',
      avatar: undefined,
      provider: 'email'
    }
    
    vi.mocked(authApi.register).mockResolvedValue({
      data: {
        access_token: 'test-token',
        user: mockUser
      }
    } as any)

    await store.signup('new@test.com', 'newuser', 'password')

    expect(store.user).toEqual(mockUser)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should logout successfully', async () => {
    const store = useAuthStore()
    store.user = { 
      id: 1, 
      name: 'Test User',
      email: 'test@test.com',
      avatar: undefined,
      provider: 'email'
    }
    
    vi.mocked(authApi.logout).mockResolvedValue({ data: { message: 'Logged out' } } as any)

    await store.logout()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it.skip('should fetch user data', async () => {
    localStorage.setItem('auth_token', 'test-token')
    const mockUser = { 
      id: 1, 
      name: 'Test User',
      email: 'test@test.com',
      avatar: undefined,
      provider: 'email'
    }
    
    vi.mocked(authApi.me).mockResolvedValue({ data: mockUser } as any)
    
    const store = useAuthStore()
    await store.fetchUser()

    expect(store.user).toEqual(mockUser)
  })

  it('should check if user is authenticated', () => {
    const store = useAuthStore()
    
    expect(store.isAuthenticated).toBe(false)
    
    store.user = { 
      id: 1, 
      name: 'Test User',
      email: 'test@test.com',
      avatar: undefined,
      provider: 'email'
    }
    expect(store.isAuthenticated).toBe(true)
  })
})
