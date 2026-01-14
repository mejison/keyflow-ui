import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import StatsBar from '@/components/StatsBar.vue'
import { useTypingStore } from '@/stores/typing'

vi.mock('@/utils/analytics', () => ({
  analytics: {
    startTest: vi.fn(),
    completeTest: vi.fn()
  }
}))

describe('StatsBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should not render when test is not finished', () => {
    const wrapper = mount(StatsBar)
    expect(wrapper.find('.grid').exists()).toBe(false)
  })

  it('should render stats when test is finished', async () => {
    const store = useTypingStore()
    
    // Set the underlying ref values, not computed properties
    store.text = 'hello world'
    store.userInput = 'hello world'
    store.isFinished = true
    store.startTime = Date.now() - 60000
    
    const wrapper = mount(StatsBar)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.grid').exists()).toBe(true)
  })

  it('should display WPM stat', async () => {
    const store = useTypingStore()
    store.text = 'hello'
    store.userInput = 'hello'
    store.isFinished = true
    
    const wrapper = mount(StatsBar)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('WPM')
  })

  it('should display accuracy stat', async () => {
    const store = useTypingStore()
    store.text = 'hello'
    store.userInput = 'hello'
    store.isFinished = true
    
    const wrapper = mount(StatsBar)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Accuracy')
  })

  it('should display errors stat', async () => {
    const store = useTypingStore()
    store.text = 'hello'
    store.userInput = 'hallo'
    store.isFinished = true
    
    const wrapper = mount(StatsBar)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Errors')
  })

  it('should have correct grid layout', async () => {
    const wrapper = mount(StatsBar)
    const store = useTypingStore()
    
    store.isFinished = true
    await wrapper.vm.$nextTick()
    
    const grid = wrapper.find('.grid')
    expect(grid.classes()).toContain('grid-cols-2')
    expect(grid.classes()).toContain('md:grid-cols-3')
  })
})
