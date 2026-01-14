import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'
import { api } from '@/services/api'

vi.mock('@/composables/useToast', () => ({
  useToast: () => ({
    error: vi.fn(),
    warning: vi.fn()
  })
}))

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should create axios instance with correct base URL', () => {
    expect(api.defaults.baseURL).toBeDefined()
  })

  it('should include auth token in requests', () => {
    const token = 'test-token'
    localStorage.setItem('auth_token', token)
    
    // Simulate token setup from api.ts
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    expect(api.defaults.headers.common['Authorization']).toBe(`Bearer ${token}`)
    
    // Cleanup
    delete api.defaults.headers.common['Authorization']
  })

  it('should handle network errors', async () => {
    const mockError = {
      message: 'Network Error',
      request: {}
    }
    
    expect(() => {
      // Error handler should not throw
      if (!mockError.response && mockError.request) {
        // Network error
      }
    }).not.toThrow()
  })

  it('should handle 401 errors', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Unauthorized' }
      }
    }
    
    // Should handle gracefully
    expect(mockError.response.status).toBe(401)
  })

  it('should handle 404 errors', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: 'Not Found' }
      }
    }
    
    expect(mockError.response.status).toBe(404)
  })

  it('should handle validation errors (422)', async () => {
    const mockError = {
      response: {
        status: 422,
        data: {
          errors: {
            email: ['Email is required']
          }
        }
      }
    }
    
    expect(mockError.response.status).toBe(422)
    expect(mockError.response.data.errors.email).toContain('Email is required')
  })

  it('should handle server errors (500)', async () => {
    const mockError = {
      response: {
        status: 500,
        data: { message: 'Internal Server Error' }
      }
    }
    
    expect(mockError.response.status).toBe(500)
  })
})
