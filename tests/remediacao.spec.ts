import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('320 px e demais larguras: indicadores e etapas cabem no viewport', async ({
  page,
}) => {
  for (const route of ['/', '/projeto', '/parceiros']) {
    await page.goto(route)
    await page.locator('main h1').waitFor()
    await page.evaluate(() => document.fonts.ready)
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }))
    expect(dimensions.scroll, route).toBeLessThanOrEqual(dimensions.client)
  }
})

test('fragmentos malformados não interrompem a página nem geram erro', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const hash of ['#%', '#%E0%A4%A', '#identidade']) {
    await page.goto('/paises/lervuria' + hash)
    await expect(page.locator('h1')).toHaveText('Lervúria')
    await page.waitForTimeout(350)
  }
  await expect(page.locator('#identidade')).toBeInViewport()
  expect(errors).toEqual([])
})

test('status HTTP, aliases, canonical e preload correspondem à rota', async ({
  page,
  request,
}, info) => {
  test.skip(info.project.name !== '1440px')
  for (const route of [
    '/nao-existe',
    '/paises/nao-existe',
    '/noticias/nao-existe',
    '/memoria/paises/nao-existe',
    '/paises/Lervuria',
    '/paises/lerv%C3%BAria',
    '/PAISES',
  ]) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBe(404)
    await expect(page.locator('h1')).toHaveText('Perdido no espaço.')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
    await page.reload()
    await expect(page.locator('h1')).toHaveText('Perdido no espaço.')
  }
  for (const [source, target] of [
    ['/sobre', '/projeto'],
    ...['midoria', 'dolminn', 'olimpia'].map((slug) => [
      `/paises/${slug}`,
      `/memoria/paises/${slug}`,
    ]),
    ['/paises/lervuria/', '/paises/lervuria'],
  ]) {
    const response = await request.get(source, { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe(target)
    await page.goto(source)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://sitepj-flax.vercel.app${target}`,
    )
  }
  for (const route of ['/', '/paises/lervuria', '/galeria']) {
    const html = await (await request.get(route)).text()
    expect(/<link\s+data-hero\b/.test(html)).toBe(route === '/')
    expect(/<link\s+data-country-hero\b/.test(html)).toBe(
      route === '/paises/lervuria',
    )
  }
})

test('nomes acessíveis incluem o texto visível em galeria e símbolos', async ({
  page,
}, info) => {
  test.skip(!['320px', '1440px'].includes(info.project.name))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const route of [
    '/paises/lervuria',
    '/paises/jambor',
    '/galeria?tipo=document',
  ]) {
    await page.goto(route)
    await page.locator('main h1').waitFor()
    const result = await new AxeBuilder({ page })
      .withRules(['label-content-name-mismatch'])
      .analyze()
    expect(result.violations).toEqual([])
  }
})
