// Google Analytics 4 Integration

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

let isInitialized = false

export const initAnalytics = (measurementId: string) => {
  if (!measurementId || isInitialized) return

  // Load gtag.js script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  window.gtag = function() {
    window.dataLayer?.push(arguments)
  }
  
  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: true,
    anonymize_ip: true // GDPR compliance
  })

  isInitialized = true
}

export const trackPageView = (path: string, title?: string) => {
  if (!window.gtag) return
  
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title
  })
}

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (!window.gtag) return
  
  window.gtag('event', eventName, parameters)
}

// Common events
export const analytics = {
  // Auth events
  login: (method: 'email' | 'github' | 'google') => {
    trackEvent('login', { method })
  },
  
  signup: (method: 'email' | 'github' | 'google') => {
    trackEvent('sign_up', { method })
  },
  
  logout: () => {
    trackEvent('logout')
  },

  // Typing test events
  startTest: (duration: number, wordSet: string) => {
    trackEvent('typing_test_start', { 
      test_duration: duration,
      word_set: wordSet
    })
  },

  completeTest: (wpm: number, accuracy: number, duration: number) => {
    trackEvent('typing_test_complete', {
      wpm,
      accuracy,
      duration
    })
  },

  // Settings events
  changeSettings: (setting: string, value: any) => {
    trackEvent('settings_change', {
      setting_name: setting,
      setting_value: value
    })
  },

  // Navigation events
  viewLeaderboard: (period: string, tab: string) => {
    trackEvent('view_leaderboard', {
      period,
      tab
    })
  },

  viewProfile: () => {
    trackEvent('view_profile')
  },

  // Error events
  error: (errorType: string, errorMessage?: string) => {
    trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage
    })
  }
}
