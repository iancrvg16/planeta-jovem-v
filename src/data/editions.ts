import { site } from './site'
import type { Edition, MediaItem } from './types'

export const manual: MediaItem = {
  id: 'manual-05',
  title: 'Manual do Tripulante Intergaláctico',
  type: 'document',
  status: 'available',
  url: site.manualUrl,
  description: 'PDF · versão 01 revisada · setembro de 2026',
}
export const editions: Edition[] = [
  {
    number: 5,
    year: 2026,
    status: 'current',
    summary:
      'Uma nova jornada, muitas histórias por construir. Acompanhe os documentos e os registros públicos da edição atual.',
    documents: [
      manual,
      {
        id: 'plano-05',
        title: 'Plano Diretor Planeta Jovem',
        type: 'document',
        status: 'awaiting',
        description: 'As propostas coletivas dos Países Virtuais.',
      },
      {
        id: 'manifesto-05',
        title: 'Manifesto para o Futuro',
        type: 'document',
        status: 'awaiting',
        description: 'Ideias, princípios e compromissos da tripulação.',
      },
      {
        id: 'programacao-05',
        title: 'Programação da jornada',
        type: 'document',
        status: 'available',
        url: `${site.manualUrl}#page=5`,
        description: 'No manual · página 5 · sujeita a atualizações.',
      },
      {
        id: 'bibliografia-05',
        title: 'Referências bibliográficas',
        type: 'document',
        status: 'updating',
        description: 'Materiais de apoio para pesquisa e construção coletiva.',
      },
    ],
    gallery: [],
  },
  ...[4, 3, 2, 1].map((number): Edition => ({
    number,
    status: 'archived',
    summary:
      'Cada edição é parte dessa história. Os documentos e registros estão em organização para consulta pública.',
    documents: [],
    gallery: [],
    ...(number === 2 ? { archiveUrl: site.historicalUrl } : {}),
  })),
]
