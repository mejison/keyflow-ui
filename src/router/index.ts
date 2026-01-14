import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import LoginPage from '@/pages/Login.vue'
import SignupPage from '@/pages/Signup.vue'
import ForgotPasswordPage from '@/pages/ForgotPassword.vue'
import ResetPasswordPage from '@/pages/ResetPassword.vue'
import AuthCallback from '@/pages/AuthCallback.vue'
import ProfilePage from '@/pages/Profile.vue'
import LeaderboardPage from '@/pages/Leaderboard.vue'
import SettingsPage from '@/pages/Settings.vue'
import PrivacyPolicyPage from '@/pages/PrivacyPolicy.vue'
import SecurityPolicyPage from '@/pages/SecurityPolicy.vue'
import TermsOfServicePage from '@/pages/TermsOfService.vue'
import NotFoundPage from '@/pages/NotFound.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/signup', component: SignupPage, meta: { requiresGuest: true } },
  { path: '/forgot-password', component: ForgotPasswordPage, meta: { requiresGuest: true } },
  { path: '/reset-password', component: ResetPasswordPage },
  { path: '/auth/callback/:provider', component: AuthCallback },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/leaderboard', component: LeaderboardPage },
  { path: '/settings', component: SettingsPage, meta: { requiresAuth: true } },
  { path: '/privacy-policy', component: PrivacyPolicyPage },
  { path: '/security-policy', component: SecurityPolicyPage },
  { path: '/terms-of-service', component: TermsOfServicePage },
  // 404 - Must be last
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Route guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

  // Redirect authenticated users away from auth pages
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/profile')
    return
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Save intended destination for after login
    if (to.path !== '/login') {
      sessionStorage.setItem('intended_route', to.fullPath)
    }
    next('/login')
    return
  }

  next()
})

// Restore intended route after login
router.afterEach((to) => {
  if (to.path === '/profile' || to.path === '/') {
    const intendedRoute = sessionStorage.getItem('intended_route')
    if (intendedRoute && intendedRoute !== to.path) {
      sessionStorage.removeItem('intended_route')
      router.push(intendedRoute)
    }
  }
})
