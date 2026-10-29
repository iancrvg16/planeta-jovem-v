import { Link, useParams } from 'react-router-dom'
import type { CSSProperties } from 'react'
import { paises } from '../data/paises'
import {
  documentos,
  entregasOrdenadas,
  galeria,
  mediaFile,
} from '../data/acervo'
import { usePageMeta } from '../lib/usePageMeta'
import { Breadcrumb, SectionHeading } from '../components/ui'
import {
  CountryCards,
  CountryEmblem,
  DeliveryCards,
  DocumentDownloads,
  InstitutionCards,
  Steps,
} from '../components/Content'
import {
  GalleryGrid,
  ImageZoom,
  ResponsiveImage,
} from '../components/MediaGallery'
import { Icon } from '../components/Icon'
import NotFound from './NotFound'
import { CountryPage as HistoricalCountry } from './Countries'
import { countries as historicalCountries } from '../data/countries'

export function Paises() {
  usePageMeta(
    'Países Virtuais',
    'Explore Galixandria, Astalânia, Jakkar, Jambor e Lervúria. Cinco Países Virtuais criados pelos jovens no Planeta Jovem V.',
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Países' }]} />
      <div className="page-heading">
        <p className="eyebrow">Muitas vozes, um planeta · Edição V</p>
        <h1>
          Cinco mundos.
          <br />
          <span>Infinitas possibilidades.</span>
        </h1>
        <p>
          Cada país nasce das ideias de seus tripulantes. Explore identidades,
          territórios e decisões que estão construindo o futuro.
        </p>
      </div>
      <CountryCards headingLevel={2} />
      <div className="bottom-callout">
        <Icon name="book" size={28} />
        <div>
          <h2>Uma história que vem de longe.</h2>
          <p>
            Conheça também os países que fizeram parte das edições anteriores.
          </p>
        </div>
        <Link to="/memoria" className="text-link">
          Explorar a memória <Icon name="arrow" />
        </Link>
      </div>
    </div>
  )
}

