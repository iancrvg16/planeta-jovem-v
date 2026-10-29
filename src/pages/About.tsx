import { usePageMeta } from '../lib/usePageMeta'
import { Link } from 'react-router-dom'
import { glossary, schedule } from '../data/journey'
import { site } from '../data/site'
import { Breadcrumb, SectionHeading } from '../components/ui'
import { Journey, Crew, EarthReturns } from '../components/Journey'
import { Icon } from '../components/Icon'

export default function About() {
  usePageMeta(
    'Sobre o projeto',
    'Entenda o Planeta Jovem: uma experiência educacional em que jovens criam Países Virtuais e propostas para o futuro, acompanhada da Terra por este portal público.',
  )
  return (
    <div className="container page-space">
      <Breadcrumb items={[{ label: 'Sobre o projeto' }]} />
      <div className="about-intro">
        <div className="page-heading">
          <p className="eyebrow">Protagonismo juvenil em órbita</p>
          <h1>
            E se um novo mundo
            <br />
            <span>fosse criado pelos jovens?</span>
          </h1>
          <p>
            O Planeta Jovem é um metagame educacional no qual jovens pesquisam,
            colaboram e criam propostas para problemas do futuro.
          </p>
        </div>
        <img
          src="/assets/planeta-jovem-oficial.png"
          alt="Marca oficial Planeta Jovem em rosa e roxo"
          width="400"
          height="250"
          className="official-logo"
        />
      </div>
      <section className="about-story panel">
        <p className="eyebrow">Do Planeta Velho a um novo começo</p>
        <h2>
          A imaginação abre o caminho.
          <br />A colaboração constrói o planeta.
        </h2>
        <p>
          Na narrativa do projeto, os jovens deixam o Planeta Velho, a Terra, e
          chegam ao Planeta Jovem. Organizados em Países Virtuais, os
          Tripulantes constroem histórias, identidades, leis e propostas. Cada
          escolha é uma oportunidade de aprender e criar em conjunto.
        </p>
        <p className="portal-purpose">
          Este portal é a conexão com a Terra: um espaço público para acompanhar
          as transmissões, conhecer os países e consultar os registros dessa
          experiência.
        </p>
      </section>
      <Journey />
      <Crew />
      <EarthReturns />
      <section className="section">
        <SectionHeading
          eyebrow="Da ideia aos registros"
          title="As entregas da jornada"
        />
        <div className="institution-grid">
          <article className="panel">
            <h3>Plano Diretor</h3>
            <p>
              Diagnóstico do problema do país, pesquisa e propostas de solução.
            </p>
          </article>
          <article className="panel">
            <h3>Manifesto para o Futuro</h3>
            <p>Governança, princípios, leis e acordos entre os países.</p>
          </article>
          <article className="panel">
            <h3>Desafios e Reviravoltas</h3>
            <p>
              Situações-problema que exigem criatividade, adaptação e decisões
              coletivas.
            </p>
          </article>
          <article className="panel">
            <h3>Encontros no Olimpo</h3>
            <p>
              Participação nos encontros gerais, com compartilhamento de
              experiências e aprendizados.
            </p>
          </article>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="Programação conhecida"
          title="Os primeiros passos"
        />
        <div className="schedule-list">
          {schedule.map((item) => (
            <article key={item.dateTime}>
              <time dateTime={item.dateTime}>{item.date}</time>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
        <Link className="text-link" to="/atividades">
          Agora: Fase 1 — Entregas Básicas <Icon name="arrow" />
        </Link>
      </section>
      <section className="slack-panel">
        <span className="crew-icon">
          <Icon name="signal" size={30} />
        </span>
        <div>
          <p className="eyebrow">Onde a jornada acontece</p>
          <h2>Como a jornada se organiza</h2>
          <p>
            O Slack funciona como o principal ambiente de comunicação,
            convivência, organização e registro das atividades. Cada País
            Virtual possui seus espaços de colaboração, acompanhados pelos
            Embaixadores.
          </p>
          <p className="caption">
            O acesso ao ambiente é orientado pela organização e pelos
            Embaixadores.
          </p>
        </div>
      </section>
      <section className="rights-section">
        <SectionHeading
          eyebrow="Acordos para ir mais longe"
          title="Participar também é cuidar."
        />
        <div className="rights-grid">
          <article className="panel">
            <Icon name="compass" size={25} />
            <h3>Direitos dos Tripulantes</h3>
            <ul>
              <li>
                Os Tripulantes têm acesso às plataformas e aos espaços da
                jornada.
              </li>
              <li>
                Os participantes recebem acompanhamento e orientação dos
                Embaixadores.
              </li>
              <li>
                Os jovens recebem as informações necessárias para as atividades
                e entregas.
              </li>
              <li>
                As condições de participação e o eventual apoio financeiro aos
                Tripulantes seguem as regras oficiais da edição.
              </li>
            </ul>
          </article>
          <article className="panel">
            <Icon name="flag" size={25} />
            <h3>Compromissos dos Tripulantes</h3>
            <ul>
              <li>
                Os Tripulantes participam dos encontros e cumprem os prazos das
                entregas.
              </li>
              <li>
                Os jovens colaboram com seus países e respeitam todos os
                participantes.
              </li>
              <li>
                Os participantes acompanham o Slack e registram sua presença e
                contribuição.
              </li>
              <li>
                Os Tripulantes respeitam as regras de convivência, sem assédio,
                discriminação, conteúdo ofensivo ou propaganda
                político-partidária.
              </li>
            </ul>
          </article>
        </div>
        <p className="muted">
          Este é um resumo. As regras de avaliação, reconhecimento, convivência
          e medidas em caso de descumprimento estão no documento completo.
        </p>
        <a
          className="text-link"
          href={site.manualUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Consultar o Manual do Tripulante
          <Icon name="external" size={17} />
        </a>
      </section>
      <section className="glossary">
        <SectionHeading
          eyebrow="Uma linguagem para esse universo"
          title="Pequeno dicionário intergaláctico"
        />
        <div className="glossary-grid">
          {glossary.map(([term, definition]) => (
            <details key={term}>
              <summary>
                {term}
                <Icon name="chevron" size={18} />
              </summary>
              <p>{definition}</p>
            </details>
          ))}
        </div>
      </section>
      <div className="bottom-callout">
        <Icon name="planet" size={30} />
        <p>Pronto para conhecer esse novo mundo?</p>
        <Link to="/paises" className="button button-primary">
          Explorar os países
          <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  )
}
