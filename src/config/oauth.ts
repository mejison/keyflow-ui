export const oauthConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
    redirectUri: `${window.location.origin}/auth/callback/google`,
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    authUrl: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
    redirectUri: `${window.location.origin}/auth/callback/github`,
  },
}

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
