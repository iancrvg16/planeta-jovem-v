export type MediaType = 'image' | 'video' | 'document'
export type MediaItem = {
  id: string
  title: string
  type: MediaType
  status: 'available' | 'updating' | 'awaiting'
  url?: string
  description?: string
  alt?: string
  width?: number
  height?: number
  isDemonstrative?: boolean
}
export type Country = {
  slug: string
  name: string
  summary: string
  history?: string
  motto?: string
  identity?: string
  flag: string
  accentColor: string
  status: 'active' | 'updating' | 'provisional' | 'archived'
  isHistorical: boolean
  isProvisional: boolean
  isFlagProvisional: boolean
  laws: string[]
  tracks: string[]
  documents: MediaItem[]
  gallery: MediaItem[]
}
export type NewsItem = {
  slug: string
  title: string
  excerpt: string
  body: { heading?: string; text: string }[]
  publishedAt?: string
  dateLabel: string
  eventDate?: string
  eventStatus?: 'scheduled' | 'ongoing' | 'completed'
  category: string
  countrySlugs: string[]
  image: string
  imageAlt: string
  sourcePages?: string
  sourceTitle?: string
  sourceUrl?: string
}
export type Edition = {
  number: number
  year?: number
  status: 'current' | 'archived' | 'updating'
  summary: string
  documents: MediaItem[]
  gallery: MediaItem[]
  archiveUrl?: string
}
