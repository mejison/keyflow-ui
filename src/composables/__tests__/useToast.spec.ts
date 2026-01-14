import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useToast } from '@/composables/useToast'

describe('useToast', () => {
  beforeEach(() => {
    // Clear toasts before each test
    const toast = useToast()
    toast.clear()
    vi.clearAllTimers()
  })

  it('should add a success toast', () => {
    const toast = useToast()
    
    toast.success('Success message')
    
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0].type).toBe('success')
    expect(toast.toasts.value[0].message).toBe('Success message')
  })

  it('should add an error toast', () => {
    const toast = useToast()
    
    toast.error('Error message')
    
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0].type).toBe('error')
    expect(toast.toasts.value[0].message).toBe('Error message')
  })

  it('should add a warning toast', () => {
    const toast = useToast()
    
    toast.warning('Warning message')
    
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0].type).toBe('warning')
    expect(toast.toasts.value[0].message).toBe('Warning message')
  })

  it('should add an info toast', () => {
    const toast = useToast()
    
    toast.info('Info message')
    
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0].type).toBe('info')
    expect(toast.toasts.value[0].message).toBe('Info message')
  })

  it('should auto-remove toast after duration', async () => {
    vi.useFakeTimers()
    const toast = useToast()
    
    toast.show('Test message', 'success', 100) // 100ms duration
    
    expect(toast.toasts.value).toHaveLength(1)
    
    vi.advanceTimersByTime(150)
    
    expect(toast.toasts.value).toHaveLength(0)
    vi.useRealTimers()
  })

  it('should remove toast by id', () => {
    const toast = useToast()
    
    toast.success('Message 1')
    toast.success('Message 2')
    
    expect(toast.toasts.value).toHaveLength(2)
    
    const firstToastId = toast.toasts.value[0].id
    toast.remove(firstToastId)
    
    expect(toast.toasts.value).toHaveLength(1)
    expect(toast.toasts.value[0].message).toBe('Message 2')
  })

  it('should generate unique IDs for each toast', () => {
    const toast = useToast()
    
    toast.success('Message 1')
    toast.success('Message 2')
    toast.success('Message 3')
    
    const ids = toast.toasts.value.map(t => t.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(3)
  })

  it('should handle multiple toasts', () => {
    const toast = useToast()
    
    toast.success('Success')
    toast.error('Error')
    toast.warning('Warning')
    
    expect(toast.toasts.value).toHaveLength(3)
    expect(toast.toasts.value[0].type).toBe('success')
    expect(toast.toasts.value[1].type).toBe('error')
    expect(toast.toasts.value[2].type).toBe('warning')
  })
})
