# KeyFlow UI - API Integration Documentation

## Overview

KeyFlow UI is now fully integrated with the Laravel backend API for authentication, including:
- Email/password authentication (register, login, logout)
- Password reset functionality
- OAuth authentication (Google & GitHub)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000
```

The OAuth credentials are managed on the backend (Laravel), so you don't need to configure them in the frontend.

### 3. Start Development Server

```bash
npm run dev
```

## API Integration

### API Service (`src/services/api.ts`)

The application uses a centralized API service built with Axios that provides:
- Automatic token management
- Request/response interceptors
- Centralized error handling
- Type-safe API methods

#### Key Features:
- **Auto-token injection**: JWT tokens are automatically added to requests
- **401 handling**: Automatic logout and redirect on unauthorized requests
- **CSRF protection**: Compatible with Laravel Sanctum

### Authentication Store (`src/stores/auth.ts`)

The Pinia auth store manages all authentication state and operations:

#### Available Methods:

```typescript
// Email/password authentication
await authStore.login(email, password)
await authStore.signup(name, email, password, passwordConfirmation)
await authStore.logout()

// OAuth authentication
await authStore.loginWithProvider('google' | 'github')
await authStore.handleOAuthCallback(provider, code)

// Password reset
await authStore.requestPasswordReset(email)
await authStore.resetPassword(token, email, password, passwordConfirmation)

// Fetch current user
await authStore.fetchUser()
```

#### State:
- `user`: Current authenticated user or null
- `isAuthenticated`: Boolean computed property
- `loading`: Loading state for async operations
- `error`: Error messages from failed operations

## API Endpoints

All endpoints follow the Laravel API structure:

### Health Check
```
GET /api/health
```

### Authentication

#### Register
```
POST /api/v1/auth/register
Body: { name, email, password, password_confirmation }
Response: { data: { access_token, user } }
```

#### Login
```
POST /api/v1/auth/login
Body: { email, password }
Response: { data: { access_token, user } }
```

#### Get Current User
```
GET /api/v1/auth/me
Headers: Authorization: Bearer {token}
Response: { data: { user } }
```

#### Logout
```
POST /api/v1/auth/logout
Headers: Authorization: Bearer {token}
```

#### Forgot Password
```
POST /api/v1/auth/forgot-password
Body: { email }
```

#### Reset Password
```
POST /api/v1/auth/reset-password
Body: { token, email, password, password_confirmation }
```

### OAuth Authentication

#### Google/GitHub - Get Redirect URL
```
GET /api/v1/auth/social/{provider}
Response: { data: { url } }
```

#### Google/GitHub - Handle Callback
```
GET /api/v1/auth/social/{provider}/callback?code={code}
Response: { data: { access_token, user } }
```

## Pages

### Login (`/login`)
- Email/password login
- OAuth login (Google, GitHub)
- Error handling
- Loading states
- Link to forgot password

### Signup (`/signup`)
- User registration with name, email, password
- Password confirmation validation
- OAuth signup (Google, GitHub)
- Error handling
- Loading states

### Forgot Password (`/forgot-password`)
- Request password reset email
- Success confirmation
- Error handling

### Reset Password (`/reset-password`)
- Form to set new password
- Token validation from email link
- Password confirmation
- Success state with redirect to login

### Profile (`/profile`)
- Display user information
- Auto-fetch user data on mount
- Logout functionality
- Protected route (redirects to login if not authenticated)

### OAuth Callback (`/auth/callback/:provider`)
- Handles OAuth redirect from Google/GitHub
- Exchanges authorization code for access token
- Error handling
- Loading state
- Auto-redirect to profile on success

## OAuth Flow

### Frontend Flow:
1. User clicks "Continue with Google/GitHub"
2. Frontend calls `authStore.loginWithProvider(provider)`
3. Store fetches OAuth redirect URL from backend
4. User is redirected to OAuth provider
5. After authorization, OAuth provider redirects to `/auth/callback/:provider?code={code}`
6. Callback page sends code to backend via `authStore.handleOAuthCallback()`
7. Backend exchanges code for user info and returns access token
8. Frontend stores token and redirects to profile

### Backend Requirements:
Your Laravel backend should handle:
- OAuth credentials configuration (Google Client ID/Secret, GitHub Client ID/Secret)
- OAuth redirect URL generation
- Authorization code exchange
- User creation/authentication
- Token generation

## Error Handling

All pages include comprehensive error handling:
- Display user-friendly error messages
- Handle Laravel validation errors
- Network error handling
- Token expiration handling

## Token Management

- Tokens are stored in `localStorage` as `auth_token`
- Automatically included in API requests via axios interceptor
- Cleared on logout or 401 errors
- Persistent across page refreshes

## Type Safety

The application uses TypeScript with proper types for:
- API requests/responses
- User data
- Auth store state
- Component props and events

## Testing the Integration

### 1. Start Backend
Ensure your Laravel backend is running on `http://localhost:8000`

### 2. Test Email Authentication
- Go to `/signup` and create an account
- Login with credentials at `/login`
- Check profile page displays user info
- Test logout functionality

### 3. Test Password Reset
- Go to `/forgot-password`
- Enter email and request reset
- Check email for reset link
- Click link (should go to `/reset-password?token={token}&email={email}`)
- Set new password
- Login with new password

### 4. Test OAuth
- Click "Continue with Google" or "Continue with GitHub"
- Complete OAuth flow
- Should redirect back and be logged in
- Profile should show OAuth provider badge

## Troubleshooting

### CORS Issues
Make sure your Laravel backend has CORS properly configured for `http://localhost:5173` (Vite's default port)

### 401 Errors
- Check token is being sent in Authorization header
- Verify token hasn't expired
- Ensure Laravel Sanctum is properly configured

### OAuth Not Working
- Verify OAuth credentials in Laravel `.env`
- Check redirect URIs match in OAuth provider settings
- Ensure backend OAuth routes are working

### API Not Found (404)
- Verify backend is running on correct port
- Check `VITE_API_BASE_URL` in `.env`
- Ensure API routes are published in Laravel

## Additional Notes

- The UI uses Tailwind CSS for styling
- Vue Router handles navigation
- Pinia manages state
- All forms include loading states and disable inputs during submission
- OAuth uses backend-managed credentials for security (no client secrets in frontend)
