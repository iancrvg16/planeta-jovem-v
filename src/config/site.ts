import { site as original } from '../data/site'

export const siteConfig = {
  ...original,
  marcoZero: '2026-09-12',
  heroAlta: '_referencias/hero-alta.jpg', // TODO: obter hero em alta resolução; processar com npm run processar:entregas.
  // Canal já publicado pelo Pirambu Innovation; não presume WhatsApp nem e-mail ativo.
  contato: {
    email: '',
    whatsapp: '',
    formularioParceirosUrl: '',
    paginaInstitucionalUrl: 'https://pirambu-innovation.vercel.app/contato/',
  },
  redes: { instagram: '', youtube: '', linkedin: '' },
  // TODO: adicionar apenas marcas e URLs de parceiros confirmados.
  parceiros: [] as { nome: string; logo: string; url: string }[],
}

export type ContactChannels = typeof siteConfig.contato

export function contactUrl(
  partnership = true,
  channels: ContactChannels = siteConfig.contato,
): string | undefined {
  const { email, whatsapp, formularioParceirosUrl, paginaInstitucionalUrl } =
    channels
  const message = partnership
    ? 'Quero ser parceiro do Planeta Jovem'
    : 'Quero falar com o Planeta Jovem'
  if (formularioParceirosUrl && /^https:\/\//.test(formularioParceirosUrl))
    return formularioParceirosUrl
  const digits = whatsapp.replace(/\D/g, '')
  if (digits)
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
  if (email) return `mailto:${email}?subject=${encodeURIComponent(message)}`
  if (paginaInstitucionalUrl && /^https:\/\//.test(paginaInstitucionalUrl))
    return paginaInstitucionalUrl
  return undefined
}
