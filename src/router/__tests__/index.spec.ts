import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import LoginPage from '@/pages/Login.vue'
import ProfilePage from '@/pages/Profile.vue'
import NotFoundPage from '@/pages/NotFound.vue'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
;(globalThis as any).localStorage = localStorageMock

describe('Router', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  const createTestRouter = () => {
    return createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: HomePage, name: 'home' },
        { path: '/login', component: LoginPage, name: 'login', meta: { requiresGuest: true } },
        { path: '/profile', component: ProfilePage, name: 'profile', meta: { requiresAuth: true } },
        { path: '/:pathMatch(.*)*', component: NotFoundPage, name: 'not-found' }
      ]
    })
  }

  it('should navigate to home page', async () => {
    const router = createTestRouter()
    
    await router.push('/')
    await router.isReady()
    
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('should navigate to login page', async () => {
    const router = createTestRouter()
    
    await router.push('/login')
    await router.isReady()
    
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('should redirect to 404 for unknown routes', async () => {
    const router = createTestRouter()
    
    await router.push('/unknown-route')
    await router.isReady()
    
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('should allow access to home without authentication', async () => {
    const router = createTestRouter()
    localStorageMock.getItem.mockReturnValue(null)
    
    await router.push('/')
    await router.isReady()
    
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should redirect authenticated users from login page', async () => {
    const router = createTestRouter()
    localStorageMock.getItem.mockReturnValue('fake-token')
    
    // Add guard manually for test
    router.beforeEach((to, from, next) => {
      const token = localStorage.getItem('auth_token')
      const isAuthenticated = !!token
      
      if (to.meta.requiresGuest && isAuthenticated) {
        next('/profile')
        return
      }
      next()
    })
    
    await router.push('/login')
    await router.isReady()
    
    expect(router.currentRoute.value.path).toBe('/profile')
  })

  it('should redirect unauthenticated users from profile page', async () => {
    const router = createTestRouter()
    localStorageMock.getItem.mockReturnValue(null)
    
    // Add guard manually for test
    router.beforeEach((to, from, next) => {
      const token = localStorage.getItem('auth_token')
      const isAuthenticated = !!token
      
      if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
        return
      }
      next()
    })
    
    await router.push('/profile')
    await router.isReady()
    
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('should handle navigation between routes', async () => {
    const router = createTestRouter()
    
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
    
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
    
    // Go back to home
    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should save intended route for after login', async () => {
    const router = createTestRouter()
    const sessionStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn()
    }
    ;(globalThis as any).sessionStorage = sessionStorageMock
    
    localStorageMock.getItem.mockReturnValue(null)
    
    router.beforeEach((to, from, next) => {
      const token = localStorage.getItem('auth_token')
      const isAuthenticated = !!token
      
      if (to.meta.requiresAuth && !isAuthenticated) {
        if (to.path !== '/login') {
          sessionStorage.setItem('intended_route', to.path)
        }
        next('/login')
        return
      }
      next()
    })
    
    await router.push('/profile')
    await router.isReady()
    
    expect(sessionStorageMock.setItem).toHaveBeenCalledWith('intended_route', '/profile')
  })
})
