// A galeria aceita arquivos locais e links HTTPS dos provedores abaixo.
// Acrescente novos provedores somente após revisão editorial da fonte.
export function safeMediaUrl(raw?: string): string | undefined {
  if (!raw) return undefined
  if (
    /^\/(?:assets|documents|documentos|midia)\/[a-zA-Z0-9_./%-]+(?:#[a-zA-Z0-9=.-]+)?$/.test(
      raw,
    ) &&
    !raw.includes('..')
  )
    return raw
  try {
    const url = new URL(raw)
    const allowed = [
      'www.youtube.com',
      'youtube.com',
      'youtu.be',
      'vimeo.com',
      'www.vimeo.com',
      'pirambuinnovation.com.br',
      'pirambu-innovation.vercel.app',
    ]
    if (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      allowed.includes(url.hostname)
    )
      return url.href
  } catch {
    /* A URL inválida é apresentada como arquivo em atualização. */
  }
  return undefined
}

export function normalizeSearch(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim()
}
