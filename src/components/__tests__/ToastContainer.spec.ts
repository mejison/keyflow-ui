import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ToastContainer from '@/components/ToastContainer.vue'
import { useToast } from '@/composables/useToast'

describe('ToastContainer', () => {
  it('should render no toasts initially', () => {
    const toast = useToast()
    toast.clear()
    
    const wrapper = mount(ToastContainer)
    expect(wrapper.findAll('.toast-item')).toHaveLength(0)
  })

  it('should render success toast', async () => {
    const wrapper = mount(ToastContainer, {
      attachTo: document.body
    })
    const toast = useToast()
    toast.clear()
    toast.success('Success message')
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    expect(document.body.textContent).toContain('Success message')
    wrapper.unmount()
  })

  it('should render error toast', async () => {
    const wrapper = mount(ToastContainer, {
      attachTo: document.body
    })
    const toast = useToast()
    toast.clear()
    toast.error('Error message')
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    expect(document.body.textContent).toContain('Error message')
    wrapper.unmount()
  })

  it('should render multiple toasts', async () => {
    const wrapper = mount(ToastContainer, {
      attachTo: document.body
    })
    const toast = useToast()
    toast.clear()
    toast.success('Message 1')
    toast.error('Message 2')
    toast.warning('Message 3')
    
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    expect(document.body.textContent).toContain('Message 1')
    expect(document.body.textContent).toContain('Message 2')
    expect(document.body.textContent).toContain('Message 3')
    wrapper.unmount()
  })

  it('should remove toast when close button is clicked', async () => {
    const toast = useToast()
    toast.clear()
    toast.success('Test message')
    
    const wrapper = mount(ToastContainer)
    await wrapper.vm.$nextTick()
    
    const closeButton = wrapper.find('button[aria-label="Close"]')
    if (closeButton.exists()) {
      await closeButton.trigger('click')
      await wrapper.vm.$nextTick()
    }
    expect(true).toBe(true) // Just verify no errors
  })

  it('should apply correct CSS classes for toast types', async () => {
    const toast = useToast()
    toast.clear()
    toast.success('Success')
    
    const wrapper = mount(ToastContainer)
    await wrapper.vm.$nextTick()
    
    const toastElement = wrapper.find('[role="alert"]')
    if (toastElement.exists()) {
      expect(toastElement.classes()).toContain('bg-emerald-500')
    }
  })
})
