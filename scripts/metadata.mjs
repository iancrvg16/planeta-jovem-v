import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { paises } from '../src/data/paises.ts'
import { countries } from '../src/data/countries.ts'
import { news } from '../src/data/news.ts'
import { site } from '../src/data/site.ts'

const raw =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : site.url)
const origin = new URL(raw).origin
if (!origin.startsWith('https://')) throw new Error('SITE_URL deve usar HTTPS.')
const template = readFileSync('dist/index.html', 'utf8')
const media = JSON.parse(
  readFileSync('src/data/generated/midias-publicas.json', 'utf8'),
)
const hero = JSON.parse(readFileSync('src/data/generated/hero.json', 'utf8'))
const escape = (s) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
const routes = [
  {
    path: '/',
    title: 'Planeta Jovem V — A conexão com a Terra',
    description: site.description,
  },
  {
    path: '/projeto',
    title: 'O Projeto',
    description:
      'Conheça o Planeta Jovem V, os papéis, as Trilhas, o Olimpo e as construções dos jovens.',
  },
  {
    path: '/paises',
    title: 'Países Virtuais',
    description:
      'Galixandria, Astalânia, Jakkar, Jambor e Lervúria: cinco países criados pelos jovens.',
  },
  {
    path: '/atividades',
    title: 'Atividades e jornada',
    description:
      'Acompanhe a Fase 1 — Entregas Básicas e as criações dos Países Virtuais.',
  },
  {
    path: '/galeria',
    title: 'Galeria da jornada',
    description:
      'Registros, criações visuais, vídeos e documentos enviados pelos participantes.',
  },
  {
    path: '/parceiros',
    title: 'Seja parceiro',
    description:
      'Apoie o protagonismo juvenil, a inovação e a educação no Planeta Jovem.',
  },
  {
    path: '/contato',
    title: 'Contato',
    description:
      'Conecte-se à organização do Planeta Jovem e conheça as possibilidades de parceria.',
  },
  {
    path: '/documentos',
    title: 'Documentos e memória',
    description:
      'Manuais e documentos dos países, com o acervo das cinco edições do projeto.',
  },
  {
    path: '/noticias',
    title: 'Notícias e transmissões',
    description:
      'Histórias, contexto e notícias do Planeta Jovem para a Terra.',
  },
  {
    path: '/memoria',
    title: 'Países na memória',
    description: 'Oito países preservados no arquivo das edições anteriores.',
  },
  ...paises.map((p) => ({
    path: `/paises/${p.slug}`,
    title: p.nome,
    description: p.resumo,
    image: `/og/${p.slug}.jpg`,
  })),
  ...news.map((n) => ({
    path: `/noticias/${n.slug}`,
    title: n.title,
    description: n.excerpt,
  })),
  ...countries.map((c) => ({
    path: `/memoria/paises/${c.slug}`,
    title: `${c.name} — Arquivo histórico`,
    description:
      'Memória das edições anteriores do Planeta Jovem. Bandeira ilustrativa provisória.',
  })),
]
for (const route of routes) {
  const title =
    route.path === '/' ? route.title : `${route.title} | Planeta Jovem`
  const url = origin + route.path
  let html = template.replace(
    /<title>.*?<\/title>/s,
    `<title>${escape(title)}</title>`,
  )
  const meta = (key, value) => {
    html = html.replace(
      new RegExp(
        `(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*("\\s*/?>)`,
      ),
      (_, a, b) => a + escape(value) + b,
    )
  }
  meta('description', route.description)
  meta('og:title', title)
  meta('og:description', route.description)
  meta('og:url', url)
  meta('og:image', origin + (route.image ?? '/og/inicio.jpg'))
  meta('site-origin', origin)
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
  )
  const country = paises.find((p) => route.path === `/paises/${p.slug}`)
  const flag =
    country?.bandeira &&
    media.find(
      (m) =>
        m.country === country.slug && m.original === country.bandeira.arquivo,
    )
  const preload =
    route.path === '/'
      ? `<link data-hero rel="preload" as="image" type="image/avif" href="${hero.avifSrc}" imagesrcset="${hero.avifSrcSet}" imagesizes="(max-width: 768px) 100vw, 82vw" fetchpriority="high" />`
      : flag
        ? `<link data-country-hero rel="preload" as="image" type="image/webp" href="${flag.src}" imagesrcset="${flag.srcSet}" imagesizes="(max-width: 768px) 90vw, 560px" fetchpriority="high" />`
        : ''
  html = html.replace(/<link\s+data-hero\b[^>]*>/g, preload)
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Planeta Jovem',
    url: origin,
    logo: `${origin}/assets/planeta-jovem-oficial.png`,
    description: site.description,
    parentOrganization: {
      '@type': 'Organization',
      name: 'Pirambu Innovation',
      url: site.institutionalUrl,
    },
  }
  html = html.replace(
    '</head>',
    `<script type="application/ld+json">${JSON.stringify(jsonld).replaceAll('<', '\\u003c')}</script></head>`,
  )
  const folder = route.path === '/' ? 'dist' : join('dist', route.path)
  mkdirSync(folder, { recursive: true })
  writeFileSync(join(folder, 'index.html'), html)
}
// Vercel serves this document with HTTP 404 when no file/rewrite matches.
const notFound = template
  .replace(
    /<title>.*?<\/title>/s,
    '<title>Transmissão não encontrada | Planeta Jovem</title>',
  )
  .replace(/<link\s+data-hero\b[^>]*>/g, '')
  .replace(/<link\s+rel="canonical"[^>]*>/g, '')
  .replace(/<meta\s+(?:name|property)="(?:description|og:[^"]+)"[^>]*>/g, '')
  .replace('</head>', '<meta name="robots" content="noindex, follow" /></head>')
writeFileSync('dist/404.html', notFound)
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${origin}${r.path}</loc></url>`).join('')}</urlset>\n`,
)
writeFileSync(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
)
mkdirSync('docs', { recursive: true })
writeFileSync('docs/rotas-geradas.json', JSON.stringify(routes, null, 2) + '\n')
console.log(
  `${routes.length} páginas com metadados estáticos, canonical, OG, JSON-LD e sitemap.`,
)
