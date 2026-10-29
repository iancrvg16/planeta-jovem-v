import { usePageMeta } from '../lib/usePageMeta'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
export default function NotFound() {
  usePageMeta('Transmissão não encontrada', undefined, undefined, true)
  return (
    <div className="container not-found">
      <Icon name="orbit" size={70} />
      <p className="eyebrow">Código 404 · fora de órbita</p>
      <h1>Perdido no espaço.</h1>
      <p>O endereço pode ter mudado ou ainda não fazer parte do nosso mapa.</p>
      <Link className="button button-primary" to="/">
        Voltar à Terra / Início
        <Icon name="arrow" size={18} />
      </Link>
    </div>
  )
}
