import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { paises } from '../data/paises'
import {
  dateLabel,
  galeria,
  impactNumbers,
  mediaFile,
  mediaTitle,
} from '../data/acervo'
import type {
  CountryData,
  Delivery,
  Institution,
  Media,
} from '../data/contentTypes'
import { Icon } from './Icon'
import { MediaLightbox, ResponsiveImage } from './MediaGallery'
import { ContactButton } from './Contact'
import { partnership } from '../data/editorial'
import { siteConfig } from '../config/site'

export function CountryEmblem({
  country,
  large = false,
}: {
  country: CountryData
  large?: boolean
}) {
  return (
    <span
      className={`country-emblem ${large ? 'large' : ''}`}
      style={
        {
          '--planet-color': country.cores.primaria,
          '--planet-light': country.cores.destaque,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <span className="planet-ring" />
      <Icon name={country.icone} size={large ? 54 : 28} />
      <i />
    </span>
  )
}
export function CountryCards({
  items = paises,
  headingLevel = 3,
}: {
  items?: CountryData[]
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div className="country-grid">
      {items.map((country) => (
        <article
          key={country.slug}
          className={`country-tile ${country.slug} ${country.status}`}
          style={
            {
              '--country-color': country.cores.destaque,
              '--country-bg': country.cores.primaria,
            } as CSSProperties
          }
        >
          <div className="country-tile-top">
            <CountryEmblem country={country} large />
            <span className="country-status">
              <span />
              {country.status === 'ativo' ? 'Em construção ativa' : 'Em breve'}
            </span>
          </div>
          <div className="country-name">
            <Heading>
              <Link to={`/paises/${country.slug}`}>{country.nome}</Link>
            </Heading>
            {country.bandeira && (
              <ResponsiveImage
                media={mediaFile(country.bandeira.arquivo)}
                alt={`Bandeira de ${country.nome}`}
                sizes="64px"
              />
            )}
          </div>
          <p className="country-motto">
            {country.lema ?? 'Uma nova história está chegando.'}
          </p>
          <p className="country-focus">
            {country.missao ?? 'País em fundação'}
          </p>
          <Link className="text-link" to={`/paises/${country.slug}`}>
            Explorar país <Icon name="arrow" size={18} />
          </Link>
        </article>
      ))}
    </div>
  )
}
function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(value)
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        const start = performance.now()
        const animate = (time: number) => {
          const progress = Math.min((time - start) / 1000, 1)
          setShown(Math.round(value * (1 - (1 - progress) ** 3)))
          if (progress < 1) frame = requestAnimationFrame(animate)
        }
        frame = requestAnimationFrame(animate)
        observer.disconnect()
      },
      { threshold: 0.5 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])
  return (
    <strong ref={ref} aria-label={String(value)}>
      {String(shown).padStart(2, '0')}
    </strong>
  )
}
export function Impact() {
  return (
    <section
      className="impact-section"
      id="impacto"
      aria-label="Impacto em números"
    >
      <div className="impact-heading">
        <span className="signal-dot" />
        <p>
          Uma jornada real.
          <br />
          <strong>Muitas possibilidades.</strong>
        </p>
      </div>
      <div className="impact-numbers">
        {impactNumbers().map((n) => (
          <div key={n.label}>
            <Counter value={n.value} />
            <span>{n.label}</span>
          </div>
        ))}
      </div>
      <p className="impact-note">
        Contagem do acervo publicado. Pessoas creditadas incluem diferentes
        papéis; não representam o total de participantes.
      </p>
    </section>
  )
}
export function DeliveryCards({
  items,
  timeline = false,
}: {
  items: Delivery[]
  timeline?: boolean
}) {
  const [selected, setSelected] = useState<Delivery | null>(null)
  return (
    <>
      <div className={timeline ? 'delivery-timeline' : 'delivery-grid'}>
        {items.map((item) => {
          const country = paises.find((c) => c.slug === item.paisSlug)!
          const cover = item.midias.find(
            (m) => m.type === 'image' || m.type === 'video',
          )
          return (
            <article
              className="delivery-card"
              key={item.id}
              id={timeline ? item.id : undefined}
            >
              <div className="delivery-cover">
                {cover ? (
                  <button
                    onClick={() => setSelected(item)}
                    aria-label={`Abrir entrega: ${item.titulo}`}
                  >
                    <ResponsiveImage
                      media={cover}
                      alt={item.titulo + '. ' + item.descricao}
                    />
                    <span className="gallery-icon">
                      <Icon name={cover.type === 'video' ? 'play' : 'zoom'} />
                    </span>
                  </button>
                ) : (
                  <div className={`delivery-art ${item.paisSlug}`}>
                    <CountryEmblem country={country} large />
                    <Icon
                      name={item.id.includes('hino') ? 'signal' : 'file'}
                      size={26}
                    />
                  </div>
                )}
              </div>
              <div className="delivery-body">
                <span className={`country-label ${item.paisSlug}`}>
                  {country.nome}
                </span>
                <time dateTime={item.dataISO}>{dateLabel(item)}</time>
                <h3>
                  <Link to={`/paises/${item.paisSlug}#${item.id}`}>
                    {item.titulo}
                  </Link>
                </h3>
                <p>{item.descricao}</p>
                {item.responsaveis.length > 0 && (
                  <p className="credit">por {item.responsaveis.join(', ')}</p>
                )}
                {item.midias
                  .filter((m) => m.type === 'document' || m.type === 'briefing')
                  .map((m) => (
                    <a
                      key={m.id}
                      href={m.src}
                      className="text-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {m.type === 'document' ? 'Ler documento' : 'Ler briefing'}{' '}
                      <Icon name="download" size={16} />
                    </a>
                  ))}
              </div>
            </article>
          )
        })}
      </div>
      {selected && (
        <MediaLightbox
          items={galeria.filter((g) => g.entrega.id === selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
export function DocumentDownloads({ items }: { items: Media[] }) {
  if (!items.length) return null
  return (
    <div className="document-downloads">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.src}
          target="_blank"
          rel="noopener noreferrer"
          className="download-card"
        >
          <span className="document-icon">
            <Icon name="file" size={28} />
          </span>
          <span>
            <strong>{mediaTitle(item)}</strong>
            <small>
              PDF · {item.pages} páginas ·{' '}
              {((item.bytes ?? 0) / 1e6).toFixed(2)} MB
            </small>
          </span>
          <Icon name="download" />
        </a>
      ))}
    </div>
  )
}
export function InstitutionCards({ items }: { items: Institution[] }) {
  return (
    <div className="institution-grid">
      {items.map((item) => (
        <article className="panel" key={item.nome}>
          <h3>{item.nome}</h3>
          <p>{item.descricao}</p>
          {item.responsavel && <p className="credit">por {item.responsavel}</p>}
        </article>
      ))}
    </div>
  )
}
export function Steps({ items }: { items: string[] }) {
  return (
    <ol className="process-steps">
      {items.map((step, i) => (
        <li key={step}>
          <span>{String(i + 1).padStart(2, '0')}</span>
          <p>{step}</p>
        </li>
      ))}
    </ol>
  )
}
export function PartnerBanner() {
  return (
    <section className="partner-banner">
      <div className="partner-banner-copy">
        <p className="eyebrow">{partnership.eyebrow}</p>
        <h2>
          {partnership.title}
          <br />
          <span>{partnership.subtitle}</span>
        </h2>
        <p>{partnership.description}</p>
        <div className="partner-benefits">
          {partnership.arguments.map((a) => (
            <span key={a.title}>
              <Icon name="check" size={16} />
              {a.title}
            </span>
          ))}
        </div>
        <ContactButton>
          Quero ser parceiro <Icon name="arrow" />
        </ContactButton>
      </div>
      <div className="partner-art" aria-hidden="true">
        <div className="partner-orbit" />
        <Icon name="rocket" size={130} />
        <span className="spark-one">✦</span>
        <span className="spark-two">✦</span>
      </div>
    </section>
  )
}
export function PartnerStrip() {
  return (
    <div className="partner-strip">
      <div>
        <span className="eyebrow">Realização</span>
        <a
          href={siteConfig.institutionalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pirambu-wordmark"
        >
          pirambu
          <span>
            innovation <Icon name="external" size={13} />
          </span>
        </a>
      </div>
      <p>
        Educação, tecnologia
        <br />e protagonismo juvenil.
      </p>
      <div className="partner-slots">
        {siteConfig.parceiros.map((p) => (
          <a
            href={p.url}
            key={p.nome}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={p.logo}
              alt={p.nome}
              width="140"
              height="60"
              loading="lazy"
            />
          </a>
        ))}
        <Link to="/parceiros">
          <Icon name="spark" size={20} /> Sua marca aqui
        </Link>
        <Link to="/parceiros">
          <Icon name="orbit" size={22} /> Construa com a gente
        </Link>
      </div>
    </div>
  )
}
