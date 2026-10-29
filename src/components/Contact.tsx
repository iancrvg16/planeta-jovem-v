import { useState } from 'react'
import { Link } from 'react-router-dom'
import { contactUrl, siteConfig, type ContactChannels } from '../config/site'
import { Dialog } from './Dialog'
import { Icon } from './Icon'

export function ContactButton({
  children = 'Quero ser parceiro',
  className = 'button button-primary',
  partnership = true,
  channels,
}: {
  children?: React.ReactNode
  className?: string
  partnership?: boolean
  channels?: ContactChannels
}) {
  const [open, setOpen] = useState(false)
  const url = contactUrl(partnership, channels)
  return (
    <>
      {url ? (
        <a
          href={url}
          className={className}
          {...(url.startsWith('https:')
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {children}
        </a>
      ) : (
        <button className={className} onClick={() => setOpen(true)}>
          {children}
        </button>
      )}
      {open && (
        <Dialog
          title="Vamos construir o futuro juntos"
          onClose={() => setOpen(false)}
          className="contact-dialog"
        >
          <div className="contact-orbit">
            <Icon name="planet" size={58} />
          </div>
          <p className="eyebrow">Uma conexão que está chegando</p>
          <h2>Vamos construir o futuro juntos.</h2>
          <p>
            Canal de parcerias em configuração — em breve você poderá falar com
            a gente por aqui.
          </p>
          <Link
            className="button button-primary"
            to="/parceiros"
            onClick={() => setOpen(false)}
          >
            Conhecer as possibilidades <Icon name="arrow" />
          </Link>
          <a
            className="text-link"
            href={siteConfig.institutionalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conhecer o Pirambu Innovation <Icon name="external" size={16} />
          </a>
        </Dialog>
      )}
    </>
  )
}
