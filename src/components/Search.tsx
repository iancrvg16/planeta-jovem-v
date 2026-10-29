import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dialog } from './Dialog'
import { Icon } from './Icon'
import { paises } from '../data/paises'
import { entregas } from '../data/acervo'
import { normalizeSearch } from '../lib/media'
import { news } from '../data/news'
import { siteConfig } from '../config/site'

const index = [
  ...paises.map((c) => ({
    title: c.nome,
    text: `${c.resumo} ${c.lema ?? ''} ${c.missao ?? ''}`,
    label: 'País',
    url: `/paises/${c.slug}`,
  })),
  ...entregas.map((e) => ({
    title: e.titulo,
    text: `${e.descricao} ${e.responsaveis.join(' ')}`,
    label: `${paises.find((p) => p.slug === e.paisSlug)?.nome} · Entrega`,
    url: `/paises/${e.paisSlug}#${e.id}`,
  })),
  ...news.map((n) => ({
    title: n.title,
    text: n.excerpt,
    label: 'Acervo · Notícia',
    url: `/noticias/${n.slug}`,
  })),
  {
    title: 'Manual do Tripulante Intergaláctico',
    text: 'Papéis regras direitos compromissos glossário',
    label: 'Documento · PDF',
    url: siteConfig.manualUrl,
  },
]
export default function Search({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const found = query.trim()
    ? index.filter((i) =>
        normalizeSearch(`${i.title} ${i.text}`).includes(
          normalizeSearch(query),
        ),
      )
    : index.slice(0, 5)
  return (
    <Dialog
      title="Buscar no Planeta Jovem"
      onClose={onClose}
      className="search-dialog"
    >
      <p className="eyebrow">Encontre sua próxima descoberta</p>
      <h2>O que você procura?</h2>
      <label className="search-box">
        <Icon name="search" />
        <span className="sr-only">
          Buscar países, entregas, pessoas e documentos
        </span>
        <input
          type="search"
          placeholder="País, entrega, pessoa ou documento…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="result-count" aria-live="polite">
        {query ? `${found.length} resultados` : 'Comece pelos países'}
      </p>
      <div className="search-results">
        {found.map((i) =>
          i.url.endsWith('.pdf') ? (
            <a
              href={i.url}
              key={i.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>
                <small>{i.label}</small>
                <strong>{i.title}</strong>
              </span>
              <Icon name="external" />
            </a>
          ) : (
            <Link to={i.url} key={i.url} onClick={onClose}>
              <span>
                <small>{i.label}</small>
                <strong>{i.title}</strong>
              </span>
              <Icon name="arrow" />
            </Link>
          ),
        )}
        {!found.length && (
          <p className="empty-state">
            Nenhum sinal por aqui. Experimente outro nome ou palavra.
          </p>
        )}
      </div>
    </Dialog>
  )
}
