// TODO: validar com a organização todo o texto comercial abaixo.
export const partnership = {
  eyebrow: 'O futuro precisa de gente que acredita',
  title: 'Invista no futuro.',
  subtitle: 'Seja um parceiro do Planeta Jovem.',
  description:
    'Apoie uma geração que aprende criando. Conecte sua organização a uma jornada de educação, cidadania e transformação.',
  arguments: [
    {
      title: 'Protagonismo juvenil',
      text: 'Jovens com espaço para imaginar, decidir e construir juntos.',
      icon: 'spark',
    },
    {
      title: 'Inovação com propósito',
      text: 'Pesquisa e criatividade para pensar soluções para problemas reais.',
      icon: 'bolt',
    },
    {
      title: 'Educação e cidadania',
      text: 'Aprendizagem que passa pela colaboração e pelo respeito às diferenças.',
      icon: 'book',
    },
  ],
  possibilities: [
    {
      title: 'Compartilhar conhecimento',
      text: 'Possibilidade de atuar como Diplomata, contribuindo com experiências e conversas ligadas às Trilhas.',
      icon: 'compass',
    },
    {
      title: 'Apoiar desafios',
      text: 'Possibilidade de aproximar problemas do mundo real das pesquisas e propostas construídas pelos países.',
      icon: 'flag',
    },
    {
      title: 'Ampliar a conexão',
      text: 'Possibilidade de divulgar a jornada e aproximar novas pessoas e organizações do projeto.',
      icon: 'signal',
    },
    {
      title: 'Viabilizar a jornada',
      text: 'Possibilidade de contribuir com recursos e infraestrutura, conforme as necessidades da organização.',
      icon: 'rocket',
    },
  ],
  note: 'Cada parceria é construída em diálogo com a organização. Formatos de apoio e eventuais contrapartidas serão combinados individualmente.',
} as const

export const fases = [
  { id: 'fase-1', titulo: 'Fase 1 — Entregas Básicas', status: 'Em andamento' },
]

export const activities = [1, 2, 3].map((numero) => ({
  fase: 'fase-1',
  numero,
  titulo: `Atividade ${numero}`,
  // TODO: confirmar nomes e descrições oficiais das Atividades 1, 2 e 3.
  descricao:
    numero === 1
      ? 'Fundação do país: identidade, governo, leis e território.'
      : 'As próximas construções dos países aparecerão aqui.',
  descricaoProvisoria: true,
}))

export const journey = [
  {
    title: 'Descobrir',
    text: 'Marco Zero no Olimpo, nivelamento dos Tripulantes e chegada aos países.',
    icon: 'compass',
    label: 'O primeiro passo',
  },
  {
    title: 'Criar',
    text: 'Fase 1: identidades, bandeiras, hinos, governos, leis e territórios.',
    icon: 'spark',
    label: 'Estamos aqui',
  },
  {
    title: 'Conectar',
    text: 'Intercâmbio entre países e construção do Manifesto para o Futuro.',
    icon: 'orbit',
    label: 'Pontes entre ideias',
  },
  {
    title: 'Transformar',
    text: 'Planos Diretores e propostas para enfrentar problemas reais.',
    icon: 'bolt',
    label: 'O futuro em ação',
  },
] as const

export const homeContent = {
  eyebrow: 'Planeta Jovem V · A conexão com a Terra',
  title: 'Chegamos ao Planeta Jovem.',
  subtitle:
    'Uma nova geração construindo, criando e transformando o futuro — um país de cada vez.',
  project: 'Um planeta de possibilidades. Criado por jovens.',
  projectText:
    'O Planeta Jovem é uma experiência educacional do Pirambu Innovation. Aqui, jovens se tornam Tripulantes e criam Países Virtuais do zero: da bandeira às leis, das primeiras ideias às soluções para o futuro.',
  closing:
    'Pense. Crie. Compartilhe. Questione. Confronte. Reflita. Transforme. O futuro também é seu.',
}
