import { AssetImage } from './AssetImage'
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { Badge, EmptyState } from './ui'
import { safeMediaUrl } from '../lib/media'
import type { MediaItem, MediaType } from '../data/types'

export function Lightbox({
  item,
  onClose,
}: {
  item: MediaItem
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const element = dialog.current
    const previousFocus = document.activeElement as HTMLElement | null
    element?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return
        const focusable = event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }}
    >
      <div className="lightbox-content">
        <button
          autoFocus
          className="icon-button lightbox-close"
          aria-label="Fechar imagem"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
        <AssetImage
          src={safeMediaUrl(item.url)}
          alt={item.alt ?? item.title}
          width={item.width ?? 900}
          height={item.height ?? 600}
        />
        <div className="lightbox-caption">
          <h2 id="lightbox-title">{item.title}</h2>
          <p>{item.description}</p>
          {item.isDemonstrative && (
            <Badge tone="yellow">Conteúdo demonstrativo</Badge>
          )}
        </div>
      </div>
    </dialog>
  )
}
export function DocumentPanel({ items }: { items: MediaItem[] }) {
  if (!items.length)
    return (
      <EmptyState icon="file" title="Arquivo em atualização pela tripulação">
        Os documentos desta edição serão reunidos aqui.
      </EmptyState>
    )
  return (
    <div className="document-list">
      {items.map((item) => {
        const url =
          item.status === 'available' ? safeMediaUrl(item.url) : undefined
        return (
          <div className="document-row" key={item.id}>
            <span className="document-icon">
              <Icon name="file" size={23} />
            </span>
            <div className="document-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.isDemonstrative && (
                <Badge tone="yellow">Conteúdo demonstrativo</Badge>
              )}
            </div>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="document-action"
                aria-label={`Abrir ${item.title} (nova aba)`}
              >
                <span>Disponível</span>
                <Icon name="external" size={18} />
              </a>
            ) : (
              <span className="document-pending">
                {item.status === 'updating' || item.status === 'available'
                  ? 'Em atualização'
                  : 'Aguardando transmissão'}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
const filters: [MediaType | 'all', string][] = [
  ['all', 'Todos'],
  ['image', 'Fotos'],
  ['video', 'Vídeos'],
  ['document', 'Documentos'],
]
export function Repository({
  items,
  title = 'Repositório do País',
}: {
  items: MediaItem[]
  title?: string
}) {
  const [filter, setFilter] = useState<MediaType | 'all'>('all')
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const filtered = items.filter(
    (item) => filter === 'all' || item.type === filter,
  )
  const documents = filtered.filter((item) => item.type === 'document')
  const media = filtered.filter((item) => item.type !== 'document')
  return (
    <section className="repository">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Memória em construção</p>
          <h2>{title}</h2>
        </div>
        <Icon name="orbit" size={26} />
      </div>
      <div
        className="filter-pills"
        role="group"
        aria-label={`Filtrar ${title}`}
      >
        {filters.map(([value, label]) => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {!filtered.length && (
          <EmptyState
            icon={
              filter === 'image'
                ? 'image'
                : filter === 'video'
                  ? 'video'
                  : 'signal'
            }
          >
            Assim que novos registros forem recebidos, você poderá explorar este
            acervo por aqui.
          </EmptyState>
        )}
        {documents.length > 0 && <DocumentPanel items={documents} />}
        {media.length > 0 && (
          <div className="media-grid">
            {media.map((item) => {
              const url =
                item.status === 'available' ? safeMediaUrl(item.url) : undefined
              return (
                <article className="media-card" key={item.id}>
                  {url && item.type === 'image' ? (
                    <button
                      onClick={() => setSelected(item)}
                      aria-label={`Ampliar ${item.title}`}
                    >
                      <AssetImage
                        src={url}
                        alt={item.alt ?? item.title}
                        width={item.width ?? 900}
                        height={item.height ?? 600}
                        loading="lazy"
                      />
                      <span>
                        {item.title}
                        <Icon name="external" size={17} />
                      </span>
                    </button>
                  ) : (
                    <div className="media-placeholder">
                      <Icon
                        name={item.type === 'video' ? 'video' : 'image'}
                        size={28}
                      />
                      <h3>{item.title}</h3>
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link"
                        >
                          Assistir ao vídeo
                          <Icon name="external" size={16} />
                        </a>
                      ) : (
                        <p>Transmissão ainda não recebida</p>
                      )}
                    </div>
                  )}
                  {item.description && <p>{item.description}</p>}
                  {item.isDemonstrative && (
                    <Badge tone="yellow">Conteúdo demonstrativo</Badge>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
      {selected && (
        <Lightbox item={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}
