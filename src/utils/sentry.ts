import * as Sentry from '@sentry/vue'
import type { App } from 'vue'
import type { Router } from 'vue-router'

export const initSentry = (app: App, router: Router) => {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  const environment = import.meta.env.VITE_ENV || 'development'
  
  // Only initialize in production or if DSN is explicitly provided
  if (!dsn) {
    return
  }

  Sentry.init({
    app,
    dsn,
    environment,
    
    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
    
    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    
    // Only send errors in production
    enabled: environment === 'production',
    
    // Filter out known non-critical errors
    beforeSend(event, hint) {
      // Filter out network errors that are already handled
      const error = hint.originalException as Error
      if (error?.message?.includes('Network Error')) {
        return null
      }
      
      // Filter out 404s (already have 404 page)
      if (error?.message?.includes('404')) {
        return null
      }
      
      return event
    },
    
    // Don't log to console in production
    debug: environment !== 'production',
  })
}

// Manual error reporting
export const captureError = (error: Error, context?: Record<string, any>) => {
  if (context) {
    Sentry.setContext('additional', context)
  }
  Sentry.captureException(error)
}

// Set user context for error tracking
export const setUserContext = (user: { id: string | number; email: string; name: string }) => {
  Sentry.setUser({
    id: String(user.id),
    email: user.email,
    username: user.name,
  })
}

// Clear user context on logout
export const clearUserContext = () => {
  Sentry.setUser(null)
}
