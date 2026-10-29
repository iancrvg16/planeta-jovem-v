import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, type IconName } from './Icon'
import type { Country, NewsItem } from '../data/types'

export function Status({
  children = 'Sinal ativo',
}: {
  children?: React.ReactNode
}) {
  return (
    <span className="signal-status">
      <span className="signal-dot" />
      {children}
    </span>
  )
}
export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'purple' | 'green' | 'yellow'
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}
export function SectionHeading({
  eyebrow,
  title,
  link,
  linkText,
}: {
  eyebrow?: string
  title: string
  link?: string
  linkText?: string
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {linkText ?? 'Explorar'}
          <Icon name="arrow" size={17} />
        </Link>
      )}
    </div>
  )
}
export function EmptyState({
  title = 'Transmissão ainda não recebida',
  children,
  icon = 'signal',
}: {
  title?: string
  children?: React.ReactNode
  icon?: IconName
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>
        {children ??
          'Este espaço está pronto para receber as próximas histórias da tripulação.'}
      </p>
    </div>
  )
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; to?: string }[]
}) {
  return (
    <nav className="breadcrumb" aria-label="Você está aqui">
      <Link to="/">Central</Link>
      {items.map((item, i) => (
        <span key={i}>
          <Icon name="chevron" size={12} />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
export function CountryCard({
  country,
  featured = false,
  headingLevel = 3,
}: {
  country: Country
  featured?: boolean
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Link
      to={`/memoria/paises/${country.slug}`}
      className={`country-card ${featured ? 'country-featured' : ''}`}
      style={{ '--country-color': country.accentColor } as React.CSSProperties}
    >
      <img src={country.flag} alt="" width="64" height="40" loading="lazy" />
      <div>
        <Heading className="card-title">{country.name}</Heading>
        <span>
          {country.isHistorical
            ? 'Arquivo histórico'
            : country.isProvisional
              ? 'Em atualização'
              : 'Arquivo do país'}
        </span>
      </div>
      <Icon name="arrow" size={18} />
    </Link>
  )
}
export function NewsCard({
  item,
  featured = false,
  compact = false,
  headingLevel = 3,
}: {
  item: NewsItem
  featured?: boolean
  compact?: boolean
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article
      className={`news-card ${featured ? 'news-featured' : ''} ${compact ? 'news-compact' : ''}`}
    >
      <Link to={`/noticias/${item.slug}`} className="news-card-link">
        <div className="news-image">
          <img
            src={item.image}
            alt={item.imageAlt}
            width="900"
            height="450"
            loading={featured ? 'eager' : 'lazy'}
          />
          {featured && (
            <span className="image-label">
              <Icon name="signal" size={13} /> Em destaque
            </span>
          )}
        </div>
        <div className="news-body">
          <div className="news-meta">
            <span>{item.category}</span>
            <span>{item.dateLabel}</span>
          </div>
          <Heading className="card-title">{item.title}</Heading>
          {!compact && <p>{item.excerpt}</p>}
          <span className="news-read">
            Ler transmissão <Icon name="arrow" size={17} />
          </span>
        </div>
      </Link>
    </article>
  )
}
export function RelatedCountries({ countries }: { countries: Country[] }) {
  if (!countries.length) return null
  return (
    <div className="related-countries">
      <span>Países relacionados</span>
      {countries.map((country) => (
        <Link to={`/paises/${country.slug}`} key={country.slug}>
          <img src={country.flag} alt="" width="24" height="15" />
          {country.name}
        </Link>
      ))}
    </div>
  )
}
export function ShareLink() {
  const [state, setState] = useState<'idle' | 'copied' | 'fallback'>('idle')
  return (
    <div className="share-link">
      <button
        className="button button-ghost"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href)
            setState('copied')
          } catch {
            setState('fallback')
          }
        }}
      >
        <Icon name={state === 'copied' ? 'check' : 'link'} size={17} />
        {state === 'copied' ? 'Link copiado' : 'Copiar link'}
      </button>
      <span role="status" className="sr-only">
        {state === 'copied' ? 'Link copiado para a área de transferência.' : ''}
      </span>
      {state === 'fallback' && (
        <label className="share-fallback">
          Copie o endereço:
          <input
            value={window.location.href}
            readOnly
            onFocus={(event) => event.target.select()}
          />
        </label>
      )}
    </div>
  )
}
