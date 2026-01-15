import axios, { AxiosError } from 'axios'
import { useToast } from '@/composables/useToast'
import { RateLimiter } from '@/utils/rateLimiter'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// Create rate limiter instance (max 1 request per second)
const rateLimiter = new RateLimiter(1000, 20)

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For Laravel Sanctum CSRF protection
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const toast = useToast()
    const status = error.response?.status
    const message = (error.response?.data as any)?.message

    // Network error (no response)
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
      return Promise.reject(error)
    }

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - session expired
        const token = localStorage.getItem('auth_token')
        if (token && !window.location.pathname.includes('/login')) {
          // Save intended destination for redirect after login
          const intendedRoute = window.location.pathname + window.location.search
          if (intendedRoute !== '/' && !intendedRoute.includes('/login')) {
            sessionStorage.setItem('intended_route', intendedRoute)
          }
          
          // Clear auth state
          localStorage.removeItem('auth_token')
          
          // Notify user
          toast.error('Session expired. Please login again.')
          
          // Redirect to login
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
        }
        break

      case 403:
        toast.error('Access denied. You don\'t have permission.')
        break

      case 404:
        // Only show toast for API 404s, not route 404s
        if (error.config?.url) {
          toast.error('Resource not found.')
        }
        break

      case 422:
        // Validation errors - handled by individual forms
        // Don't show global toast for these
        break

      case 429:
        toast.warning('Too many requests. Please slow down.')
        break

      case 500:
        toast.error(message || 'Server error. Please try again later.')
        break

      case 502:
      case 503:
        toast.error('Service temporarily unavailable. Please try again.')
        break

      case 504:
        toast.error('Request timeout. Please try again.')
        break

      default:
        // Generic error for other status codes
        if (status && status >= 400) {
          toast.error(message || 'Something went wrong. Please try again.')
        }
    }

    return Promise.reject(error)
  }
)

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: {
    id: number
    name: string
    email: string
    avatar?: string
  }
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  provider?: string
}

// Typing Test types
export interface TypingTest {
  id: number
  wpm: number
  accuracy: number
  duration: number
  correct_words: number
  incorrect_words: number
  total_words: number
  text_content?: string
  created_at: string
}

export interface TypingStatistics {
  best_wpm: number
  avg_wpm: number
  avg_accuracy: number
  tests_taken: number
  total_words_typed: number
  total_time: number
}

export interface RecentActivity {
  id: number
  wpm: number
  accuracy: number
  created_at: string
}

export interface PersonalBests {
  best_wpm: {
    wpm: number
    accuracy: number
    created_at: string
  }
  best_accuracy: {
    wpm: number
    accuracy: number
    created_at: string
  }
}

export interface Progress {
  date: string
  average_wpm: number
  average_accuracy: number
  tests_count: number
}

export interface LeaderboardEntry {
  rank: number
  user: {
    id: number
    name: string
    avatar?: string
  }
  best_wpm?: number
  avg_wpm?: number
  avg_accuracy?: number
  total_tests?: number
  combined_score?: number
}

export interface UserRank {
  ranks: {
    wpm: number | null
    accuracy: number | null
    tests: number | null
    combined: number | null
  }
  period: string
}

// Auth API methods
export const authApi = {
  // Register new user
  register: async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.data
  },

  // Login with email and password
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', {
      email,
      password,
    })
    return response.data
  },

  // Get current user
  me: async () => {
    const response = await api.get<ApiResponse<User>>('/api/v1/auth/me')
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/v1/auth/logout')
    return response.data
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    const response = await api.post('/api/v1/auth/forgot-password', {
      email,
    })
    return response.data
  },

  // Reset password
  resetPassword: async (token: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await api.post('/api/v1/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })
    return response.data
  },

  // Get OAuth redirect URL
  getOAuthRedirectUrl: async (provider: 'google' | 'github') => {
    const response = await api.get<ApiResponse<{ url: string }>>(`/api/v1/auth/social/${provider}`)
    return response.data
  },

  // Handle OAuth callback
  handleOAuthCallback: async (provider: 'google' | 'github', code: string) => {
    const response = await api.get<ApiResponse<AuthResponse>>(
      `/api/v1/auth/social/${provider}/callback`,
      {
        params: { code },
      }
    )
    return response.data
  },
}

