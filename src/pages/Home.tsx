import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/usePageMeta'
import { OtherEditions } from '../components/OtherEditions'
import { homeContent, journey } from '../data/editorial'
import { entregasOrdenadas, galeria, mediaFile } from '../data/acervo'
import hero from '../data/generated/hero.json' with { type: 'json' }
import { roles } from '../data/journey'
import { siteConfig } from '../config/site'
import { Icon } from '../components/Icon'
import {
  CountryCards,
  DeliveryCards,
  Impact,
  PartnerBanner,
  PartnerStrip,
} from '../components/Content'
import {
  GalleryGrid,
  MediaLightbox,
  ResponsiveImage,
} from '../components/MediaGallery'
import { ContactButton } from '../components/Contact'
import { SectionHeading } from '../components/ui'

const shortcuts = [
  {
    title: 'O Projeto',
    text: 'Grandes ideias começam aqui.',
    icon: 'orbit',
    href: '/projeto',
    style: 'project',
  },
  {
    title: 'Nossos Países',
    text: 'Cinco mundos. Muitas vozes.',
    icon: 'planet',
    href: '/paises',
    style: 'countries',
  },
  {
    title: 'Impacto',
    text: 'O futuro já está acontecendo.',
    icon: 'sun',
    href: '/#impacto',
    style: 'impact',
  },
  {
    title: 'Apoie',
    text: 'Faça parte dessa transformação.',
    icon: 'rocket',
    href: '/parceiros',
    style: 'support',
  },
] as const
const previewIds = [
  'a-casas',
  'g-tripulantes',
  'j-alejandro',
  'a-territorio',
  'j-cafe-larissa',
  'a-centro',
  'j-ana',
]
export default function Home() {
  usePageMeta('Planeta Jovem V — A conexão com a Terra', siteConfig.description)
  const [video, setVideo] = useState<string | null>(null)
  const heroRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (
      matchMedia('(prefers-reduced-motion: reduce), (max-width: 768px)').matches
    )
      return
    let frame = 0
    const scroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() =>
        heroRef.current?.style.setProperty(
          '--parallax',
          `${Math.min(scrollY * 0.07, 38)}px`,
        ),
      )
    }
    window.addEventListener('scroll', scroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', scroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <>
      <section className="hero" ref={heroRef}>
        <div className="hero-image">
          <picture>
            <source
              type="image/avif"
              srcSet={hero.avifSrcSet}
              sizes="(max-width: 768px) 100vw, 82vw"
            />
            <img
              src={hero.src}
              srcSet={hero.srcSet}
              sizes="(max-width: 768px) 100vw, 82vw"
              alt="Quatro jovens de mochila chegam diante de um planeta com anéis, montanhas, cachoeiras e uma cidade iluminada."
              width={hero.width}
              height={hero.height}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
        <div className="hero-stars" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="signal-dot" />
              {homeContent.eyebrow}
            </p>
            <h1>
              Chegamos ao
              <br />
              <span>Planeta Jovem.</span>
            </h1>
            <p className="hero-description">{homeContent.subtitle}</p>
            <div className="hero-actions">
              <Link to="/paises" className="button button-primary">
                Conheça os países <Icon name="arrow" size={18} />
              </Link>
              <ContactButton className="button button-glass">
                Seja Parceiro <Icon name="heart" size={17} />
              </ContactButton>
            </div>
            <div className="hero-note">
              <span className="tiny-orbit">
                <Icon name="orbit" size={22} />
              </span>
              <span>
                Ideias que atravessam fronteiras.
                <br />
                <strong>Histórias que chegam até você.</strong>
              </span>
            </div>
          </div>
          <button className="arrival-button" onClick={() => setVideo('g-voo')}>
            <span className="play-circle">
              <Icon name="play" size={20} />
            </span>
            <span>
              Assista à chegada<small>Uma nova jornada começa</small>
            </span>
            <Icon name="arrow" size={17} />
          </button>
          <div className="hero-coordinate" aria-hidden="true">
            <span>DESTINO: FUTURO</span>
            <i />
            EDIÇÃO V / 2026
          </div>
        </div>
      </section>
      <div className="container shortcut-grid">
        {shortcuts.map((card, i) => (
          <Link
            key={card.title}
            to={card.href}
            className={`shortcut shortcut-${card.style}`}
          >
            <span className="shortcut-number">0{i + 1} / EXPLORE</span>
            <div className="shortcut-orbit" aria-hidden="true">
              <Icon name={card.icon} size={65} />
            </div>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
            <span className="shortcut-arrow">
              <Icon name="arrow" size={18} />
            </span>
          </Link>
        ))}
      </div>
      <div className="container home-sections">
        <Impact />
        <section className="section project-preview reveal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="eyebrow-line" /> Muito além da imaginação
              </p>
              <h2>{homeContent.project}</h2>
            </div>
            <Link className="text-link" to="/projeto">
              Conheça o projeto <Icon name="arrow" />
            </Link>
          </div>
          <div className="project-intro">
            <p>{homeContent.projectText}</p>
            <a
              href={siteConfig.manualUrl}
              className="manual-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="book" size={28} />
              <span>
                Ler o Manual do Tripulante
                <small>O mapa da nossa jornada · PDF</small>
              </span>
              <Icon name="download" size={19} />
            </a>
          </div>
          <div className="role-grid">
            {roles.map((role, i) => (
              <article key={role.title}>
                <span className={`role-icon role-${i}`}>
                  <Icon name={role.icon} size={25} />
                </span>
                <div>
                  <h3>{role.title}</h3>
                  <p>{role.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section countries-section reveal">
          <SectionHeading
            eyebrow="Muitas vozes, um planeta"
            title="Cada país, um novo jeito de imaginar."
            link="/paises"
            linkText="Explorar os países"
          />
          <p className="section-intro">
            Territórios criados por jovens. Identidades que ganham forma a cada
            descoberta.
          </p>
          <CountryCards />
        </section>
        <section className="section journey-section reveal">
          <SectionHeading
            eyebrow="Da chegada à transformação"
            title="Toda grande mudança é uma jornada."
          />
          <div className="journey-grid">
            {journey.map((step, i) => (
              <article key={step.title} className={`journey-step step-${i}`}>
                <div>
                  <span>0{i + 1}</span>
                  <Icon name={step.icon} size={35} />
                </div>
                <span className="journey-label">{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section reveal">
          <SectionHeading
            eyebrow="Diário da jornada"
            title="O que está acontecendo por aqui."
            link="/atividades"
            linkText="Ver todas as atividades"
          />
          <DeliveryCards
            items={entregasOrdenadas
              .filter(
                (e) => e.dataISO && e.midias.some((m) => m.type === 'image'),
              )
              .slice(0, 3)}
          />
        </section>
        <section className="section challenge-section reveal">
          <div className="challenge-intro">
            <p className="eyebrow">Desafios e Reviravoltas</p>
            <h2>E quando o inesperado acontece?</h2>
            <p>
              Os tripulantes decidem juntos. Em Jakkar, um incêndio na
              Biblioteca Ancestral abriu uma conversa sobre memória, cuidado e o
              futuro do conhecimento.
            </p>
            <Link to="/paises/jakkar#desafios" className="text-link">
              Conhecer a história <Icon name="arrow" />
            </Link>
          </div>
          <div className="challenge-content">
            <DeliveryCards
              items={entregasOrdenadas.filter((e) =>
                ['j-incendio', 'j-biblioteca'].includes(e.id),
              )}
            />
            <Link className="challenge-footnote" to="/paises/jakkar#j-debate">
              <Icon name="orbit" />
              Do debate à decisão coletiva. Conheça as propostas.
            </Link>
            <Link className="text-link" to="/paises/jakkar#j-pandemia">
              Explore também: Pandemia Jakkar <Icon name="arrow" />
            </Link>
          </div>
        </section>
        <section className="section reveal">
          <SectionHeading
            eyebrow="Intercâmbio entre países"
            title="O encontro é parte da descoberta."
          />
          <p className="section-intro">
            Uma visita, uma conversa, uma nova perspectiva. As histórias dos
            países também se cruzam.
          </p>
          <DeliveryCards
            items={entregasOrdenadas.filter((e) =>
              e.tags.includes('intercambio'),
            )}
          />
        </section>
        <section className="section video-feature reveal">
          <div className="video-feature-copy">
            <p className="eyebrow">Uma transmissão de Galixandria</p>
            <h2>
              Um país inteiro.
              <br />
              Uma história para contar.
            </h2>
            <p>
              Da natureza à Saúde Digital, conheça a identidade, os territórios
              e as ideias de Galixandria nos registros do país.
            </p>
            <Link className="button button-glass" to="/paises/galixandria">
              Conhecer Galixandria <Icon name="arrow" />
            </Link>
          </div>
          <Link
            className="video-feature-image"
            to="/paises/galixandria#identidade"
            aria-label="Conhecer a identidade de Galixandria"
          >
            <ResponsiveImage
              media={mediaFile('1789400638988.png')}
              alt="Bandeira de Galixandria"
              sizes="(max-width: 768px) 90vw, 650px"
            />
          </Link>
        </section>
        <section className="section reveal">
          <SectionHeading
            eyebrow="Álbum de bordo"
            title="Pessoas reais. Mundos possíveis."
            link="/galeria"
            linkText="Ver galeria completa"
          />
          <p className="section-intro">
            Registros e criações visuais enviados pelos participantes, incluindo
            suas representações nos Países Virtuais.
          </p>
          <GalleryGrid
            items={galeria
              .filter(
                (g) =>
                  previewIds.includes(g.entrega.id) && g.midia.type === 'image',
              )
              .slice(0, 8)}
            mosaic
          />
        </section>
        <OtherEditions />
        <PartnerBanner />
        <PartnerStrip />
        <div className="closing-line">
          <Icon name="spark" size={22} />
          <p>{homeContent.closing}</p>
        </div>
      </div>
      {video && (
        <MediaLightbox
          items={galeria.filter((g) => g.entrega.id === video)}
          onClose={() => setVideo(null)}
        />
      )}
    </>
  )
}
