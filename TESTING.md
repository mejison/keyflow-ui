# Testing Guide

## Overview
Цей проект використовує [Vitest](https://vitest.dev/) для unit та integration тестів Vue компонентів, stores, composables та утиліт.

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   └── __tests__/
│       ├── Header.spec.ts
│       ├── StatsBar.spec.ts
│       └── ToastContainer.spec.ts
├── composables/
│   └── __tests__/
│       ├── useToast.spec.ts
│       └── useMeta.spec.ts
├── stores/
│   └── __tests__/
│       ├── auth.spec.ts
│       ├── typing.spec.ts
│       └── settings.spec.ts
├── utils/
│   └── __tests__/
│       ├── analytics.spec.ts
│       ├── session.spec.ts
│       └── sentry.spec.ts
├── router/
│   └── __tests__/
│       └── index.spec.ts
└── test/
    ├── setup.ts
    └── mocks/
        ├── api.ts
        └── router.ts
```

## What's Tested

### ✅ Stores (Pinia)
- **Auth Store**: Login, signup, logout, user management
- **Typing Store**: Test logic, WPM calculation, accuracy tracking
- **Settings Store**: Settings load/save, API conversion

### ✅ Composables
- **useToast**: Toast notifications, auto-dismiss, multiple toasts
- **useMeta**: Dynamic meta tags, SEO optimization

### ✅ Components
- **Header**: Authentication state, user menu, navigation
- **StatsBar**: Test results display, stats visibility
- **ToastContainer**: Toast rendering, close functionality

### ✅ Utils
- **Analytics**: Google Analytics tracking, event logging
- **Session**: Session monitoring, validation, expiry handling
- **Sentry**: Error tracking, user context

### ✅ Router
- Route guards, authentication redirects, 404 handling

### ✅ API Service
- Request interceptors, error handling, token management

## Writing Tests

### Component Test Example
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Expected text')
  })
})
```

### Store Test Example
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '@/stores/myStore'

describe('My Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should update state', () => {
    const store = useMyStore()
    store.updateValue(123)
    expect(store.value).toBe(123)
  })
})
```

## Mocking

### API Mocks
```typescript
import { mockAuthApi } from '@/test/mocks/api'

mockAuthApi.login.mockResolvedValue({
  data: { token: 'test-token', user: { id: 1 } }
})
```

### Router Mocks
```typescript
import { mockRouter } from '@/test/mocks/router'

mockRouter.push('/profile')
expect(mockRouter.push).toHaveBeenCalledWith('/profile')
```

## Coverage

Current coverage targets:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

View coverage report:
```bash
npm run test:coverage
open coverage/index.html
```

## Best Practices

1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Keep tests isolated and independent**
4. **Mock external dependencies**
5. **Test edge cases and error handling**
6. **Maintain test coverage above 80%**

## CI/CD Integration

Tests run automatically on:
- Every commit to main branch
- Pull requests
- Pre-deployment checks

## Troubleshooting

### Tests not running?
```bash
# Clear cache
npm run test -- --clearCache

# Update snapshots
npm run test -- --updateSnapshot
```

### Module not found?
Check `vitest.config.ts` path aliases match `tsconfig.json`

### Async issues?
Use `await wrapper.vm.$nextTick()` for Vue reactivity
Use `await vi.runAllTimersAsync()` for timers

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)
