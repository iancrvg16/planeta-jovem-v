import { stages, roles, earthReturns } from '../data/journey'
import { Icon } from './Icon'
import { SectionHeading } from './ui'

export function Journey() {
  return (
    <section className="journey-section">
      <SectionHeading
        eyebrow="Da imaginação à transformação"
        title="O futuro é uma construção coletiva."
        link="/sobre"
        linkText="Sobre o projeto"
      />
      <p className="section-intro">
        Um metagame educacional onde jovens constroem países, enfrentam desafios
        e imaginam novas possibilidades para o mundo.
      </p>
      <div className="stages">
        {stages.map((stage) => (
          <article className="stage" key={stage.number}>
            <div className="stage-top">
              <Icon name={stage.icon} size={25} />
              <span>{stage.number}</span>
            </div>
            <h3>{stage.title}</h3>
            <p>{stage.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
export function EarthReturns() {
  return (
    <section
      className="earth-section"
      aria-label="O que chega de volta à Terra?"
    >
      <SectionHeading
        eyebrow="Da imaginação aos registros públicos"
        title="O que chega de volta à Terra?"
      />
      <p className="section-intro">
        O Planeta Jovem transforma imaginação, pesquisa e colaboração em
        registros que podem inspirar soluções para desafios reais.
      </p>
      <div className="crew-grid earth-grid">
        {earthReturns.map((item) => (
          <article className="crew-card" key={item.title}>
            <span className="crew-icon">
              <Icon name={item.icon} size={28} />
            </span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
export function Crew() {
  return (
    <section className="crew-section">
      <SectionHeading
        eyebrow="Diferentes papéis. O mesmo propósito."
        title="Ninguém explora o futuro sozinho."
      />
      <div className="crew-grid">
        {roles.map((role) => (
          <article className="crew-card" key={role.title}>
            <span className="crew-icon">
              <Icon name={role.icon} size={28} />
            </span>
            <div>
              <p className="eyebrow">{role.subtitle}</p>
              <h3>{role.title}</h3>
              <p>{role.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
