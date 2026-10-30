import { useState } from 'react'
import { outrasEdicoes } from '../data/acervo'
import { MediaLightbox, ResponsiveImage } from './MediaGallery'
import { SectionHeading } from './ui'
import { Icon } from './Icon'

export function OtherEditions() {
  const [selected, setSelected] = useState<number | null>(null)
  if (!outrasEdicoes.length) return null
  return (
    <section
      className="section other-editions"
      id="outras-edicoes"
      aria-labelledby="other-editions-title"
    >
      <SectionHeading
        id="other-editions-title"
        eyebrow="Memória do Planeta Jovem"
        title="Outras edições"
      />
      <p className="section-intro">
        Registros de encontros, atividades e experiências de outras edições do
        Planeta Jovem.
      </p>
      <div className="other-editions-grid">
        {outrasEdicoes.map((media, index) => (
          <button
            key={media.id}
            onClick={() => setSelected(index)}
            aria-label={`Ampliar: ${media.alt}`}
          >
            <ResponsiveImage
              media={media}
              alt={media.alt!}
              sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 360px"
            />
            <span>
              <Icon name="zoom" size={18} /> Ampliar fotografia
            </span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <MediaLightbox
          items={outrasEdicoes.map((midia) => ({
            midia,
            title: midia.title!,
            description: midia.description!,
          }))}
          initialIndex={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}
