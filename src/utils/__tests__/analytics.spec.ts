import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initAnalytics, trackPageView, analytics } from '@/utils/analytics'

describe('Analytics Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete (window as any).gtag
    delete (window as any).dataLayer
  })

  it('should initialize Google Analytics', () => {
    const measurementId = 'G-TEST123'
    
    initAnalytics(measurementId)
    
    expect(window.dataLayer).toBeDefined()
    expect(document.querySelector(`script[src*="${measurementId}"]`)).toBeDefined()
  })

  it('should track page view', () => {
    window.gtag = vi.fn()
    
    trackPageView('/test-page', 'Test Page')
    
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/test-page',
      page_title: 'Test Page'
    })
  })

  it('should track login event', () => {
    window.gtag = vi.fn()
    
    analytics.login('email')
    
    expect(window.gtag).toHaveBeenCalledWith('event', 'login', {
      method: 'email'
    })
  })

  it('should track signup event', () => {
    window.gtag = vi.fn()
    
    analytics.signup('google')
    
    expect(window.gtag).toHaveBeenCalledWith('event', 'sign_up', {
      method: 'google'
    })
  })

  it('should track logout event', () => {
    window.gtag = vi.fn()
    
    analytics.logout()
    
    expect(window.gtag).toHaveBeenCalledWith('event', 'logout', undefined)
  })

  it('should track typing test start', () => {
    window.gtag = vi.fn()
    
    analytics.startTest(60)
    
    expect(window.gtag).toHaveBeenCalledWith('event', 'typing_test_start', expect.objectContaining({
      test_duration: 60
    }))
  })

  it('should track typing test completion', () => {
    window.gtag = vi.fn()
    
    analytics.completeTest(75, 95, 60)
    
    expect(window.gtag).toHaveBeenCalledWith('event', 'typing_test_complete', {
      wpm: 75,
      accuracy: 95,
      duration: 60
    })
  })

  it('should not crash if gtag is not defined', () => {
    delete (window as any).gtag
    
    expect(() => {
      analytics.login('email')
      analytics.logout()
      trackPageView('/test')
    }).not.toThrow()
  })
})
