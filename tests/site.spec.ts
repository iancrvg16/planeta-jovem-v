import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { entregas, midias, galeria, impactNumbers } from '../src/data/acervo'
import { paises } from '../src/data/paises'
import { contactUrl, siteConfig } from '../src/config/site'
import { existsSync, readFileSync } from 'node:fs'

const routes = [
  '/',
  '/projeto',
  '/paises',
  ...paises.map((p) => `/paises/${p.slug}`),
  '/atividades',
  '/galeria',
  '/parceiros',
  '/contato',
  '/documentos',
  '/noticias',
  '/noticias/manual-intergalactico-disponivel',
  '/memoria',
  '/paises/midoria',
  '/memoria/paises/jakkar',
]

test('rotas diretas, F5, metadados, console e seis larguras sem transbordamento', async ({
  page,
}, info) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  for (const route of routes) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page.locator('main h1')).toHaveCount(1)
    await page.evaluate(() => document.fonts.ready)
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
      `${route} em ${info.project.name}`,
    ).toBe(true)
    expect(await page.locator('a[href="#"]').count()).toBe(0)
    expect(
      await page
        .locator('img:not([alt]),img:not([width]),img:not([height])')
        .count(),
    ).toBe(0)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      new RegExp(
        route === '/'
          ? '/$'
          : (route === '/paises/midoria' ? '/memoria/paises/midoria' : route) +
              '$',
      ),
    )
    await page.reload()
    await expect(page.locator('main h1')).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('dados publicados completos, arquivos originais e contagens verificáveis', async ({
  request,
}, info) => {
  test.skip(info.project.name !== '1440px')
  expect(paises.filter((p) => p.status === 'ativo')).toHaveLength(5)
  expect(new Set(entregas.map((e) => e.id)).size).toBe(entregas.length)
  for (const m of midias.filter((m) =>
    ['image', 'video', 'document', 'briefing'].includes(m.type),
  )) {
    expect(
      entregas.some((e) => e.midias.some((asset) => asset.id === m.id)),
      m.original,
    ).toBe(true)
    expect(existsSync(`public${m.src}`), m.src).toBe(true)
    if (m.type === 'image') expect(m.width! > 0 && m.height! > 0).toBe(true)
  }
  expect(galeria.filter((g) => g.midia.type === 'video')).toHaveLength(6)
  expect(impactNumbers(new Date('2026-09-30T15:00:00Z')).at(-1)?.value).toBe(18)
  const manual = await request.get(siteConfig.manualUrl)
  expect(manual.ok()).toBe(true)
  expect(await manual.body()).toEqual(
    readFileSync(`public${siteConfig.manualUrl}`),
  )
  for (const slug of paises.map((p) => p.slug)) {
    const res = await request.get(`/paises/${slug}/index.html`)
    expect(await res.text()).toContain(`/og/${slug}.jpg`)
  }
})

test('filtros de galeria e atividades persistem e tratam seleção vazia', async ({
  page,
}, info) => {
  test.skip(!['390px', '1440px'].includes(info.project.name))
  await page.goto('/galeria')
  await page
    .getByRole('combobox', { name: 'País', exact: true })
    .selectOption('astalania')
  await page.getByRole('button', { name: 'Fotos', exact: true }).click()
  await expect(page.locator('.gallery-card')).toHaveCount(14)
  await page.reload()
  await expect(
    page.getByRole('combobox', { name: 'País', exact: true }),
  ).toHaveValue('astalania')
  await page.getByRole('button', { name: 'Vídeos', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Esse álbum ainda está sendo criado.' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Limpar filtros', exact: true })
    .click()
  await page.getByRole('button', { name: 'Documentos', exact: true }).click()
  await expect(page.locator('.gallery-card')).toHaveCount(14)
  await page.goto('/atividades')
  await page
    .getByRole('combobox', { name: 'País', exact: true })
    .selectOption('jambor')
  await expect(page.locator('.delivery-timeline .delivery-card')).toHaveCount(
    20,
  )
  await page.getByRole('button', { name: 'Limpar filtros' }).click()
  await page
    .getByRole('combobox', { name: 'Atividade', exact: true })
    .selectOption('2')
  await expect(page.locator('.result-count')).toHaveText(
    '0 entregas encontradas',
  )
})