// Typing Tests API methods with rate limiting
export const typingTestsApi = {
  // Save typing test result
  saveTest: async (data: {
    wpm: number
    accuracy: number
    duration: number
    correct_words: number
    incorrect_words: number
    total_words: number
    text_content?: string
  }) => {
    return rateLimiter.execute(async () => {
      const response = await api.post<ApiResponse<TypingTest>>('/api/v1/typing-tests', data)
      return response.data
    })
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get<ApiResponse<TypingStatistics>>('/api/v1/typing-tests/statistics')
    return response.data
  },

  // Get recent activity
  getRecentActivity: async (limit: number = 10) => {
    const response = await api.get<ApiResponse<RecentActivity[]>>('/api/v1/typing-tests/recent-activity', {
      params: { limit }
    })
    return response.data
  },

  // Get progress
  getProgress: async (days: number = 30) => {
    const response = await api.get<ApiResponse<Progress[]>>('/api/v1/typing-tests/progress', {
      params: { days }
    })
    return response.data
  },

  // Get personal bests
  getPersonalBests: async () => {
    const response = await api.get<ApiResponse<PersonalBests>>('/api/v1/typing-tests/personal-bests')
    return response.data
  },

  // Get all tests (paginated)
  getAllTests: async (perPage: number = 15, page: number = 1) => {
    const response = await api.get<ApiResponse<{ data: TypingTest[], total: number }>>('/api/v1/typing-tests', {
      params: { per_page: perPage, page }
    })
    return response.data
  },

  // Get single test
  getTest: async (id: number) => {
    const response = await api.get<ApiResponse<TypingTest>>(`/api/v1/typing-tests/${id}`)
    return response.data
  },

  // Delete test
  deleteTest: async (id: number) => {
    const response = await api.delete(`/api/v1/typing-tests/${id}`)
    return response.data
  },
}

// Leaderboard API methods
export const leaderboardApi = {
  // Get top by WPM
  getTopByWpm: async (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all', limit: number = 50) => {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/api/v1/leaderboard/wpm', {
      params: { period, limit }
    })
    return response.data
  },

  // Get top by accuracy
  getTopByAccuracy: async (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all', limit: number = 50, minTests: number = 5) => {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/api/v1/leaderboard/accuracy', {
      params: { period, limit, min_tests: minTests }
    })
    return response.data
  },

  // Get top by tests taken
  getTopByTests: async (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all', limit: number = 50) => {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/api/v1/leaderboard/tests', {
      params: { period, limit }
    })
    return response.data
  },

  // Get top by combined score
  getTopByCombined: async (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all', limit: number = 50, minTests: number = 5) => {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>('/api/v1/leaderboard/combined', {
      params: { period, limit, min_tests: minTests }
    })
    return response.data
  },

  // Get my rank (requires auth)
  getMyRank: async (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all') => {
    const response = await api.get<ApiResponse<UserRank>>('/api/v1/leaderboard/my-rank', {
      params: { period }
    })
    return response.data
  },
}

// Settings API methods
export const settingsApi = {
  // Get user settings
  getSettings: async () => {
    const response = await api.get<ApiResponse<{
      test_duration: number
      show_errors: boolean
      sound_enabled: boolean
      smooth_caret: boolean
      quick_restart: boolean
      font_size: string
    }>>('/api/v1/settings')
    return response.data
  },

  // Update settings
  updateSettings: async (settings: {
    test_duration?: number
    show_errors?: boolean
    sound_enabled?: boolean
    smooth_caret?: boolean
    quick_restart?: boolean
    font_size?: string
  }) => {
    const response = await api.put<ApiResponse<{
      test_duration: number
      show_errors: boolean
      sound_enabled: boolean
      smooth_caret: boolean
      quick_restart: boolean
      font_size: string
    }>>('/api/v1/settings', settings)
    return response.data
  },

  // Reset settings to defaults
  resetSettings: async () => {
    const response = await api.delete<ApiResponse<{
      test_duration: number
      show_errors: boolean
      sound_enabled: boolean
      smooth_caret: boolean
      quick_restart: boolean
      font_size: string
    }>>('/api/v1/settings')
    return response.data
  },
}

// Health check
export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

export default api
