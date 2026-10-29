import { Link, useSearchParams } from 'react-router-dom'
import { paises } from '../data/paises'
import { activities, fases, partnership } from '../data/editorial'
import { entregasOrdenadas, galeria } from '../data/acervo'
import { usePageMeta } from '../lib/usePageMeta'
import { Breadcrumb, SectionHeading } from '../components/ui'
import {
  DeliveryCards,
  Impact,
  PartnerBanner,
  PartnerStrip,
} from '../components/Content'
import { GalleryGrid } from '../components/MediaGallery'
import { ContactButton } from '../components/Contact'
import { Icon } from '../components/Icon'
import { contactUrl, siteConfig } from '../config/site'

function useFilters() {
  const [params, setParams] = useSearchParams()
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'todos') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  return { params, update, clear: () => setParams({}, { replace: true }) }
}

export function Atividades() {
  usePageMeta(
    'Atividades e jornada',
    'Acompanhe a Fase 1 — Entregas Básicas: identidades, governos, leis, territórios e as criações dos Países Virtuais.',
  )
  const { params, update, clear } = useFilters()
  const country = params.get('pais') ?? 'todos'
  const activity = params.get('atividade') ?? 'todos'
  const phase = params.get('fase') ?? 'todos'
  const filtered = entregasOrdenadas.filter(
    (e) =>
      (country === 'todos' || e.paisSlug === country) &&
      (activity === 'todos' || String(e.atividade) === activity) &&
      (phase === 'todos' || e.fase === phase),
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Atividades' }]} />
      <div className="page-heading">
        <p className="eyebrow">A jornada acontece agora</p>
        <h1>
          Ideias em movimento.
          <br />
          <span>Futuro em construção.</span>
        </h1>
        <p>
          Do primeiro símbolo aos grandes acordos: acompanhe as entregas e
          decisões dos tripulantes.
        </p>
      </div>
      {fases.map((fase) => (
        <section className="phase-section" key={fase.id}>
          <SectionHeading eyebrow={fase.status} title={fase.titulo} />
          <div className="activity-grid">
            {activities
              .filter((a) => a.fase === fase.id)
              .map((a) => (
                <article key={a.numero} className="panel">
                  <span className="activity-number">0{a.numero}</span>
                  <h3>{a.titulo}</h3>
                  <p>{a.descricao}</p>
                  <span className="badge">
                    {entregasOrdenadas.some(
                      (e) => e.fase === a.fase && e.atividade === a.numero,
                    )
                      ? 'Entregas publicadas'
                      : 'Aguardando novas entregas'}
                  </span>
                </article>
              ))}
          </div>
          <div
            className="activity-matrix-wrap"
            role="region"
            aria-label={`Status dos países em ${fase.titulo}`}
            tabIndex={0}
          >
            <table className="activity-matrix">
              <caption>Entregas por país e atividade</caption>
              <thead>
                <tr>
                  <th scope="col">País</th>
                  {activities
                    .filter((a) => a.fase === fase.id)
                    .map((a) => (
                      <th scope="col" key={a.numero}>
                        {a.titulo}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {paises.map((p) => (
                  <tr key={p.slug}>
                    <th scope="row">
                      <Link to={`/paises/${p.slug}`}>{p.nome}</Link>
                    </th>
                    {activities
                      .filter((a) => a.fase === fase.id)
                      .map((a) => {
                        const count = entregasOrdenadas.filter(
                          (e) =>
                            e.fase === fase.id &&
                            e.atividade === a.numero &&
                            e.paisSlug === p.slug,
                        ).length
                        return (
                          <td key={a.numero}>
                            {count ? (
                              <Link
                                className="activity-published"
                                to={`/atividades?fase=${fase.id}&pais=${p.slug}&atividade=${a.numero}#diario`}
                              >
                                Entregue <span>{count} registros</span>
                              </Link>
                            ) : (
                              <span className="activity-pending">Em breve</span>
                            )}
                          </td>
                        )
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption">
            As descrições desta fase serão atualizadas com as orientações
            oficiais das atividades.
          </p>
        </section>
      ))}
      <section className="section" id="diario">
        <SectionHeading
          eyebrow="Todas as transmissões"
          title="Diário da jornada"
        />
        <div className="filter-bar">
          {fases.length > 1 && (
            <label>
              Fase
              <select
                value={phase}
                onChange={(e) => update('fase', e.target.value)}
              >
                <option value="todos">Todas as fases</option>
                {fases.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.titulo}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            País
            <select
              value={country}
              onChange={(e) => update('pais', e.target.value)}
            >
              <option value="todos">Todos os países</option>
              {paises.map((p) => (
                <option value={p.slug} key={p.slug}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Atividade
            <select
              value={activity}
              onChange={(e) => update('atividade', e.target.value)}
            >
              <option value="todos">Todas as atividades</option>
              {activities.map((a) => (
                <option key={a.numero} value={a.numero}>
                  {a.titulo}
                </option>
              ))}
            </select>
          </label>
          <button className="text-link" onClick={clear}>
            Limpar filtros <Icon name="close" size={16} />
          </button>
        </div>
        <p className="result-count" aria-live="polite">
          {filtered.length} entregas encontradas
        </p>
        {filtered.length ? (
          <DeliveryCards items={filtered} timeline />
        ) : (
          <div className="empty-state">
            <Icon name="orbit" size={40} />
            <h3>Uma nova transmissão está por vir.</h3>
            <p>Ainda não há entregas para esta seleção.</p>
            <button className="button button-glass" onClick={clear}>
              Ver todas as entregas
            </button>
          </div>
        )}
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="Aprender também é se adaptar"
          title="Desafios e Reviravoltas"
        />
        <DeliveryCards
          items={entregasOrdenadas.filter((e) =>
            ['j-incendio', 'j-biblioteca', 'j-pandemia'].includes(e.id),
          )}
        />
      </section>
    </div>
  )
}

export function Galeria() {
  usePageMeta(
    'Galeria da jornada',
    'Explore todos os registros, criações visuais, vídeos e documentos dos participantes do Planeta Jovem V.',
  )
  const { params, update, clear } = useFilters()
  const country = params.get('pais') ?? 'todos',
    activity = params.get('atividade') ?? 'todos',
    type = params.get('tipo') ?? 'todos'
  const filtered = galeria.filter(
    (g) =>
      (country === 'todos' || g.entrega.paisSlug === country) &&
      (activity === 'todos' || String(g.entrega.atividade) === activity) &&
      (type === 'todos' || g.midia.type === type),
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Galeria' }]} />
      <div className="page-heading">
        <p className="eyebrow">Álbum de bordo</p>
        <h1>
          Uma jornada que
          <br />
          <span>merece ser vista.</span>
        </h1>
        <p>
          Imagens dos participantes, criações dos Países Virtuais e momentos de
          encontro. Explore o acervo completo e conheça as pessoas por trás das
          ideias.
        </p>
      </div>
      <div className="filter-bar">
        <label>
          País
          <select
            value={country}
            onChange={(e) => update('pais', e.target.value)}
          >
            <option value="todos">Todos os países</option>
            {paises.map((p) => (
              <option value={p.slug} key={p.slug}>
                {p.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Atividade
          <select
            value={activity}
            onChange={(e) => update('atividade', e.target.value)}
          >
            <option value="todos">Todas as atividades</option>
            {activities.map((a) => (
              <option key={a.numero} value={a.numero}>
                {a.titulo}
              </option>
            ))}
          </select>
        </label>
        <div className="filter-pills" role="group" aria-label="Tipo de mídia">
          {[
            ['todos', 'Tudo'],
            ['image', 'Fotos'],
            ['video', 'Vídeos'],
            ['document', 'Documentos'],
          ].map(([value, label]) => (
            <button
              aria-pressed={type === value}
              onClick={() => update('tipo', value)}
              key={value}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="text-link" onClick={clear}>
          Limpar filtros
        </button>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length} registros no acervo
      </p>
      {filtered.length ? (
        <GalleryGrid
          key={`${country}-${activity}-${type}`}
          items={filtered}
          headingLevel={2}
        />
      ) : (
        <div className="empty-state">
          <Icon name="image" size={40} />
          <h2>Esse álbum ainda está sendo criado.</h2>
          <p>Experimente outra seleção para continuar explorando.</p>
          <button className="button button-glass" onClick={clear}>
            Ver todos os registros
          </button>
        </div>
      )}
    </div>
  )
}

export function Parceiros() {
  usePageMeta(
    'Seja parceiro',
    'Apoie o protagonismo juvenil, a inovação e a educação no Planeta Jovem. Conheça possibilidades de parceria com o Pirambu Innovation.',
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Parceiros' }]} />
      <div className="page-heading partner-page-heading">
        <p className="eyebrow">O futuro se constrói em conjunto</p>
        <h1>
          Uma nova geração.
          <br />
          <span>Um mundo de impacto.</span>
        </h1>
        <p>{partnership.description}</p>
        <ContactButton>
          Quero ser parceiro <Icon name="arrow" />
        </ContactButton>
        <div className="partner-heading-orbit" aria-hidden="true">
          <Icon name="orbit" size={250} />
        </div>
      </div>
      <Impact />
      <section className="section">
        <SectionHeading
          eyebrow="Por que apoiar"
          title="O que sua parceria pode ajudar a construir."
        />
        <div className="role-grid">
          {partnership.arguments.map((a) => (
            <article key={a.title}>
              <span className="role-icon">
                <Icon name={a.icon} size={28} />
              </span>
              <div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="Possibilidades de parceria"
          title="Há muitas formas de fazer parte."
        />
        <div className="support-options">
          {partnership.possibilities.map((p, i) => (
            <article className="panel" key={p.title}>
              <span className="option-number">0{i + 1}</span>
              <Icon name={p.icon} size={32} />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
        <p className="section-intro partnership-note">{partnership.note}</p>
      </section>
      <PartnerBanner />
      <PartnerStrip />
    </div>
  )
}

export function Contato() {
  usePageMeta(
    'Contato',
    'Entre em contato com a organização do Planeta Jovem e conheça as possibilidades de parceria.',
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Contato' }]} />
      <div className="contact-page">
        <div className="contact-orbit">
          <Icon name="signal" size={58} />
        </div>
        <p className="eyebrow">Conexão aberta para novas ideias</p>
        <h1>
          Vamos conversar
          <br />
          <span>sobre o futuro?</span>
        </h1>
        <p>
          {contactUrl(false)
            ? 'Fale com a organização para conhecer a jornada e as possibilidades de colaboração.'
            : 'Nossos canais de contato estão sendo preparados. Em breve, este será mais um ponto de encontro entre o Planeta Jovem e a Terra.'}
        </p>
        <ContactButton partnership={false}>
          Falar com a organização <Icon name="arrow" />
        </ContactButton>
        <div className="contact-page-links">
          <Link className="text-link" to="/parceiros">
            Conhecer as possibilidades de parceria{' '}
            <Icon name="arrow" size={16} />
          </Link>
          <a
            className="text-link"
            href={siteConfig.institutionalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visitar o Pirambu Innovation <Icon name="external" size={16} />
          </a>
        </div>
      </div>
    </div>
  )
}