test('busca por autor, acentos e país leva à entrega correta', async ({
  page,
}, info) => {
  test.skip(!['390px', '1440px'].includes(info.project.name))
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir busca' }).click()
  const input = page.getByRole('searchbox', {
    name: 'Buscar países, entregas, pessoas e documentos',
  })
  await input.fill('RAYSSA')
  await expect(page.locator('.search-results a')).toHaveCount(1)
  await page.locator('.search-results a').click()
  await expect(page).toHaveURL(/\/paises\/astalania#a-hino$/)
  await expect(page.locator('#a-hino')).toBeInViewport()
  await page.getByRole('button', { name: 'Abrir busca' }).click()
  await input.fill('saude digital')
  await expect(page.locator('.search-results a').first()).toContainText(
    'Galixandria',
  )
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('modais, vídeo sob demanda, teclado, zoom e foco', async ({
  page,
}, info) => {
  test.skip(!['390px', '1440px'].includes(info.project.name))
  const requests: string[] = []
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) requests.push(r.url())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(requests).toEqual([])
  const partner = page
    .locator('.hero-actions')
    .getByRole('link', { name: 'Seja Parceiro' })
  await expect(partner).toHaveAttribute(
    'href',
    siteConfig.contato.paginaInstitucionalUrl,
  )
  const videoTrigger = page.getByRole('button', { name: /Assista à chegada/ })
  await videoTrigger.click()
  for (let i = 0; i < 7; i++) await page.keyboard.press('Tab')
  expect(
    await page.evaluate(() =>
      document.querySelector('dialog')?.contains(document.activeElement),
    ),
  ).toBe(true)
  await expect(page.locator('video')).toHaveAttribute('preload', 'none')
  await expect(page.locator('video')).toHaveAttribute('playsinline', '')
  expect(
    await page.locator('video').evaluate((v: HTMLVideoElement) => v.paused),
  ).toBe(true)
  await page.keyboard.press('Escape')
  await page.goto('/galeria?pais=astalania&tipo=image')
  const trigger = page.locator('.gallery-card button').first()
  await trigger.click()
  const title = await page.locator('.lightbox-info h2').innerText()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('.lightbox-info h2')).not.toHaveText(title)
  await page
    .getByRole('button', { name: 'Ampliar imagem', exact: true })
    .click()
  await expect(page.locator('.lightbox-stage')).toHaveClass(/zoomed/)
  await page.keyboard.press('Escape')
  await expect(trigger).toBeFocused()
})

test('menu mobile, skip-link e movimento reduzido', async ({ page }, info) => {
  test.skip(!['390px', '1440px'].includes(info.project.name))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Pular para o conteúdo' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
  if (info.project.name === '390px') {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(
      page.getByRole('navigation', { name: 'Navegação mobile' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeFocused()
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page
      .getByRole('navigation', { name: 'Navegação mobile' })
      .getByRole('link', { name: 'O Projeto' })
      .click()
  } else
    await page
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'O Projeto' })
      .click()
  await expect(page).toHaveURL(/\/projeto$/)
  await page.locator('summary').filter({ hasText: 'Olimpo' }).click()
  await expect(page.locator('details[open]')).toContainText(
    'Espaço de encontro geral',
  )
})

test('acessibilidade AA, hierarquia e modais', async ({ page }, info) => {
  test.skip(!['390px', '1440px'].includes(info.project.name))
  for (const route of [
    '/',
    '/paises',
    '/paises/galixandria',
    '/paises/astalania',
    '/paises/jakkar',
    '/paises/jambor',
    '/paises/lervuria',
    '/projeto',
    '/atividades',
    '/galeria',
    '/parceiros',
    '/contato',
    '/documentos',
    '/noticias',
  ]) {
    await page.goto(route)
    await expect(page.locator('main h1')).toBeVisible()
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([])
    const headings = await new AxeBuilder({ page })
      .withRules(['heading-order'])
      .analyze()
    expect(
      headings.violations.map((v) => v.nodes.map((n) => n.target)),
      route,
    ).toEqual([])
  }
  await page.goto('/')
  await page
    .locator('.hero-actions')
    .getByRole('link', { name: 'Seja Parceiro' })
    .focus()
  await expect(
    page.locator('.hero-actions').getByRole('link', { name: 'Seja Parceiro' }),
  ).toBeFocused()
  await expect(
    page.locator('.hero-actions').getByRole('link', { name: 'Seja Parceiro' }),
  ).toHaveAttribute('href', siteConfig.contato.paginaInstitucionalUrl)
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
})

test('configuração de canais e prioridade sem alterações em componentes', () => {
  const old = { ...siteConfig.contato }
  try {
    expect(contactUrl()).toBe(siteConfig.contato.paginaInstitucionalUrl)
    siteConfig.contato.paginaInstitucionalUrl = ''
    expect(contactUrl()).toBeUndefined()
    siteConfig.contato.email = 'organizacao@example.test'
    expect(contactUrl()).toBe(
      'mailto:organizacao@example.test?subject=Quero%20ser%20parceiro%20do%20Planeta%20Jovem',
    )
    siteConfig.contato.whatsapp = '+55 (85) 90000-0000'
    expect(contactUrl()).toContain('https://wa.me/5585900000000?text=')
    siteConfig.contato.formularioParceirosUrl = 'https://example.test/parcerias'
    expect(contactUrl()).toBe('https://example.test/parcerias')
  } finally {
    Object.assign(siteConfig.contato, old)
  }
})

test('notícias, acervo de edições, leis e 404 preservados', async ({
  page,
}, info) => {
  test.skip(!['390px', '1440px'].includes(info.project.name))
  await page.goto('/noticias')
  await page.getByRole('searchbox', { name: 'Buscar notícias' }).fill('OLIMPO')
  await expect(page.locator('.news-card')).toHaveCount(1)
  await page.locator('.news-card a').click()
  await expect(page.locator('.article-body')).toContainText(
    'Um lugar para compartilhar',
  )
  await page.goto('/documentos?edicao=2')
  await expect(
    page.getByRole('link', { name: 'Visitar o site histórico da 2ª edição' }),
  ).toBeVisible()
  await page.goto('/paises/jakkar#leis')
  await page
    .getByText('Lei da União e da Paz dos Vales', { exact: true })
    .click()
  await expect(page.locator('.laws details[open]')).toContainText('Artigo 4º')
  for (const route of [
    '/fora-do-mapa',
    '/paises/inexistente',
    '/noticias/inexistente',
  ]) {
    await page.goto(route)
    await expect(
      page.getByRole('heading', { name: 'Perdido no espaço.' }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Voltar à Terra / Início' }),
    ).toHaveAttribute('href', '/')
  }
})
