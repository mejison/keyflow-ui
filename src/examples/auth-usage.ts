// Example usage of the Auth API in KeyFlow UI
// This file demonstrates how to use the authentication functionality

import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// ============================================
// USAGE EXAMPLES
// ============================================

export const authExamples = {
  
  // 1. LOGIN WITH EMAIL/PASSWORD
  async loginExample() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    try {
      await authStore.login('user@example.com', 'password123')
      
      // After successful login:
      // - Token is saved to localStorage
      // - User data is available in authStore.user
      // - authStore.isAuthenticated is true
      
      router.push('/profile')
    } catch (error: any) {
      // Error is available in authStore.error
      console.error('Login failed:', error.message)
    }
  },

  // 2. REGISTER NEW USER
  async signupExample() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    try {
      await authStore.signup(
        'John Doe',                  // name
        'john@example.com',          // email
        'password123',               // password
        'password123'                // password confirmation
      )
      
      // After successful signup:
      // - User is automatically logged in
      // - Token is saved
      // - User data is available
      
      router.push('/profile')
    } catch (error: any) {
      console.error('Signup failed:', error.message)
    }
  },

  // 3. OAUTH LOGIN (GOOGLE/GITHUB)
  async oauthExample() {
    const authStore = useAuthStore()
    
    try {
      // This will redirect to OAuth provider
      await authStore.loginWithProvider('google') // or 'github'
      
      // User will be redirected to Google/GitHub
      // After authorization, they'll come back to /auth/callback/:provider
      // The callback page handles the rest
    } catch (error: any) {
      console.error('OAuth failed:', error.message)
    }
  },

  // 4. LOGOUT
  async logoutExample() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    await authStore.logout()
    
    // After logout:
    // - Token is removed from localStorage
    // - User data is cleared
    // - authStore.isAuthenticated is false
    
    router.push('/')
  },

  // 5. REQUEST PASSWORD RESET
  async forgotPasswordExample() {
    const authStore = useAuthStore()
    
    try {
      await authStore.requestPasswordReset('user@example.com')
      
      // Email will be sent with reset link
      // Link format: /reset-password?token={token}&email={email}
      
      console.log('Reset email sent!')
    } catch (error: any) {
      console.error('Failed to send reset email:', error.message)
    }
  },

  // 6. RESET PASSWORD (from email link)
  async resetPasswordExample() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    // Get token and email from URL query params
    const token = 'token_from_email'
    const email = 'user@example.com'
    
    try {
      await authStore.resetPassword(
        token,                      // token from email
        email,                      // email
        'newpassword123',          // new password
        'newpassword123'           // password confirmation
      )
      
      console.log('Password reset successful!')
      router.push('/login')
    } catch (error: any) {
      console.error('Password reset failed:', error.message)
    }
  },

  // 7. FETCH CURRENT USER (refresh user data)
  async fetchUserExample() {
    const authStore = useAuthStore()
    
    // Check if we have a token but no user data
    const token = localStorage.getItem('auth_token')
    if (token && !authStore.user) {
      await authStore.fetchUser()
      
      // Now authStore.user contains current user data
    }
  },

  // 8. CHECK AUTHENTICATION STATUS
  checkAuthExample() {
    const authStore = useAuthStore()
    
    if (authStore.isAuthenticated) {
      console.log('User is logged in:', authStore.user)
    } else {
      console.log('User is not logged in')
    }
  },

  // 9. HANDLE LOADING STATES
  withLoadingExample() {
    const authStore = useAuthStore()
    
    // authStore.loading is automatically managed
    // It's true during async operations
    
    if (authStore.loading) {
      console.log('Loading...')
      // Show spinner, disable buttons, etc.
    }
  },

  // 10. HANDLE ERRORS
  errorHandlingExample() {
    const authStore = useAuthStore()
    
    // authStore.error contains the last error message
    // It's automatically set when operations fail
    
    if (authStore.error) {
      console.log('Error:', authStore.error)
      // Display error to user
    }
  }
}

// ============================================
// COMPONENT USAGE EXAMPLE
// ============================================

// Example Vue component using the auth store
export const componentExample = `
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      
      <button type="submit" :disabled="authStore.loading">
        <span v-if="!authStore.loading">Login</span>
        <span v-else>Loading...</span>
      </button>
      
      <div v-if="authStore.error" class="error">
        {{ authStore.error }}
      </div>
    </form>
    
    <button @click="loginWithGoogle">
      Continue with Google
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
    router.push('/profile')
  } catch (error: any) {
    // Error is already in authStore.error
    console.error(error)
  }
}

const loginWithGoogle = async () => {
  try {
    await authStore.loginWithProvider('google')
    // Will redirect to Google
  } catch (error: any) {
    console.error(error)
  }
}
</script>
`

// ============================================
// PROTECTED ROUTE EXAMPLE
// ============================================

export const protectedRouteExample = `
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  // Check if we have a token but no user data
  const token = localStorage.getItem('auth_token')
  if (token && !authStore.user) {
    await authStore.fetchUser()
  }
  
  // Redirect if not authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>
`

// ============================================
// API RESPONSE TYPES
// ============================================

export interface AuthResponse {
  data: {
    access_token: string
    token_type: string
    user: {
      id: number
      name: string
      email: string
      avatar?: string
    }
  }
}

export interface User {
  id: number | string
  name: string
  email: string
  avatar?: string
  provider?: 'email' | 'github' | 'google'
}

// ============================================
// NOTES
// ============================================

/*
IMPORTANT NOTES:

1. Token Management:
   - Tokens are stored in localStorage as 'auth_token'
   - Automatically included in all API requests
   - Cleared on logout or 401 errors

2. Error Handling:
   - All methods throw errors that can be caught
   - Errors are also stored in authStore.error
   - Display errors to users from authStore.error

3. Loading States:
   - authStore.loading is true during async operations
   - Use it to disable buttons and show loaders

4. OAuth Flow:
   - OAuth credentials are configured on the backend
   - Frontend only needs to call loginWithProvider()
   - Callback is handled automatically by AuthCallback page

5. Password Reset:
   - Users receive email with token
   - Token is in URL query params
   - Use resetPassword() with token from URL

6. User Data:
   - Available in authStore.user after login
   - Null when not authenticated
   - Automatically fetched when needed

7. TypeScript:
   - All methods are fully typed
   - Use the User interface for type safety
   - Import types from the store or api service
*/
