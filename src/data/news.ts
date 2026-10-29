import type { NewsItem } from './types'

// Datas e fatos vêm do manual v.01 revisado. Não inferir realização pela data.
// countrySlugs recebe países somente quando uma notícia realmente os envolver.
export const news: NewsItem[] = [
  {
    slug: 'manual-intergalactico-disponivel',
    title: 'O manual que orienta a construção do Planeta Jovem.',
    excerpt:
      'Disponível para consulta pública, o Manual do Tripulante apresenta os papéis, as atividades e os acordos que organizam a experiência dos jovens.',
    category: 'Central de bordo',
    dateLabel: 'Manual · setembro de 2026',
    countrySlugs: [],
    image: '/assets/illustrations/manual.svg',
    imageAlt:
      'Ilustração de um manual intergaláctico com um planeta e linhas orbitais',
    sourcePages: '1–7',
    body: [
      {
        text: 'O Manual do Tripulante Intergaláctico, versão 01 revisada de setembro de 2026, está disponível neste portal. Ele reúne as orientações que organizam a participação dos Tripulantes e a construção coletiva do Planeta Jovem.',
      },
      {
        heading: 'Um mapa para a experiência',
        text: 'O manual apresenta as entregas da jornada, os papéis dos participantes, os direitos e deveres e as regras de convivência. Para quem acompanha da Terra, o documento ajuda a compreender como a experiência se organiza. O glossário explica os termos desse universo.',
      },
      {
        heading: 'Da ideia à construção coletiva',
        text: 'O Plano Diretor reúne o diagnóstico de um problema, evidências de pesquisa e propostas de solução. O Manifesto para o Futuro registra ideias, princípios e compromissos. Desafios e Reviravoltas convidam os grupos a criar, colaborar e se adaptar.',
      },
      {
        heading: 'Como a jornada se organiza',
        text: 'O Slack é o principal ambiente de comunicação, organização e registro das atividades dos participantes. Os Embaixadores orientam os grupos, e a programação pode ser atualizada pela equipe. As atualizações da jornada são comunicadas pela organização e refletidas nos registros públicos do projeto quando recebidas.',
      },
      {
        text: 'A programação do documento prevê a disponibilização do manual em 14 de setembro de 2026. Esta notícia apresenta o arquivo recebido para o portal; não certifica a realização de eventos da programação.',
      },
    ],
  },
  {
    slug: 'marco-zero-encontro-no-olimpo',
    title: 'Marco Zero: um ponto de encontro no Olimpo.',
    excerpt:
      'A programação do manual prevê o encontro de nivelamento dos Tripulantes no espaço de integração do planeta.',
    category: 'Na jornada',
    dateLabel: 'Programação · 12 set. 2026',
    eventDate: '2026-09-12',
    eventStatus: 'scheduled',
    countrySlugs: [],
    image: '/assets/illustrations/olimpo.svg',
    imageAlt: 'Ilustração de órbitas que se encontram em um ponto central',
    sourcePages: '5–6',
    body: [
      {
        text: 'O manual indica o Marco Zero para sábado, 12 de setembro de 2026, com encontro no Olimpo e nivelamento dos Tripulantes. A data faz parte da programação publicada no documento.',
      },
      {
        heading: 'Um lugar para compartilhar',
        text: 'O Olimpo é o espaço de encontro geral do Planeta Jovem. As reuniões são oportunidades de integração, avaliação e troca de experiências entre os participantes.',
      },
      {
        heading: 'O que está registrado na programação',
        text: 'A realização do encontro não foi confirmada nos materiais disponíveis para este portal. O registro é apresentado como previsto no manual, mesmo após a data indicada. A equipe de gestão e os Embaixadores comunicam atualizações pelos canais oficiais.',
      },
    ],
  },
  {
    slug: 'semana-zero-inicio-das-transmissoes',
    title: 'Semana 0: os primeiros passos da tripulação.',
    excerpt:
      'Manual, referências e orientações: veja o que está previsto para o início da jornada.',
    category: 'Na jornada',
    dateLabel: 'Programação · 14 set. 2026',
    eventDate: '2026-09-14',
    eventStatus: 'scheduled',
    countrySlugs: [],
    image: '/assets/illustrations/transmission.svg',
    imageAlt: 'Ilustração de sinais de transmissão entre dois pontos no espaço',
    sourcePages: '5',
    body: [
      {
        text: 'A Semana 0 aparece no manual com duas datas: segunda-feira, 14 de setembro de 2026, e sábado, 19 de setembro de 2026. A programação pode ser atualizada pela organização.',
      },
      {
        heading: '14 de setembro',
        text: 'O documento prevê a disponibilização do Manual do Tripulante Intergaláctico e das referências bibliográficas. O manual pode ser consultado neste portal. O conjunto de referências ainda aguarda envio para o arquivo público.',
      },
      {
        heading: '19 de setembro',
        text: 'Para o sábado, o manual indica atividades conforme o cronograma oficial divulgado pela equipe, sem detalhar horários ou tarefas. As orientações aos participantes são comunicadas no Slack pela equipe e pelos Embaixadores.',
      },
      {
        text: 'Estas são informações de programação, e não um relato de atividades já realizadas. A confirmação de realização ainda não foi recebida.',
      },
    ],
  },
  {
    slug: 'plano-diretor-construir-o-futuro',
    title: 'Plano Diretor: ideias que ganham um caminho.',
    excerpt:
      'Entenda como pesquisa, diagnóstico e colaboração se transformam em propostas para os Países Virtuais.',
    category: 'Construção coletiva',
    dateLabel: 'Contexto da missão · set. 2026',
    countrySlugs: [],
    image: '/assets/illustrations/future.svg',
    imageAlt:
      'Ilustração de formas geométricas conectadas, representando construção coletiva',
    sourcePages: '1–2',
    body: [
      {
        text: 'O Plano Diretor Planeta Jovem é uma construção coletiva. Cada grupo parte dos problemas do País Virtual que integra para desenvolver um diagnóstico e propor soluções apoiadas em pesquisa.',
      },
      {
        heading: 'Quatro partes que se conectam',
        text: 'O documento deve contextualizar o problema, apresentar o diagnóstico, reunir as informações e evidências da pesquisa e propor soluções e possibilidades de intervenção. Leituras, imagens, vídeos e infográficos podem apoiar essa investigação.',
      },
      {
        heading: 'Conhecimento em colaboração',
        text: 'Os encontros e as atividades devem acontecer nos espaços definidos pelo projeto e ser registrados no Slack. Embaixadores orientam os grupos, e Diplomatas podem contribuir com experiências relacionadas às Trilhas.',
      },
      {
        heading: 'Um compromisso com o futuro',
        text: 'Outra entrega, o Manifesto para o Futuro, reúne propostas de governança, princípios, leis ou protocolos, acordos entre países e compromissos. Os documentos de cada país serão disponibilizados quando suas versões públicas forem recebidas.',
      },
    ],
  },
]
