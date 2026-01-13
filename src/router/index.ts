import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import LoginPage from '@/pages/Login.vue'
import SignupPage from '@/pages/Signup.vue'
import ForgotPasswordPage from '@/pages/ForgotPassword.vue'
import AuthCallback from '@/pages/AuthCallback.vue'
import ProfilePage from '@/pages/Profile.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/forgot-password', component: ForgotPasswordPage },
  { path: '/auth/callback/:provider', component: AuthCallback },
  { path: '/profile', component: ProfilePage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
