export type CountrySlug =
  'galixandria' | 'astalania' | 'jakkar' | 'jambor' | 'lervuria'
export type Media = {
  id: string
  country: string
  phase: string
  activity: number
  type: 'image' | 'video' | 'document' | 'source' | 'briefing'
  original: string
  sources?: string[]
  src?: string
  srcSet?: string
  width?: number
  height?: number
  color?: string
  placeholder?: string
  poster?: string
  posterSrcSet?: string
  duration?: number
  bytes?: number
  pages?: number
  extracted?: boolean
  collection?: 'outras-edicoes' | 'materiais-pais'
  title?: string
  description?: string
  alt?: string
}
export type Delivery = {
  id: string
  paisSlug: CountrySlug
  fase: string
  atividade: number
  dataISO?: string
  hora?: string
  titulo: string
  descricao: string
  responsaveis: string[]
  midias: Media[]
  tags: string[]
}
export type Institution = {
  nome: string
  descricao: string
  responsavel?: string
}
export type CountryData = {
  slug: CountrySlug
  nome: string
  status: 'ativo' | 'em-breve'
  lema?: string
  lemaProvisorio?: boolean
  resumo: string
  missao?: string
  cores: { primaria: string; secundaria: string; destaque: string }
  icone: 'sun' | 'wave' | 'mountain' | 'planet'
  bandeira?: { arquivo: string; significado: string[] }
  brasao?: string
  hino?: {
    titulo: string
    autoria?: string
    letra: string
    imagem?: string
    guia?: string
    revisao?: boolean
  }
  governo?: {
    modelo: string
    descricao: string
    liderancas?: Institution[]
    conselhos: Institution[]
    ministerios?: Institution[]
    processo?: string[]
  }
  leis?: { numero?: string; nome: string; objetivo: string; itens: string[] }[]
  territorio?: {
    mapa?: string
    autoria?: string
    capital?: string
    cidades?: string[]
    regioes: Institution[]
    rios?: string[]
    montanhas?: string[]
  }
  moeda?: {
    nome: string
    descricao: string
    cedulas: { valor: number; tema: string }[]
    moedas: string
  }
  valores?: string[]
  principios?: string[]
  projetos?: Institution[]
  eixos?: Institution[]
  estrategia?: string[]
  historia?: string
  desafios?: { titulo: string; descricao: string; entrega?: string }[]
}
