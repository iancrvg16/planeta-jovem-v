import { Component, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { Icon } from './components/Icon'
const Countries = lazy(() =>
  import('./pages/Countries').then((module) => ({ default: module.Countries })),
)
const CountryPage = lazy(() =>
  import('./pages/Countries').then((module) => ({
    default: module.CountryPage,
  })),
)
const News = lazy(() =>
  import('./pages/News').then((module) => ({ default: module.News })),
)
const NewsPage = lazy(() =>
  import('./pages/News').then((module) => ({ default: module.NewsPage })),
)
const Documents = lazy(() => import('./pages/Documents'))
const About = lazy(() => import('./pages/About'))
const Paises = lazy(() =>
  import('./pages/Paises').then((m) => ({ default: m.Paises })),
)
const Pais = lazy(() =>
  import('./pages/Paises').then((m) => ({ default: m.Pais })),
)
const Atividades = lazy(() =>
  import('./pages/Explore').then((m) => ({ default: m.Atividades })),
)
const Galeria = lazy(() =>
  import('./pages/Explore').then((m) => ({ default: m.Galeria })),
)
const Parceiros = lazy(() =>
  import('./pages/Explore').then((m) => ({ default: m.Parceiros })),
)
const Contato = lazy(() =>
  import('./pages/Explore').then((m) => ({ default: m.Contato })),
)

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError)
      return (
        <div className="container not-found" role="alert">
          <Icon name="signal" size={48} />
          <h1>Uma pausa na transmissão.</h1>
          <p>
            Não foi possível abrir esta página. Tente restabelecer a conexão.
          </p>
          <button
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
          <a className="text-link" href="/">
            Voltar à central
          </a>
        </div>
      )
    return this.props.children
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="loading-screen" role="status">
              <Icon name="orbit" size={40} />
              <p>Recebendo transmissão…</p>
            </div>
          }
        >
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route caseSensitive path="paises" element={<Paises />} />
              {['midoria', 'dolminn', 'olimpia'].map((slug) => (
                <Route
                  key={slug}
                  path={`paises/${slug}`}
                  element={<Navigate to={`/memoria/paises/${slug}`} replace />}
                />
              ))}
              <Route caseSensitive path="paises/:slug" element={<Pais />} />
              <Route caseSensitive path="memoria" element={<Countries />} />
              <Route
                caseSensitive
                path="memoria/paises/:slug"
                element={<CountryPage />}
              />
              <Route caseSensitive path="projeto" element={<About />} />
              <Route caseSensitive path="atividades" element={<Atividades />} />
              <Route caseSensitive path="galeria" element={<Galeria />} />
              <Route caseSensitive path="parceiros" element={<Parceiros />} />
              <Route caseSensitive path="contato" element={<Contato />} />
              <Route caseSensitive path="noticias" element={<News />} />
              <Route
                caseSensitive
                path="noticias/:slug"
                element={<NewsPage />}
              />
              <Route caseSensitive path="documentos" element={<Documents />} />
              <Route
                path="sobre"
                element={<Navigate to="/projeto" replace />}
              />
              <Route caseSensitive path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
