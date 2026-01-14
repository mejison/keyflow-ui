import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { User as ApiUser } from '@/services/api'

vi.mock('@sentry/vue', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
  setContext: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
  replayIntegration: vi.fn(() => ({}))
}))

import { captureError } from '@/utils/sentry'
import * as Sentry from '@sentry/vue'

describe('Sentry Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should capture errors without crashing', () => {
    const error = new Error('Test error')
    const context = { userId: 123 }
    
    expect(() => captureError(error, context)).not.toThrow()
    expect(vi.mocked(Sentry.captureException)).toHaveBeenCalled()
  })

  it('should call captureException', () => {
    const error = new Error('Test error')
    
    captureError(error)
    
    expect(vi.mocked(Sentry.captureException)).toHaveBeenCalledWith(error)
  })
})
