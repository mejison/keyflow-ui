# Keyflow - OAuth Setup Guide

## Налаштування OAuth Авторизації

### Структура OAuth Flow

1. **User clicks OAuth button** → Frontend generates state & redirects to provider
2. **User authenticates** → Provider redirects back with authorization code
3. **Frontend receives code** → Sends to backend `/auth/{provider}/callback`
4. **Backend exchanges code** → Gets access token & user info from provider
5. **Backend returns JWT** → Frontend stores token & user data

---

## Frontend Setup (Вже готово ✅)

### 1. Конфігураційні файли:
- [src/config/oauth.ts](src/config/oauth.ts) - OAuth URLs та client IDs
- [src/pages/AuthCallback.vue](src/pages/AuthCallback.vue) - Обробка відповіді від провайдера
- [src/stores/auth.ts](src/stores/auth.ts) - OAuth методи та state management

### 2. Environment Variables:
Скопіюйте `.env.example` в `.env` і додайте справжні ключі:

```bash
cp .env.example .env
```

---

## Backend Setup (Треба реалізувати 🔧)

### Google OAuth

**1. Отримайте Client ID:**
- Відкрийте [Google Cloud Console](https://console.cloud.google.com/)
- Створіть новий проект або виберіть існуючий
- Перейдіть: APIs & Services → Credentials
- Create Credentials → OAuth 2.0 Client ID
- Application type: Web application
- Authorized redirect URIs: 
  - Development: `http://localhost:5173/auth/callback/google`
  - Production: `https://yourdomain.com/auth/callback/google`

**2. Backend API Endpoint:**
```typescript
POST /auth/google/callback
Body: { code: string }

Response: {
  user: {
    id: string,
    name: string,
    email: string,
    avatar?: string,
    provider: 'google'
  },
  token: string  // JWT token
}
```

**3. Backend Implementation Steps:**
```typescript
// 1. Exchange code for access token
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  body: JSON.stringify({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'http://localhost:5173/auth/callback/google',
    grant_type: 'authorization_code'
  })
})

// 2. Get user info
const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
})

// 3. Create or update user in database
// 4. Generate JWT token
// 5. Return user + token
```

---

### GitHub OAuth

**1. Отримайте Client ID:**
- Відкрийте [GitHub Developer Settings](https://github.com/settings/developers)
- New OAuth App
- Application name: Keyflow
- Homepage URL: `http://localhost:5173`
- Authorization callback URL:
  - Development: `http://localhost:5173/auth/callback/github`
  - Production: `https://yourdomain.com/auth/callback/github`

**2. Backend API Endpoint:**
```typescript
POST /auth/github/callback
Body: { code: string }

Response: {
  user: {
    id: string,
    name: string,
    email: string,
    avatar?: string,
    provider: 'github'
  },
  token: string  // JWT token
}
```

**3. Backend Implementation Steps:**
```typescript
// 1. Exchange code for access token
const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
  method: 'POST',
  headers: { Accept: 'application/json' },
  body: JSON.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    redirect_uri: 'http://localhost:5173/auth/callback/github'
  })
})

// 2. Get user info
const userResponse = await fetch('https://api.github.com/user', {
  headers: { 
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/vnd.github.v3+json'
  }
})

// 3. Get user email (if not public)
const emailResponse = await fetch('https://api.github.com/user/emails', {
  headers: { Authorization: `Bearer ${accessToken}` }
})

// 4. Create or update user in database
// 5. Generate JWT token
// 6. Return user + token
```

---

## .env Configuration

### Frontend (.env):
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_API_BASE_URL=http://localhost:3000
```

### Backend (.env):
```bash
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret_key
```

---

## Testing Flow

1. Start backend: `npm run dev` (port 3000)
2. Start frontend: `npm run dev` (port 5173)
3. Click "Continue with Google/GitHub"
4. Authenticate on provider's site
5. Get redirected to `/auth/callback/{provider}`
6. Check Network tab for POST to backend
7. Should redirect to `/profile` with user data

---

## Security Checklist

✅ State parameter used for CSRF protection  
✅ Authorization code exchanged on backend (not frontend)  
✅ Client secrets stored only on backend  
✅ JWT tokens stored in localStorage  
✅ Redirect URIs validated on provider side  
✅ HTTPS required in production  

---

## Routes

- `/login` - Login page з OAuth кнопками
- `/signup` - Signup page з OAuth кнопками
- `/auth/callback/google` - Google OAuth callback
- `/auth/callback/github` - GitHub OAuth callback
- `/profile` - User profile (requires auth)

---

## Next Steps

1. ✅ Frontend OAuth реалізовано
2. 🔧 Створити backend endpoints:
   - `POST /auth/google/callback`
   - `POST /auth/github/callback`
3. 🔧 Додати справжні Client IDs в `.env`
4. 🔧 Налаштувати redirect URIs на Google/GitHub
5. 🔧 Імплементувати JWT authentication на backend
6. 🔧 Додати database для збереження користувачів
