import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { siteConfig } from '../config/site'
import { Icon } from './Icon'
import { ContactButton } from './Contact'
import { Dialog } from './Dialog'
const Search = lazy(() => import('./Search'))

const links = [
  ['/', 'Início'],
  ['/projeto', 'O Projeto'],
  ['/paises', 'Países'],
  ['/atividades', 'Atividades'],
  ['/galeria', 'Galeria'],
  ['/parceiros', 'Parceiros'],
] as const
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Planeta Jovem — início">
      <img
        src="/assets/planeta-jovem-marca.webp"
        alt="Planeta Jovem"
        width="381"
        height="125"
      />
    </Link>
  )
}
function Header() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 20)
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearch(true)
      }
    }
    scroll()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('keydown', key)
    }
  }, [])
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <ContactButton className="button button-primary header-partner">
            Seja Parceiro <Icon name="arrow" size={15} />
          </ContactButton>
          <ContactButton className="header-contact" partnership={false}>
            Contato
          </ContactButton>
          <button
            className="icon-button search-toggle"
            onClick={() => setSearch(true)}
            aria-label="Abrir busca"
          >
            <Icon name="search" />
          </button>
          <button
            className="icon-button menu-toggle"
            aria-expanded={menu}
            aria-label="Abrir menu"
            onClick={() => setMenu(true)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </div>
      {menu && (
        <Dialog
          title="Menu de navegação"
          onClose={() => setMenu(false)}
          className="mobile-menu"
        >
          <Brand />
          <p className="eyebrow">Explore o Planeta Jovem</p>
          <nav aria-label="Navegação mobile">
            {links.map(([to, label], i) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenu(false)}
              >
                <span>0{i + 1}</span>
                {label}
                <Icon name="arrow" />
              </NavLink>
            ))}
            <Link to="/contato" onClick={() => setMenu(false)}>
              <span>07</span>Contato
              <Icon name="arrow" />
            </Link>
          </nav>
          <p>A conexão com a Terra.</p>
        </Dialog>
      )}
      {search && (
        <Suspense fallback={null}>
          <Search onClose={() => setSearch(false)} />
        </Suspense>
      )}
    </header>
  )
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Brand />
          <p>A conexão com a Terra.</p>
          <span className="connection-label">
            <span className="signal-dot" /> O futuro também é seu.
          </span>
        </div>
        <div>
          <h2>Explore o planeta</h2>
          <nav aria-label="Navegação do rodapé">
            {links.slice(1).map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
              </Link>
            ))}
            <Link to="/contato">Contato</Link>
          </nav>
        </div>
        <div>
          <h2>Arquivo de bordo</h2>
          <nav aria-label="Acervo do projeto">
            <a
              href={siteConfig.manualUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Manual do Tripulante <Icon name="external" size={13} />
            </a>
            <Link to="/documentos">Documentos e edições</Link>
            <Link to="/noticias">Notícias e transmissões</Link>
            <Link to="/memoria">Países na memória</Link>
            <a
              href={siteConfig.historicalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Acervo da 2ª edição <Icon name="external" size={13} />
            </a>
          </nav>
        </div>
        <div className="footer-institution">
          <p className="eyebrow">Uma realização</p>
          <a
            href={siteConfig.institutionalUrl}
            className="pirambu-wordmark"
            target="_blank"
            rel="noopener noreferrer"
          >
            pirambu
            <span>
              innovation <Icon name="external" size={14} />
            </span>
          </a>
          <p>
            Educação, tecnologia
            <br />e protagonismo juvenil.
          </p>
          <div className="social-links">
            {Object.entries(siteConfig.redes)
              .filter(([, url]) => !!url)
              .map(([label, url]) => (
                <a
                  key={label}
                  href={url}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="external" />
                  {label}
                </a>
              ))}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Planeta Jovem · Pirambu Innovation</span>
        <span>
          Feito de ideias. Movido por pessoas. <Icon name="spark" size={14} />
        </span>
      </div>
    </footer>
  )
}

export default function Layout() {
  const location = useLocation()
  const previous = useRef(location.pathname)
  const [top, setTop] = useState(false)
  useEffect(() => {
    const scroll = () => setTop(scrollY > 700)
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  useEffect(() => {
    let timer = 0
    if (location.hash) {
      // An invalid external fragment must not interrupt navigation.
      let id: string | undefined
      try {
        id = decodeURIComponent(location.hash.slice(1))
      } catch {
        id = undefined
      }
      if (id)
        timer = window.setTimeout(
          () =>
            document
              .getElementById(id)
              ?.scrollIntoView({ behavior: 'instant', block: 'start' }),
          180,
        )
    } else if (previous.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document
        .querySelector<HTMLElement>('main')
        ?.focus({ preventScroll: true })
    }
    previous.current = location.pathname
    return () => clearTimeout(timer)
  }, [location.pathname, location.hash])
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }),
      { rootMargin: '0px 0px 40px 0px', threshold: 0.04 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [location.pathname])
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header key={location.pathname} />
      <main id="conteudo" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {top && (
        <button
          className="back-to-top icon-button"
          aria-label="Voltar ao topo"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'instant'
                : 'smooth',
            })
            document
              .querySelector<HTMLElement>('.brand')
              ?.focus({ preventScroll: true })
          }}
        >
          <Icon name="up" />
        </button>
      )}
    </>
  )
}