export function Pais() {
  const { slug } = useParams()
  const country = paises.find((p) => p.slug === slug)
  usePageMeta(
    country?.nome ?? 'País não encontrado',
    country?.resumo,
    country ? `/og/${country.slug}.jpg` : undefined,
    !country,
  )
  if (!country)
    return historicalCountries.some((p) => p.slug === slug) ? (
      <HistoricalCountry />
    ) : (
      <NotFound />
    )
  const all = entregasOrdenadas.filter((e) => e.paisSlug === country.slug)
  const docs = documentos.filter((d) => d.country === country.slug)
  const countryGallery = galeria.filter(
    (g) => g.entrega.paisSlug === country.slug && g.midia.type !== 'document',
  )
  const index = paises.findIndex((p) => p.slug === country.slug)
  const prev = paises[(index - 1 + paises.length) % paises.length],
    next = paises[(index + 1) % paises.length]
  const nav = [
    ['identidade', 'Identidade', country.bandeira],
    ['governo', 'Governo', country.governo],
    ['leis', 'Leis', country.leis?.length],
    ['territorio', 'Território', country.territorio],
    ['projetos', 'Projetos', country.projetos?.length],
    ['desafios', 'Desafios', country.desafios?.length],
    ['entregas', 'Entregas', all.length],
    ['galeria-pais', 'Galeria', countryGallery.length],
    ['documentos-pais', 'Documentos', docs.length],
  ] as const
  return (
    <div
      className={`country-page ${country.slug}`}
      style={
        {
          '--country-color': country.cores.destaque,
          '--country-bg': country.cores.primaria,
        } as CSSProperties
      }
    >
      <div className="container page-space">
        <Breadcrumb
          items={[{ label: 'Países', to: '/paises' }, { label: country.nome }]}
        />
        <section className="country-hero">
          <div className="country-hero-copy">
            <p className="eyebrow">País Virtual · Planeta Jovem V</p>
            <span className="badge">
              {country.status === 'ativo' ? 'Em construção ativa' : 'Em breve'}
            </span>
            <h1>{country.nome}</h1>
            {country.lema && (
              <p className="country-hero-motto">{country.lema}</p>
            )}
            {country.lemaProvisorio && (
              <span className="caption">
                Slogan da peça de identidade nacional
              </span>
            )}
            <p>{country.resumo}</p>
            <div className="country-facts">
              {country.governo && (
                <span>
                  <Icon name="flag" size={16} />
                  {country.governo.modelo}
                </span>
              )}
              {country.territorio?.capital && (
                <span>
                  <Icon name="sun" size={16} />
                  Capital: {country.territorio.capital}
                </span>
              )}
              {country.moeda && <span>{country.moeda.nome}</span>}
            </div>
          </div>
          <div className="country-hero-art">
            {country.bandeira ? (
              <ResponsiveImage
                media={mediaFile(country.bandeira.arquivo)}
                alt={`Bandeira de ${country.nome}`}
                eager
                sizes="(max-width: 768px) 90vw, 560px"
              />
            ) : (
              <CountryEmblem country={country} large />
            )}
            <CountryEmblem country={country} />
          </div>
        </section>
        {country.status === 'em-breve' ? (
          <section className="section">
            <SectionHeading
              eyebrow="Enquanto isso, explore"
              title="Outras histórias já começaram."
            />
            <CountryCards items={paises.filter((p) => p.status === 'ativo')} />
          </section>
        ) : (
          <>
            <nav
              className="country-section-nav"
              aria-label={`Nesta página de ${country.nome}`}
            >
              {nav
                .filter(([, , exists]) => exists)
                .map(([id, name]) => (
                  <a key={id} href={`#${id}`}>
                    {name}
                  </a>
                ))}
            </nav>
            <section className="section quick-facts">
              <SectionHeading
                eyebrow="Passaporte do país"
                title="Um pouco da nossa identidade."
              />
              <dl>
                <div>
                  <dt>Missão e foco</dt>
                  <dd>{country.missao}</dd>
                </div>
                {country.lema && (
                  <div>
                    <dt>{country.lemaProvisorio ? 'Slogan' : 'Lema'}</dt>
                    <dd>{country.lema}</dd>
                  </div>
                )}
                {country.governo && (
                  <div>
                    <dt>Governo</dt>
                    <dd>{country.governo.modelo}</dd>
                  </div>
                )}
                {country.territorio?.capital && (
                  <div>
                    <dt>Capital</dt>
                    <dd>{country.territorio.capital}</dd>
                  </div>
                )}
                {country.moeda && (
                  <div>
                    <dt>Moeda</dt>
                    <dd>{country.moeda.nome}</dd>
                  </div>
                )}
              </dl>
              {country.historia && (
                <div className="paper">
                  <h3>De onde viemos</h3>
                  <p>{country.historia}</p>
                </div>
              )}
              {country.valores && (
                <div className="value-tags">
                  {country.valores.map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
              )}
              {country.principios && (
                <div className="paper">
                  <h3>Princípios do país</h3>
                  <ul>
                    {country.principios.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
            {country.bandeira && (
              <section className="section" id="identidade">
                <SectionHeading
                  eyebrow="Símbolos de uma nação"
                  title="Identidade nacional"
                />
                <div className="identity-grid">
                  <ImageZoom
                    media={mediaFile(country.bandeira.arquivo)}
                    caption={`Bandeira de ${country.nome}`}
                  />
                  <div className="paper">
                    <h3>Cores e símbolos</h3>
                    <ul>
                      {country.bandeira.significado.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {country.brasao && (
                  <div className="coat-section">
                    <ImageZoom
                      media={mediaFile(country.brasao)}
                      caption={`Brasão oficial de ${country.nome}`}
                    />
                    {country.slug === 'galixandria' && (
                      <div>
                        <h3>Natureza, ciência e união.</h3>
                        <p>
                          O brasão reúne a estrela de Solara, montanhas,
                          floresta, cachoeira, rio, ondas e folhagem tropical.
                          Os símbolos de saúde e tecnologia representam a missão
                          de Saúde Digital.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {country.hino && (
                  <div className="hymn-section">
                    <div>
                      <p className="eyebrow">A voz do país</p>
                      <h3>{country.hino.titulo}</h3>
                      {country.hino.autoria && (
                        <p className="credit">
                          Letra por {country.hino.autoria}
                        </p>
                      )}
                      {country.hino.imagem && (
                        <ImageZoom
                          media={mediaFile(country.hino.imagem)}
                          caption={country.hino.titulo}
                        />
                      )}
                      {country.hino.guia && (
                        <div className="panel">
                          <h4>Guia musical</h4>
                          <p>{country.hino.guia}</p>
                        </div>
                      )}
                    </div>
                    <div className="paper hymn-lyrics">
                      {country.hino.revisao && (
                        <span className="transcription-note">
                          Transcrição — revisar
                        </span>
                      )}
                      <p>{country.hino.letra}</p>
                    </div>
                  </div>
                )}
              </section>
            )}
            {country.governo && (
              <section className="section" id="governo">
                <SectionHeading
                  eyebrow="Decidir e construir em conjunto"
                  title="Governo e instituições"
                />
                <div className="paper">
                  <h3>{country.governo.modelo}</h3>
                  <p>{country.governo.descricao}</p>
                </div>
                {country.governo.liderancas && (
                  <InstitutionCards items={country.governo.liderancas} />
                )}
                <InstitutionCards items={country.governo.conselhos} />
                {country.governo.ministerios && (
                  <>
                    <h3 className="subsection-title">Ministérios</h3>
                    <InstitutionCards items={country.governo.ministerios} />
                  </>
                )}
                {country.governo.processo && (
                  <>
                    <h3 className="subsection-title">Da sugestão à ação</h3>
                    <Steps items={country.governo.processo} />
                  </>
                )}
              </section>
            )}
            {!!country.leis?.length && (
              <section className="section" id="leis">
                <SectionHeading
                  eyebrow="Acordos que nos orientam"
                  title="Leis do país"
                />
                <div className="laws">
                  {country.leis.map((l) => (
                    <details key={l.nome}>
                      <summary>
                        <span>
                          {l.numero && <small>Lei nº {l.numero}</small>}
                          {l.nome}
                        </span>
                        <Icon name="chevron" />
                      </summary>
                      <div className="paper">
                        <p>
                          <strong>Objetivo:</strong> {l.objetivo}
                        </p>
                        <ul>
                          {l.itens.map((i) => (
                            <li key={i}>{i}</li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
            {country.territorio && (
              <section className="section" id="territorio">
                <SectionHeading
                  eyebrow="Um mundo para explorar"
                  title="Território e cidades"
                />
                {country.territorio.mapa && (
                  <ImageZoom
                    media={mediaFile(country.territorio.mapa)}
                    caption={
                      country.territorio.autoria
                        ? `Mapa por ${country.territorio.autoria}`
                        : `Mapa das cidades de ${country.nome}`
                    }
                  />
                )}
                {country.territorio.cidades && (
                  <div className="paper">
                    <h3>Cidades no universo de Galixandria</h3>
                    <p className="caption">
                      Populações fictícias apresentadas no mapa do país.
                    </p>
                    <ul className="city-list">
                      {country.territorio.cidades.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <InstitutionCards items={country.territorio.regioes} />
                {country.territorio.rios && (
                  <div className="paper">
                    <h3>Rios e montanhas</h3>
                    <p>
                      <strong>Rios:</strong>{' '}
                      {country.territorio.rios.join(' · ')}.
                    </p>
                    <p>
                      <strong>Montanhas:</strong>{' '}
                      {country.territorio.montanhas?.join(' · ')}.
                    </p>
                  </div>
                )}
              </section>
            )}
            {country.moeda && (
              <section className="section currency-section">
                <SectionHeading
                  eyebrow="Economia e identidade"
                  title={country.moeda.nome}
                />
                <p className="section-intro">{country.moeda.descricao}</p>
                <div className="banknote-grid">
                  {country.moeda.cedulas.map((c, i) => (
                    <article className={`banknote note-${i}`} key={c.valor}>
                      <span>A$</span>
                      <strong>{c.valor}</strong>
                      <Icon name="wave" size={48} />
                      <p>{c.tema}</p>
                      <small>ASTALÂNIA · PROPOSTA DE CÉDULA</small>
                    </article>
                  ))}
                </div>
                <p className="caption">Moedas: {country.moeda.moedas}</p>
              </section>
            )}
            {!!country.projetos?.length && (
              <section className="section" id="projetos">
                <SectionHeading
                  eyebrow="Ideias que ganham forma"
                  title="Projetos e destaques"
                />
                <InstitutionCards items={country.projetos} />
                {country.eixos && (
                  <>
                    <h3 className="subsection-title">
                      Os quatro eixos de Saúde Digital
                    </h3>
                    <InstitutionCards items={country.eixos} />
                  </>
                )}
                {country.estrategia && (
                  <>
                    <h3 className="subsection-title">
                      Estratégia de execução imediata
                    </h3>
                    <Steps items={country.estrategia} />
                  </>
                )}
              </section>
            )}
            {!!country.desafios?.length && (
              <section className="section" id="desafios">
                <SectionHeading
                  eyebrow="Quando o inesperado acontece"
                  title="Desafios e Reviravoltas"
                />
                <InstitutionCards
                  items={country.desafios.map((d) => ({
                    nome: d.titulo,
                    descricao: d.descricao,
                  }))}
                />
                <DeliveryCards
                  items={all.filter((e) => e.tags.includes('reviravolta'))}
                />
              </section>
            )}
            <section className="section" id="entregas">
              <SectionHeading
                eyebrow="Diário da jornada"
                title={`As construções de ${country.nome}`}
              />
              <p className="section-intro">
                Registros com data aparecem em ordem cronológica, dos mais
                recentes aos primeiros. As demais criações estão identificadas
                como data não informada.
              </p>
              <DeliveryCards items={all} timeline />
            </section>
            {countryGallery.length > 0 && (
              <section className="section" id="galeria-pais">
                <SectionHeading
                  eyebrow="Álbum de bordo"
                  title="Imagens, encontros e descobertas."
                />
                <GalleryGrid items={countryGallery} />
              </section>
            )}
            {docs.length > 0 && (
              <section className="section" id="documentos-pais">
                <SectionHeading
                  eyebrow="Arquivo público"
                  title="Documentos oficiais"
                />
                <DocumentDownloads items={docs} />
              </section>
            )}
          </>
        )}
        <nav className="country-pagination" aria-label="Outros países">
          <Link to={`/paises/${prev.slug}`}>
            <Icon name="back" />
            <span>
              <small>País anterior</small>
              {prev.nome}
            </span>
          </Link>
          <Link to="/paises" className="all-countries-link">
            <Icon name="planet" />
            Todos os países
          </Link>
          <Link to={`/paises/${next.slug}`}>
            <span>
              <small>Próximo país</small>
              {next.nome}
            </span>
            <Icon name="arrow" />
          </Link>
        </nav>
      </div>
    </div>
  )
}
