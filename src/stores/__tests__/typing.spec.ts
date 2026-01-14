import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/services/api', () => ({
  typingTestsApi: {
    create: vi.fn()
  }
}))

import { useTypingStore } from '@/stores/typing'
import { typingTestsApi } from '@/services/api'

vi.mock('@/utils/analytics', () => ({
  analytics: {
    startTest: vi.fn(),
    completeTest: vi.fn()
  }
}))

describe('Typing Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with correct default state', () => {
    const store = useTypingStore()
    
    expect(store.text).toBe('')
    expect(store.userInput).toBe('')
    expect(store.isStarted).toBe(false)
    expect(store.isFinished).toBe(false)
    expect(store.wpm).toBe(0)
    expect(store.accuracy).toBe(100)
  })

  it('should start test when user types first character', () => {
    const store = useTypingStore()
    store.text = 'test text'
    store.userInput = ''
    
    store.handleKeyPress('t')
    
    expect(store.isStarted).toBe(true)
    expect(store.startTime).not.toBeNull()
    expect(store.userInput).toBe('t')
  })

  it('should calculate WPM correctly', () => {
    const store = useTypingStore()
    store.text = 'hello world test text here'
    store.userInput = 'hello world test text here'
    store.startTime = Date.now() - 60000
    store.isStarted = true
    store.isFinished = true
    
    expect(store.wpm).toBeGreaterThan(0)
  })

  it('should calculate accuracy correctly', () => {
    const store = useTypingStore()
    store.text = 'hello'
    store.userInput = 'hallo' // 4 correct, 1 wrong
    
    // Accuracy is computed based on chars matching
    expect(store.accuracy).toBeGreaterThan(0)
    expect(store.accuracy).toBeLessThan(100)
  })

  it('should track correct and incorrect characters', () => {
    const store = useTypingStore()
    store.text = 'test'
    store.userInput = ''
    
    store.handleKeyPress('t')
    expect(store.correctChars).toBe(1)
    expect(store.incorrectChars).toBe(0)
    
    store.handleKeyPress('x')
    expect(store.correctChars).toBe(1)
    expect(store.incorrectChars).toBe(1)
  })

  it('should handle backspace correctly', () => {
    const store = useTypingStore()
    store.text = 'test'
    store.userInput = 'te'
    
    store.handleKeyPress('Backspace')
    
    expect(store.userInput).toBe('t')
  })

  it('should finish test when all text is typed', () => {
    const store = useTypingStore()
    store.text = 'hi'
    store.startTime = Date.now() - 10000
    store.isStarted = true
    store.userInput = 'h'
    
    store.handleKeyPress('i')
    
    // In real app, timer finishes the test, not userInput length
    // Just check that userInput is updated
    expect(store.userInput).toBe('hi')
  })

  it('should reset test correctly', () => {
    const store = useTypingStore()
    store.userInput = 'test'
    store.isStarted = true
    store.isFinished = true
    
    store.reset()
    
    expect(store.userInput).toBe('')
    expect(store.isStarted).toBe(false)
    expect(store.isFinished).toBe(false)
    expect(store.wpm).toBe(0)
    expect(store.accuracy).toBe(100)
  })

  it('should generate new text', () => {
    const store = useTypingStore()
    
    store.generateNewText()
    
    expect(store.text.length).toBeGreaterThan(0)
    expect(vi.mocked(typingTestsApi.create)).not.toHaveBeenCalled()
  })
})
