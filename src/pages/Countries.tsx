import { usePageMeta } from '../lib/usePageMeta'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { countries } from '../data/countries'
import { news } from '../data/news'
import { site } from '../data/site'
import {
  Badge,
  Breadcrumb,
  CountryCard,
  EmptyState,
  NewsCard,
} from '../components/ui'
import { Icon } from '../components/Icon'
import { Lightbox, Repository } from '../components/Repository'
import NotFound from './NotFound'

export function Countries() {
  usePageMeta(
    'Países Virtuais — Arquivo histórico',
    'Conheça os oito Países Virtuais preservados na memória das edições anteriores do Planeta Jovem.',
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Países Virtuais' }]} />
      <div className="page-heading">
        <p className="eyebrow">Muitas vozes, um planeta</p>
        <h1>
          Países que já fizeram
          <br />
          <span>parte dessa história</span>
        </h1>
        <p>
          Estes oito Países Virtuais fazem parte da memória das edições
          anteriores do Planeta Jovem. As construções da 5ª edição têm um espaço
          próprio no portal.
        </p>
      </div>
      <div className="notice">
        <Icon name="compass" size={23} />
        <div>
          <strong>A memória continua. Uma nova edição já começou.</strong>
          <p>
            Os arquivos abaixo preservam a memória dos países. As bandeiras são
            estudos visuais provisórios, identificados em cada arquivo.
          </p>
          <Link className="text-link" to="/paises">
            Conhecer os cinco países da edição V <Icon name="arrow" />
          </Link>
        </div>
      </div>
      <div className="countries-grid">
        {countries.map((country) => (
          <CountryCard
            key={country.slug}
            country={country}
            featured
            headingLevel={2}
          />
        ))}
      </div>
      <div className="bottom-callout">
        <Icon name="orbit" size={28} />
        <p>O futuro de cada país é construído por quem participa.</p>
        <Link className="text-link" to="/sobre">
          Sobre o projeto
          <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  )
}
export function CountryPage() {
  const { slug } = useParams()
  const country = countries.find((item) => item.slug === slug)
  const [showFlag, setShowFlag] = useState(false)
  usePageMeta(
    country
      ? `${country.name}${country.isHistorical ? ' — Arquivo histórico' : ''}`
      : 'País não encontrado',
    country
      ? `Conheça o arquivo ${country.isHistorical ? 'histórico ' : ''}de ${country.name}: identidade, documentos e registros do País Virtual no Planeta Jovem.${country.isHistorical ? ' A participação na 5ª edição não está confirmada.' : ''}`
      : undefined,
    undefined,
    !country,
  )
  if (!country) return <NotFound />
  const flagLabel = country.isFlagProvisional
    ? 'Bandeira provisória'
    : 'Bandeira'
  const flagDescription = country.isFlagProvisional
    ? 'Estudo visual provisório. Não representa a bandeira oficial do país.'
    : 'Bandeira oficial do país.'
  const countryNews = news.filter((item) =>
    item.countrySlugs.includes(country.slug),
  )
  return (
    <div className="container page-space">
      <Breadcrumb
        items={[{ label: 'Países', to: '/paises' }, { label: country.name }]}
      />
      <div
        className="country-page-header"
        style={
          { '--country-color': country.accentColor } as React.CSSProperties
        }
      >
        <div>
          <p className="eyebrow">
            {country.isHistorical
              ? 'Arquivo do país / memória do projeto'
              : 'Arquivo do país / edição 05'}
          </p>
          <h1>
            {country.name}
            <span className="heading-dot" aria-hidden="true">
              *
            </span>
          </h1>
          <p>{country.summary}</p>
        </div>
        <Badge tone="purple">
          {country.isHistorical
            ? 'Arquivo histórico'
            : country.isProvisional
              ? 'Em atualização'
              : country.status === 'active'
                ? 'Ativo'
                : 'Em atualização'}
        </Badge>
      </div>
      {(country.isHistorical || country.isProvisional) && (
        <div className="notice">
          <Icon name="compass" size={21} />
          <p>
            {country.isHistorical
              ? `${country.name} faz parte da memória das edições anteriores. Este arquivo histórico não confirma sua participação na 5ª edição. Os registros oficiais serão acrescentados quando recebidos.`
              : `A presença de ${country.name} na edição atual ainda aguarda confirmação. As informações oficiais serão publicadas quando recebidas.`}
          </p>
        </div>
      )}
      <div className="country-layout">
        <div className="country-profile">
          <section className="panel country-identity">
            <button
              className="flag-preview"
              onClick={() => setShowFlag(true)}
              aria-label={`Ampliar ${flagLabel.toLowerCase()} de ${country.name}`}
            >
              <img
                src={country.flag}
                alt={`${flagLabel} de ${country.name}`}
                width="320"
                height="200"
              />
              <span>
                <Icon name="external" size={16} />
                Ampliar bandeira
              </span>
            </button>
            <div>
              <p className="eyebrow">Registros de identidade</p>
              <h2>
                Uma história escrita
                <br />
                em conjunto.
              </h2>
              <p>
                {country.history ??
                  'A história, a identidade e as escolhas coletivas do país serão publicadas neste arquivo quando os registros oficiais forem recebidos.'}
              </p>
              <span className="caption">{flagDescription}</span>
            </div>
          </section>
          <section className="panel country-records">
            <h2>Diário de identidade</h2>
            <dl>
              <div>
                <dt>Lema</dt>
                <dd>{country.motto ?? 'Transmissão ainda não recebida.'}</dd>
              </div>
              <div>
                <dt>Identidade</dt>
                <dd>{country.identity ?? 'Transmissão ainda não recebida.'}</dd>
              </div>
              <div>
                <dt>Trilhas</dt>
                <dd>
                  {country.tracks.length
                    ? country.tracks.join(' · ')
                    : 'Informações sobre as trilhas ainda não recebidas.'}
                </dd>
              </div>
              <div>
                <dt>Leis e protocolos</dt>
                <dd>
                  {country.laws.length ? (
                    <ul>
                      {country.laws.map((law) => (
                        <li key={law}>{law}</li>
                      ))}
                    </ul>
                  ) : (
                    'Os registros das leis e dos protocolos serão publicados quando recebidos.'
                  )}
                </dd>
              </div>
            </dl>
          </section>
          <Repository
            key={country.slug}
            items={[...country.gallery, ...country.documents]}
          />
        </div>
        <aside className="country-news">
          <p className="eyebrow">Conexão local</p>
          <h2>Transmissões de {country.name}</h2>
          {countryNews.length ? (
            countryNews.map((item) => (
              <NewsCard item={item} key={item.slug} compact />
            ))
          ) : (
            <EmptyState title="Aguardando a primeira transmissão">
              As notícias relacionadas a {country.name} aparecerão aqui quando
              forem recebidas.
            </EmptyState>
          )}
          <div className="country-reading">
            <p className="eyebrow">Contexto da missão</p>
            <h2>Entenda a experiência</h2>
            <p className="muted">
              Transmissões gerais que ajudam os terráqueos a compreender como o
              Planeta Jovem funciona.
            </p>
            {news
              .filter((item) =>
                [
                  'plano-diretor-construir-o-futuro',
                  'manual-intergalactico-disponivel',
                ].includes(item.slug),
              )
              .map((item) => (
                <NewsCard item={item} key={item.slug} compact />
              ))}
          </div>
          <a
            className="text-link"
            href={site.manualUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="book" size={18} />
            Consultar o manual completo
          </a>
        </aside>
      </div>
      {showFlag && (
        <Lightbox
          item={{
            id: 'flag',
            title: `${flagLabel} de ${country.name}`,
            type: 'image',
            status: 'available',
            url: country.flag,
            alt: `${flagLabel} de ${country.name}`,
            width: 320,
            height: 200,
            description: flagDescription,
            isDemonstrative: country.isFlagProvisional,
          }}
          onClose={() => setShowFlag(false)}
        />
      )}
    </div>
  )
}
