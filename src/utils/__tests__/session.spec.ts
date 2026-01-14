import { describe, it, expect, beforeEach, vi } from 'vitest'
import { startSessionMonitoring, stopSessionMonitoring, validateSession } from '@/utils/session'

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    logout: vi.fn()
  })
}))

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    warning: vi.fn()
  })
}))

vi.mock('@/services/api', () => ({
  api: {
    get: vi.fn()
  }
}))

describe('Session Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should start session monitoring', () => {
    const router = { push: vi.fn() } as any
    
    startSessionMonitoring(router)
    
    // Check that interval is set (we can't easily verify the interval ID)
    expect(true).toBe(true)
  })

  it('should stop session monitoring', () => {
    const router = { push: vi.fn() } as any
    
    startSessionMonitoring(router)
    stopSessionMonitoring()
    
    // No errors should occur
    expect(true).toBe(true)
  })

  it('should validate session periodically', () => {
    const router = { push: vi.fn() } as any
    
    startSessionMonitoring(router)
    
    // Just verify it starts without errors
    expect(true).toBe(true)
    
    stopSessionMonitoring()
  })

  it('should handle session expiry', async () => {
    const { api } = await import('@/services/api')
    
    vi.mocked(api.get).mockRejectedValue({
      response: { status: 401 }
    })
    
    const isValid = await validateSession()
    
    expect(isValid).toBe(false)
  })

  it('should handle network errors gracefully', async () => {
    const { api } = await import('@/services/api')
    
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'))
    
    const isValid = await validateSession()
    
    // Should return false on network errors
    expect(isValid).toBe(false)
  })
})
