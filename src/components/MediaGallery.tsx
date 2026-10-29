import { VideoPlayer } from './VideoPlayer'
import { useRef, useState } from 'react'
import { galeria, dateLabel, mediaTitle } from '../data/acervo'
import { paises } from '../data/paises'
import type { Media } from '../data/contentTypes'
import { Dialog } from './Dialog'
import { Icon } from './Icon'
import { AssetImage } from './AssetImage'

export type GalleryEntry = (typeof galeria)[number]
export function ResponsiveImage({
  media,
  alt,
  eager = false,
  className = '',
  sizes = '(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 420px',
}: {
  media: Media
  alt: string
  eager?: boolean
  className?: string
  sizes?: string
}) {
  return (
    <AssetImage
      src={media.type === 'video' ? media.poster : media.src}
      srcSet={media.type === 'video' ? media.posterSrcSet : media.srcSet}
      sizes={sizes}
      alt={alt}
      width={media.width}
      height={media.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      className={className}
      style={{ backgroundColor: media.color }}
    />
  )
}

export function MediaLightbox({
  items,
  initialIndex = 0,
  onClose,
}: {
  items: GalleryEntry[]
  initialIndex?: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [zoom, setZoom] = useState(false)
  const touch = useRef<number | null>(null)
  const { midia, entrega } = items[index]
  const country = paises.find((c) => c.slug === entrega.paisSlug)!
  const move = (delta: number) => {
    setIndex((i) => (i + delta + items.length) % items.length)
    setZoom(false)
  }
  return (
    <Dialog
      title={entrega.titulo}
      onClose={onClose}
      className="media-dialog"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          move(1)
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          move(-1)
        }
      }}
    >
      <div
        className={`lightbox-stage ${zoom ? 'zoomed' : ''}`}
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (!zoom && touch.current !== null) {
            const delta = e.changedTouches[0].clientX - touch.current
            if (Math.abs(delta) > 60) move(delta < 0 ? 1 : -1)
          }
          touch.current = null
        }}
      >
        {midia.type === 'video' ? (
          <VideoPlayer key={midia.id} media={midia} title={entrega.titulo} />
        ) : midia.type === 'document' ? (
          <div className="document-preview">
            <Icon name="file" size={60} />
            <a
              className="button button-primary"
              href={midia.src}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir documento PDF <Icon name="external" />
            </a>
            <p>
              {midia.pages} páginas · {((midia.bytes ?? 0) / 1e6).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <ResponsiveImage
            media={midia}
            alt={`${entrega.titulo}. ${entrega.descricao}`}
            eager
            sizes="(max-width: 900px) 100vw, 1100px"
          />
        )}
      </div>
      <div className="lightbox-info">
        <div>
          <p className="eyebrow">
            {country.nome} · {dateLabel(entrega)}
          </p>
          <h2>{entrega.titulo}</h2>
          <p>{entrega.descricao}</p>
          {entrega.responsaveis.length > 0 && (
            <p className="credit">por {entrega.responsaveis.join(', ')}</p>
          )}
        </div>
        <div className="lightbox-controls">
          {midia.type === 'image' && (
            <button
              className="icon-button"
              aria-label={zoom ? 'Reduzir imagem' : 'Ampliar imagem'}
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              <Icon name="zoom" />
            </button>
          )}
          {items.length > 1 && (
            <>
              <button
                className="icon-button"
                aria-label="Imagem anterior"
                onClick={() => move(-1)}
              >
                <Icon name="back" />
              </button>
              <span aria-live="polite">
                {index + 1} / {items.length}
              </span>
              <button
                className="icon-button"
                aria-label="Próxima imagem"
                onClick={() => move(1)}
              >
                <Icon name="arrow" />
              </button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export function GalleryGrid({
  items,
  mosaic = false,
  headingLevel = 3,
}: {
  items: GalleryEntry[]
  mosaic?: boolean
  headingLevel?: 2 | 3
}) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <>
      <div className={mosaic ? 'gallery-mosaic' : 'gallery-grid'}>
        {items.map(({ midia, entrega }, i) => (
          <figure className={`gallery-card media-${midia.type}`} key={midia.id}>
            <button
              onClick={() => setSelected(i)}
              aria-label={`${midia.type === 'video' ? 'Assistir' : midia.type === 'document' ? 'Consultar' : 'Ampliar'}: ${entrega.titulo}${midia.type === 'document' ? `, ${midia.pages} páginas · ${((midia.bytes ?? 0) / 1e6).toFixed(2)} MB` : ''}`}
            >
              {midia.type === 'document' ? (
                <div className="document-tile">
                  <Icon name="file" size={42} />
                  <span>
                    {midia.pages} páginas ·{' '}
                    {((midia.bytes ?? 0) / 1e6).toFixed(2)} MB
                  </span>
                </div>
              ) : (
                <ResponsiveImage
                  media={midia}
                  alt={entrega.titulo + '. ' + entrega.descricao}
                />
              )}
              <span className="gallery-icon">
                <Icon
                  name={
                    midia.type === 'video'
                      ? 'play'
                      : midia.type === 'document'
                        ? 'file'
                        : 'zoom'
                  }
                />
              </span>
            </button>
            <figcaption>
              <span className={`country-label ${entrega.paisSlug}`}>
                {paises.find((c) => c.slug === entrega.paisSlug)?.nome}
              </span>
              <Heading>{entrega.titulo}</Heading>
              <p>{dateLabel(entrega)}</p>
              {entrega.responsaveis.length > 0 && (
                <p>por {entrega.responsaveis.join(', ')}</p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      {selected !== null && (
        <MediaLightbox
          items={items}
          initialIndex={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}

export function ImageZoom({
  media,
  caption,
}: {
  media: Media
  caption?: string
}) {
  const [open, setOpen] = useState(false)
  const entry = galeria.find((item) => item.midia.id === media.id)
  return (
    <figure className="identity-image">
      <button
        onClick={() => setOpen(true)}
        aria-label={`Ampliar imagem: ${caption ?? mediaTitle(media)}`}
      >
        <ResponsiveImage
          media={media}
          alt={caption ?? mediaTitle(media)}
          sizes="(max-width: 768px) 90vw, 600px"
        />
        <span>
          <Icon name="zoom" /> Ampliar imagem
        </span>
      </button>
      {caption && <figcaption>{caption}</figcaption>}
      {open && entry && (
        <MediaLightbox items={[entry]} onClose={() => setOpen(false)} />
      )}
    </figure>
  )
}
