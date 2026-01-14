import { onMounted, onUnmounted } from 'vue'

interface MetaOptions {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  keywords?: string
}

export function useMeta(options: MetaOptions) {
  const defaultOptions = {
    title: 'KeyFlow - Master Your Typing Speed',
    description: 'Improve your typing speed and accuracy with KeyFlow. Practice typing tests, track your progress, and compete on the global leaderboard.',
    image: 'https://keyflow.app/logo.svg',
    url: 'https://keyflow.app/',
    type: 'website',
    keywords: 'typing test, typing speed, WPM, words per minute, typing practice'
  }

  const meta = { ...defaultOptions, ...options }
  const originalTitle = document.title
  const metaTags: HTMLMetaElement[] = []

  const setMeta = (name: string, content: string, isProperty = false) => {
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

  onMounted(() => {
    // Title
    document.title = meta.title === defaultOptions.title ? meta.title : `${meta.title} - KeyFlow`

    // Primary
    setMeta('title', meta.title)
    setMeta('description', meta.description)
    if (meta.keywords) {
      setMeta('keywords', meta.keywords)
    }

    // Open Graph
    setMeta('og:type', meta.type, true)
    setMeta('og:url', meta.url, true)
    setMeta('og:title', meta.title === defaultOptions.title ? meta.title : `${meta.title} - KeyFlow`, true)
    setMeta('og:description', meta.description, true)
    setMeta('og:image', meta.image, true)

    // Twitter
    setMeta('twitter:card', 'summary_large_image', true)
    setMeta('twitter:url', meta.url, true)
    setMeta('twitter:title', meta.title === defaultOptions.title ? meta.title : `${meta.title} - KeyFlow`, true)
    setMeta('twitter:description', meta.description, true)
    setMeta('twitter:image', meta.image, true)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', meta.url)
  })

  onUnmounted(() => {
    // Restore original title
    document.title = originalTitle
  })
}
