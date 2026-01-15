import { onMounted, onUnmounted } from 'vue'

interface MetaOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  keywords?: string
}

export function useMeta() {
  const defaultOptions = {
    title: 'KeyFlow - Master Your Typing Speed',
    description: 'Improve your typing speed and accuracy with KeyFlow. Practice typing tests, track your progress, and compete on the global leaderboard.',
    image: 'https://keyflow.app/logo.svg',
    url: 'https://keyflow.app/',
    type: 'website',
    keywords: 'typing test, typing speed, WPM, words per minute, typing practice'
  }

  const originalTitle = document.title
  const metaTags: HTMLMetaElement[] = []

  const updateMetaTag = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name'
    let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
    
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attr, name)
      document.head.appendChild(element)
      metaTags.push(element)
    }
    
    element.setAttribute('content', content)
  }

  const setMeta = (options: MetaOptions) => {
    const meta = { ...defaultOptions, ...options }

    // Title
    document.title = meta.title === defaultOptions.title ? meta.title : `${meta.title} - KeyFlow`

    // Primary
    updateMetaTag('title', meta.title)
    updateMetaTag('description', meta.description)
    if (meta.keywords) {
      updateMetaTag('keywords', meta.keywords)
    }

    // Open Graph
    updateMetaTag('og:type', meta.type, true)
    updateMetaTag('og:url', meta.url, true)
    updateMetaTag('og:title', meta.title === defaultOptions.title ? meta.title : `${meta.title} - KeyFlow`, true)
    updateMetaTag('og:description', meta.description, true)
    updateMetaTag('og:image', meta.image, true)

    // Twitter
    updateMetaTag('twitter:card', 'summary_large_image', true)
    updateMetaTag('twitter:url', meta.url, true)
    updateMetaTag('twitter:title', meta.title === defaultOptions.title ? meta.title : `${meta.title} - KeyFlow`, true)
    updateMetaTag('twitter:description', meta.description, true)
    updateMetaTag('twitter:image', meta.image, true)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', meta.url)
  }

  onUnmounted(() => {
    // Restore original title
    document.title = originalTitle
  })

  return {
    setMeta
  }
}
