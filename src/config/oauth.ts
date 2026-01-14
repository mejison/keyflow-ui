export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const oauthConfig = {
  google: {
    redirectUri: `${window.location.origin}/auth/callback/google`,
  },
  github: {
    redirectUri: `${window.location.origin}/auth/callback/github`,
  },
}
