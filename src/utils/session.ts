// Session management utilities
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

// Periodic session validation (every 5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutes
let sessionCheckTimer: number | null = null

export const startSessionMonitoring = () => {
  // Clear existing timer if any
  if (sessionCheckTimer) {
    clearInterval(sessionCheckTimer)
  }

  // Check session validity periodically
  sessionCheckTimer = window.setInterval(async () => {
    const token = localStorage.getItem('auth_token')
    
    if (token) {
      const authStore = useAuthStore()
      
      // Try to fetch user to validate session
      try {
        await authStore.fetchUser()
      } catch (error) {
        // Session invalid - will be handled by axios interceptor
      }
    } else {
      // No token, stop monitoring
      stopSessionMonitoring()
    }
  }, SESSION_CHECK_INTERVAL)
}

export const stopSessionMonitoring = () => {
  if (sessionCheckTimer) {
    clearInterval(sessionCheckTimer)
    sessionCheckTimer = null
  }
}

// Check if user is truly authenticated (not just has token)
export const validateSession = async (): Promise<boolean> => {
  const token = localStorage.getItem('auth_token')
  
  if (!token) {
    return false
  }

  try {
    const authStore = useAuthStore()
    await authStore.fetchUser()
    return true
  } catch (error) {
    // Session invalid
    localStorage.removeItem('auth_token')
    return false
  }
}

// Handle session expiry gracefully
export const handleSessionExpiry = () => {
  const toast = useToast()
  
  // Clear auth data
  localStorage.removeItem('auth_token')
  
  // Save current route for redirect after re-login
  const currentPath = window.location.pathname + window.location.search
  if (currentPath !== '/' && !currentPath.includes('/login')) {
    sessionStorage.setItem('intended_route', currentPath)
  }
  
  // Notify user
  toast.warning('Your session has expired. Please login again.')
  
  // Redirect to login after a short delay
  setTimeout(() => {
    window.location.href = '/login'
  }, 1500)
}
