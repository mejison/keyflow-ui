import { createRouter, createWebHistory } from 'vue-router'

// Lazy load components for better performance
const HomePage = () => import('@/pages/Home.vue')
const LoginPage = () => import('@/pages/Login.vue')
const SignupPage = () => import('@/pages/Signup.vue')
const ForgotPasswordPage = () => import('@/pages/ForgotPassword.vue')
const ResetPasswordPage = () => import('@/pages/ResetPassword.vue')
const AuthCallback = () => import('@/pages/AuthCallback.vue')
const ProfilePage = () => import('@/pages/Profile.vue')
const LeaderboardPage = () => import('@/pages/Leaderboard.vue')
const SettingsPage = () => import('@/pages/Settings.vue')
const PrivacyPolicyPage = () => import('@/pages/PrivacyPolicy.vue')
const SecurityPolicyPage = () => import('@/pages/SecurityPolicy.vue')
const TermsOfServicePage = () => import('@/pages/TermsOfService.vue')
const NotFoundPage = () => import('@/pages/NotFound.vue')

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage, meta: { requiresGuest: true } },
  { path: '/signup', component: SignupPage, meta: { requiresGuest: true } },
  { path: '/forgot-password', component: ForgotPasswordPage, meta: { requiresGuest: true } },
  { path: '/reset-password', component: ResetPasswordPage },
  { path: '/auth/callback/:provider', component: AuthCallback },
  { path: '/profile', component: ProfilePage, meta: { requiresAuth: true } },
  { path: '/leaderboard', component: LeaderboardPage },
  { path: '/settings', component: SettingsPage },
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
router.beforeEach((to, _from, next) => {
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
