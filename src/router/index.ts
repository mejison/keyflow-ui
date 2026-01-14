import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import LoginPage from '@/pages/Login.vue'
import SignupPage from '@/pages/Signup.vue'
import ForgotPasswordPage from '@/pages/ForgotPassword.vue'
import ResetPasswordPage from '@/pages/ResetPassword.vue'
import AuthCallback from '@/pages/AuthCallback.vue'
import ProfilePage from '@/pages/Profile.vue'
import LeaderboardPage from '@/pages/Leaderboard.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/forgot-password', component: ForgotPasswordPage },
  { path: '/reset-password', component: ResetPasswordPage },
  { path: '/auth/callback/:provider', component: AuthCallback },
  { path: '/profile', component: ProfilePage },
  { path: '/leaderboard', component: LeaderboardPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
