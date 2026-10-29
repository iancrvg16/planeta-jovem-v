import { useEffect } from 'react'
import { site } from '../data/site'
import { useLocation } from 'react-router-dom'

export function usePageMeta(
  title: string,
  description?: string,
  image = '/og/inicio.jpg',
  noIndex = false,
) {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = `${title} | Planeta Jovem`
    const text = description ?? site.description
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', text)
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', document.title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', text)
    const origin =
      document.querySelector<HTMLMetaElement>('meta[name="site-origin"]')
        ?.content ?? site.url
    const normalized = pathname.replace(/\/+$/, '') || '/'
    const canonicalPath = /^\/paises\/(midoria|dolminn|olimpia)$/.test(
      normalized,
    )
      ? `/memoria${normalized}`
      : normalized
    const canonical = new URL(canonicalPath, origin).href
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = noIndex ? 'noindex, follow' : 'index, follow'
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical
    if (noIndex) link.remove()
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute('content', canonical)
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute('content', new URL(image, origin).href)
  }, [title, description, image, pathname, noIndex])
}
