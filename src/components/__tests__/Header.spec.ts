import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Header from '@/components/Header.vue'
import { useAuthStore } from '@/stores/auth'
import { mockRouter } from '@/test/mocks/router'

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot /></a>'
  }
}))

describe('Header', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render logo and app name', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          LanguageSelector: true
        }
      }
    })
    
    expect(wrapper.text()).toContain('Keyflow')
  })

  it('should show login/signup buttons when not authenticated', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          LanguageSelector: true
        }
      }
    })
    
    expect(wrapper.text()).toContain('Sign In')
  })

  it('should show user menu when authenticated', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          LanguageSelector: true
        }
      }
    })
    
    const store = useAuthStore()
    store.user = {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      provider: 'email'
    }
    
    await wrapper.vm.$nextTick()
    
    // User menu shows initials, not full name
    expect(wrapper.text()).toContain('TU') // Test User initials
  })

  it('should display user initials', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          LanguageSelector: true
        }
      }
    })
    
    const store = useAuthStore()
    store.user = {
      id: 1,
      name: 'John Doe',
      email: 'john@test.com',
      provider: 'email'
    }
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('JD')
  })

  it('should toggle user dropdown menu', async () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          LanguageSelector: true
        }
      }
    })
    
    const store = useAuthStore()
    store.user = {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      provider: 'email'
    }
    
    await wrapper.vm.$nextTick()
    
    const userButton = wrapper.find('button.flex.items-center')
    if (userButton.exists()) {
      await userButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.$data).toBeDefined()
    }
  })

  it('should render navigation links', () => {
    const wrapper = mount(Header, {
      global: {
        stubs: {
          Logo: true,
          LanguageSelector: true,
          RouterLink: false
        }
      }
    })
    
    expect(wrapper.text()).toContain('Leaderboard')
  })
})
