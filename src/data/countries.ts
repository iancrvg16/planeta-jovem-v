import type { Country } from './types'

// Arquivo de países das edições anteriores, separado da composição da edição 05.
// As bandeiras ilustrativas permanecem identificadas por isFlagProvisional.
const initialCountries = [
  ['jakkar', 'Jakkar', '#c3a1ff'],
  ['galixandria', 'Galixandria', '#88baff'],
  ['midoria', 'Midória', '#72dfb2'],
  ['lervuria', 'Lervúria', '#f1a2ca'],
  ['astalania', 'Astalânia', '#f5cc82'],
  ['dolminn', 'Dolminn', '#77d2e0'],
  ['jambor', 'Jambor', '#edaa8c'],
  ['olimpia', 'Olímpia', '#d3b0f2'],
] as const

type CountrySlug = (typeof initialCountries)[number][0]

// Conteúdo individual. Preencha cada país somente com informações confirmadas.
// Ex.: jakkar: { history: 'Texto aprovado', gallery: [registroRecebido] }
const countryContent: Partial<
  Record<CountrySlug, Partial<Omit<Country, 'slug' | 'name'>>>
> = {
  jakkar: {},
  galixandria: {},
  midoria: {},
  lervuria: {},
  astalania: {},
  dolminn: {},
  jambor: {},
  olimpia: {},
}

export const countries: Country[] = initialCountries.map(
  ([slug, name, accentColor]) => ({
    slug,
    name,
    accentColor,
    summary: 'Um País Virtual na memória do Planeta Jovem.',
    flag: `/assets/flags/${slug}.svg`,
    status: 'archived',
    isHistorical: true,
    isProvisional: false,
    isFlagProvisional: true,
    laws: [],
    tracks: [],
    documents: [
      {
        id: `${slug}-plano`,
        title: 'Plano Diretor',
        type: 'document',
        status: 'awaiting',
        description: 'Diagnóstico, pesquisa e propostas do país.',
      },
      {
        id: `${slug}-manifesto`,
        title: 'Manifesto para o Futuro',
        type: 'document',
        status: 'awaiting',
        description: 'Princípios e compromissos construídos em conjunto.',
      },
    ],
    gallery: [],
    ...countryContent[slug],
  }),
)
