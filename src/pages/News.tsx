import { usePageMeta } from '../lib/usePageMeta'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { countries } from '../data/countries'
import { news } from '../data/news'
import { site } from '../data/site'
import {
  Badge,
  Breadcrumb,
  EmptyState,
  NewsCard,
  RelatedCountries,
  SectionHeading,
  ShareLink,
} from '../components/ui'
import { Icon } from '../components/Icon'
import { normalizeSearch, safeMediaUrl } from '../lib/media'
import NotFound from './NotFound'

export function News() {
  usePageMeta(
    'Notícias e transmissões',
    'Acontecimentos, descobertas e ideias transmitidos do Planeta Jovem para a Terra.',
  )
  const [params, setParams] = useSearchParams()
  const search = params.get('busca') ?? ''
  const category = params.get('categoria') ?? 'Todas'
  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value && value !== 'Todas') next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }
  const filtered = news.filter(
    (item) =>
      (category === 'Todas' || item.category === category) &&
      normalizeSearch(
        `${item.title} ${item.excerpt} ${item.body.map((paragraph) => paragraph.text).join(' ')}`,
      ).includes(normalizeSearch(search)),
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Notícias' }]} />
      <div className="page-heading">
        <p className="eyebrow">Central de transmissões</p>
        <h1>
          Um planeta inteiro
          <br />
          <span>de novas histórias.</span>
        </h1>
        <p>
          Acontecimentos, descobertas e ideias transmitidos do Planeta Jovem
          para a Terra.
        </p>
      </div>
      <div className="news-tools">
        <label className="search-box">
          <Icon name="search" size={20} />
          <span className="sr-only">Buscar notícias</span>
          <input
            type="search"
            value={search}
            placeholder="Buscar uma transmissão..."
            onChange={(event) => update('busca', event.target.value)}
          />
        </label>
        <div
          className="filter-pills"
          role="group"
          aria-label="Categorias de notícias"
        >
          {['Todas', ...new Set(news.map((item) => item.category))].map(
            (item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => update('categoria', item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
      </div>
      <p className="result-count" aria-live="polite">
        {filtered.length}{' '}
        {filtered.length === 1
          ? 'transmissão encontrada'
          : 'transmissões encontradas'}
      </p>
      {filtered.length ? (
        <div className="news-grid">
          {filtered.map((item) => (
            <NewsCard item={item} key={item.slug} headingLevel={2} />
          ))}
        </div>
      ) : (
        <>
          <EmptyState icon="search" title="Nenhuma transmissão encontrada">
            Experimente outra palavra ou escolha uma categoria diferente.
          </EmptyState>
          <button
            className="button button-ghost reset-search"
            onClick={() => setParams({})}
          >
            Limpar filtros
            <Icon name="close" size={16} />
          </button>
        </>
      )}
    </div>
  )
}
export function NewsPage() {
  const { slug } = useParams()
  const item = news.find((entry) => entry.slug === slug)
  usePageMeta(
    item?.title ?? 'Notícia não encontrada',
    item?.excerpt,
    undefined,
    !item,
  )
  if (!item) return <NotFound />
  const sourceUrl = safeMediaUrl(item.sourceUrl ?? site.manualUrl)
  const sourceTitle =
    item.sourceTitle ??
    'Manual do Tripulante Intergaláctico, setembro de 2026, versão 01 revisada'
  const related = news
    .filter((entry) => entry.slug !== item.slug)
    .sort(
      (a, b) =>
        Number(b.category === item.category) -
        Number(a.category === item.category),
    )
    .slice(0, 2)
  return (
    <div className="container page-space">
      <Breadcrumb
        items={[
          { label: 'Notícias', to: '/noticias' },
          { label: item.category },
        ]}
      />
      <article className="article">
        <header className="article-header">
          <div className="article-meta">
            <Badge tone="purple">{item.category}</Badge>
            <span>
              {item.publishedAt ? (
                <time dateTime={item.publishedAt}>
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'long',
                    timeZone: 'UTC',
                  }).format(new Date(`${item.publishedAt}T12:00:00Z`))}
                </time>
              ) : (
                item.dateLabel
              )}
            </span>
          </div>
          <h1>{item.title}</h1>
          <p>{item.excerpt}</p>
          {item.eventStatus && (
            <div className="event-notice">
              <Icon name="clock" size={18} />
              <span>
                {item.eventStatus === 'scheduled'
                  ? 'Previsto no manual · realização não confirmada'
                  : item.eventStatus === 'ongoing'
                    ? 'Em andamento'
                    : 'Realizado'}
                {item.eventDate && (
                  <>
                    {' '}
                    ·{' '}
                    <time dateTime={item.eventDate}>
                      {new Intl.DateTimeFormat('pt-BR', {
                        timeZone: 'UTC',
                      }).format(new Date(`${item.eventDate}T12:00:00Z`))}
                    </time>
                  </>
                )}
              </span>
            </div>
          )}
        </header>
        <img
          className="article-image"
          src={item.image}
          alt={item.imageAlt}
          width="900"
          height="450"
        />
        <div className="article-body">
          {item.body.map((paragraph, i) => (
            <div key={i}>
              {paragraph.heading && <h2>{paragraph.heading}</h2>}
              <p>{paragraph.text}</p>
            </div>
          ))}
          <RelatedCountries
            countries={countries.filter((country) =>
              item.countrySlugs.includes(country.slug),
            )}
          />
          <div className="source-note">
            <Icon name="book" size={21} />
            <div>
              <strong>Informação com origem</strong>
              <p>
                Baseado em: {sourceTitle}
                {item.sourcePages && `, páginas ${item.sourcePages}`}.
              </p>
              <a
                className="text-link"
                href={sourceUrl ?? site.manualUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.sourceTitle && sourceUrl
                  ? 'Consultar a fonte completa'
                  : 'Ler o manual completo'}
                <Icon name="external" size={16} />
              </a>
            </div>
          </div>
          <div className="article-actions">
            <Link className="text-link" to="/noticias">
              <Icon name="back" size={18} />
              Voltar às notícias
            </Link>
            <ShareLink />
          </div>
        </div>
      </article>
      <section className="related-news">
        <SectionHeading
          eyebrow="Continue em órbita"
          title="Outras transmissões"
        />
        <div className="news-grid">
          {related.map((entry) => (
            <NewsCard item={entry} key={entry.slug} />
          ))}
        </div>
      </section>
    </div>
  )
}
