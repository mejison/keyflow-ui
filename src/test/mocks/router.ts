import { vi } from 'vitest'
import type { Router } from 'vue-router'

export const mockRouter: Router = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  beforeEach: vi.fn(),
  afterEach: vi.fn(),
  currentRoute: {
    value: {
      path: '/',
      name: 'home',
      params: {},
      query: {},
      hash: '',
      fullPath: '/',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
    }
  },
} as any

export const mockRoute = {
  path: '/',
  name: 'home',
  params: {},
  query: {},
  hash: '',
  fullPath: '/',
  matched: [],
  meta: {},
}
