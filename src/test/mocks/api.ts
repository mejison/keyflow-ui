import { vi } from 'vitest'

export const mockAuthApi = {
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getUser: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  handleOAuthCallback: vi.fn(),
}

export const mockTypingTestsApi = {
  submitTest: vi.fn(),
  getStatistics: vi.fn(),
  getRecentActivity: vi.fn(),
}

export const mockSettingsApi = {
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
  resetSettings: vi.fn(),
}

export const mockLeaderboardApi = {
  getTopByWpm: vi.fn(),
  getTopByAccuracy: vi.fn(),
  getTopByTests: vi.fn(),
  getTopByCombined: vi.fn(),
  getUserRank: vi.fn(),
}

export const mockContactApi = {
  sendMessage: vi.fn(),
}
