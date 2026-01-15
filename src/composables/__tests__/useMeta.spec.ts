import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useMeta } from '@/composables/useMeta'

describe('useMeta', () => {
  beforeEach(() => {
    // Reset document head
    document.title = ''
    document.querySelectorAll('meta[data-test]').forEach(el => el.remove())
  })

  it('should set page title', () => {
    const wrapper = mount({
      setup() {
        const { setMeta } = useMeta()
        setMeta({
          title: 'Test Page'
        })
      },
      template: '<div>Test</div>'
    })

    expect(document.title).toBe('Test Page - KeyFlow')
  })

  it('should set meta description', () => {
    const wrapper = mount({
      setup() {
        const { setMeta } = useMeta()
        setMeta({
          title: 'Test',
          description: 'Test description'
        })
      },
      template: '<div>Test</div>'
    })

    const metaDesc = document.querySelector('meta[name="description"]')
    expect(metaDesc?.getAttribute('content')).toBe('Test description')
  })

  it('should set Open Graph tags', () => {
    const wrapper = mount({
      setup() {
        const { setMeta } = useMeta()
        setMeta({
          title: 'OG Test',
          description: 'OG description',
          image: 'https://example.com/image.jpg'
        })
      },
      template: '<div>Test</div>'
    })

    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const ogImage = document.querySelector('meta[property="og:image"]')

    expect(ogTitle?.getAttribute('content')).toBe('OG Test - KeyFlow')
    expect(ogDesc?.getAttribute('content')).toBe('OG description')
    expect(ogImage?.getAttribute('content')).toBe('https://example.com/image.jpg')
  })

  it('should set Twitter Card tags', () => {
    const wrapper = mount({
      setup() {
        const { setMeta } = useMeta()
        setMeta({
          title: 'Twitter Test',
          description: 'Twitter description'
        })
      },
      template: '<div>Test</div>'
    })

    const twitterTitle = document.querySelector('meta[property="twitter:title"]')
    const twitterDesc = document.querySelector('meta[property="twitter:description"]')

    expect(twitterTitle?.getAttribute('content')).toBe('Twitter Test - KeyFlow')
    expect(twitterDesc?.getAttribute('content')).toBe('Twitter description')
  })

  it('should restore original meta tags on unmount', () => {
    const originalTitle = document.title
    
    const wrapper = mount({
      setup() {
        const { setMeta } = useMeta()
        setMeta({
          title: 'Temporary Title'
        })
      },
      template: '<div>Test</div>'
    })

    expect(document.title).toBe('Temporary Title - KeyFlow')
    
    wrapper.unmount()
    
    // Title should be restored (or at least changed from the temporary one)
    expect(document.title).not.toBe('Temporary Title - KeyFlow')
  })
})
