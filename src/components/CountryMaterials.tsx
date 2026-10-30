import { entregas, mediaTitle } from '../data/acervo'
import { VideoPlayer } from './VideoPlayer'
import type { CountrySlug } from '../data/contentTypes'
import { AssetImage } from './AssetImage'

export function CountryMaterials({ country }: { country: CountrySlug }) {
  const materials = entregas.filter(
    (entry) =>
      entry.paisSlug === country &&
      entry.midias.some((m) => m.collection === 'materiais-pais'),
  )
  if (!materials.length) return null
  return (
    <section className="country-materials" aria-label="Materiais em destaque">
      {materials.map((entry) =>
        entry.midias.map((media) => (
          <article
            className={`panel country-material material-${media.type}`}
            key={media.id}
          >
            {media.type === 'document' ? (
              <>
                <AssetImage
                  src={media.poster}
                  srcSet={media.posterSrcSet}
                  width={media.width}
                  height={media.height}
                  alt={`Capa de ${mediaTitle(media)}`}
                  sizes="160px"
                  loading="lazy"
                  decoding="async"
                />
                <div>
                  <h2>{mediaTitle(media)}</h2>
                  <p>{entry.descricao}</p>
                  <p className="caption">
                    PDF ·{' '}
                    {((media.bytes ?? 0) / 1e6).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    MB · {media.pages} páginas
                  </p>
                  <div className="material-actions">
                    <a
                      className="text-link"
                      href={media.src}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Abrir PDF
                      <span className="sr-only">
                        : {mediaTitle(media)} (nova aba)
                      </span>
                    </a>
                    <a className="text-link" href={media.src} download>
                      Baixar PDF
                      <span className="sr-only">: {mediaTitle(media)}</span>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <VideoPlayer media={media} title={mediaTitle(media)} />
                <div>
                  <h2>{mediaTitle(media)}</h2>
                  <p>{entry.descricao}</p>
                </div>
              </>
            )}
          </article>
        )),
      )}
    </section>
  )
}
