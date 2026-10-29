import { usePageMeta } from '../lib/usePageMeta'
import { useSearchParams } from 'react-router-dom'
import { editions } from '../data/editions'
import { schedule } from '../data/journey'
import { Badge, Breadcrumb } from '../components/ui'
import { DocumentPanel, Repository } from '../components/Repository'
import { Icon } from '../components/Icon'
import { documentos } from '../data/acervo'
import { DocumentDownloads } from '../components/Content'

export default function Documents() {
  usePageMeta(
    'Documentos e memória',
    'Consulte o manual, os documentos e os registros das edições do Planeta Jovem. A programação do manual aguarda confirmação de realização.',
  )
  const [params, setParams] = useSearchParams()
  const edition =
    editions.find((item) => item.number === Number(params.get('edicao'))) ??
    editions[0]
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Documentos e memória' }]} />
      <div className="page-heading">
        <p className="eyebrow">Arquivo de bordo</p>
        <h1>
          Memórias que ficam.
          <br />
          <span>Futuros que começam.</span>
        </h1>
        <p>
          Manuais, construções coletivas e registros de cada capítulo do Planeta
          Jovem.
        </p>
      </div>
      <div
        className="edition-selector"
        role="group"
        aria-label="Escolher edição"
      >
        {[...editions].reverse().map((item) => (
          <button
            key={item.number}
            aria-pressed={edition.number === item.number}
            onClick={() => setParams({ edicao: String(item.number) })}
          >
            <span>Edição</span>
            <strong>{String(item.number).padStart(2, '0')}</strong>
            <span>{item.status === 'current' ? 'Em foco' : 'Memória'}</span>
            {item.status === 'current' && <span className="signal-dot" />}
          </button>
        ))}
      </div>
      <section
        className="edition-panel"
        aria-label={`Arquivos da edição ${edition.number}`}
      >
        <div className="edition-overview">
          <div>
            <p className="eyebrow">{edition.year ?? 'História do projeto'}</p>
            <h2>{edition.number}ª edição do Planeta Jovem</h2>
            <p>{edition.summary}</p>
          </div>
          <Badge tone={edition.status === 'current' ? 'purple' : 'neutral'}>
            {edition.status === 'current'
              ? 'Edição atual'
              : 'Acervo em organização'}
          </Badge>
        </div>
        <DocumentPanel items={edition.documents} />
        {edition.number === 5 && (
          <>
            <h3 className="subsection-title">Documentos dos Países Virtuais</h3>
            <DocumentDownloads items={documentos} />
          </>
        )}
        {edition.archiveUrl && (
          <div>
            <a
              className="button button-ghost archive-link"
              href={edition.archiveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visitar o site histórico da 2ª edição
              <Icon name="external" size={18} />
            </a>
            <p className="caption">
              O endereço original foi preservado. Na verificação de 30/09/2026,
              o domínio histórico estava indisponível.
            </p>
          </div>
        )}
      </section>
      {edition.number === 5 && (
        <section className="schedule-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Programação registrada no manual</p>
              <h2>Primeiros passos da jornada</h2>
            </div>
            <Badge tone="yellow">Previsto no manual</Badge>
          </div>
          <p className="muted">
            Datas registradas no Manual do Tripulante. A realização das
            atividades será atualizada quando houver confirmação oficial.
          </p>
          <div className="schedule-list">
            {schedule.map((event) => (
              <article key={event.dateTime}>
                <time dateTime={event.dateTime}>{event.date}</time>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                </div>
                <Icon name="clock" size={18} />
              </article>
            ))}
          </div>
        </section>
      )}
      <Repository
        key={edition.number}
        items={edition.gallery}
        title={`Fotos e vídeos · edição ${String(edition.number).padStart(2, '0')}`}
      />
    </div>
  )
}
