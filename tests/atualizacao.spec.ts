import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { entregas, galeria, midias, outrasEdicoes } from '../src/data/acervo'

test('onze fotografias de outras edições, teclado e foco do lightbox', async ({
  page,
  request,
}) => {
  await page.goto('/')
  const section = page.getByRole('region', {
    name: 'Outras edições',
    exact: true,
  })
  await expect(
    section.getByRole('heading', { name: 'Outras edições', exact: true }),
  ).toBeVisible()
  await expect(section).toContainText(
    'Registros de encontros, atividades e experiências de outras edições do Planeta Jovem.',
  )
  const buttons = section.getByRole('button')
  await expect(buttons).toHaveCount(11)
  expect(outrasEdicoes).toHaveLength(11)
  expect(new Set(outrasEdicoes.map((m) => m.src)).size).toBe(11)
  for (const m of outrasEdicoes) {
    expect(
      entregas.some((e) => e.midias.some((asset) => asset.id === m.id)),
    ).toBe(false)
    const response = await request.get(m.src!)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('image/webp')
  }
  await buttons.first().focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  for (let i = 0; i < 11; i++) {
    const media = outrasEdicoes[i]
    await expect(dialog.getByRole('img')).toHaveAttribute('alt', media.alt!)
    await expect
      .poll(() =>
        dialog
          .getByRole('img')
          .evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0)
    await expect
      .poll(() =>
        dialog
          .getByRole('img')
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true)
    await expect(dialog).toContainText(`${i + 1} / 11`)
    await expect(dialog).not.toContainText('Fase')
    await page.keyboard.press('ArrowRight')
  }
  await expect(dialog.getByRole('img')).toHaveAttribute(
    'alt',
    outrasEdicoes[0].alt!,
  )
  await page.keyboard.press('ArrowLeft')
  await expect(dialog.getByRole('img')).toHaveAttribute(
    'alt',
    outrasEdicoes[10].alt!,
  )
  await dialog.getByRole('button', { name: 'Próxima imagem' }).focus()
  await page.keyboard.press('Tab')
  await expect(
    dialog.getByRole('button', { name: 'Fechar janela' }),
  ).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(
    dialog.getByRole('button', { name: 'Próxima imagem' }),
  ).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(buttons.first()).toBeFocused()
  const problems = await new AxeBuilder({ page })
    .include('#outras-edicoes')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(problems.violations).toEqual([])
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
})

for (const [slug, title] of [
  ['astalania', 'Gibi de Astalania'],
  ['jambor', 'Projeto de Jambor'],
  ['jakkar', 'Revista de Jakkar'],
]) {
  test(`${title}: país correto, capa, abertura, download e catálogo`, async ({
    page,
    context,
    request,
  }, info) => {
    await page.goto(`/paises/${slug}`)
    const section = page.getByRole('region', { name: 'Materiais em destaque' })
    const card = section
      .locator('article')
      .filter({ has: page.getByRole('heading', { name: title, exact: true }) })
    await expect(card).toBeVisible()
    await expect(
      card.getByRole('img', { name: `Capa de ${title}` }),
    ).toBeVisible()
    await expect(card).toContainText('PDF')
    const media = midias.find((m) => m.title === title)!
    expect(media.country).toBe(slug)
    expect(
      entregas.filter((e) => e.midias.some((m) => m.id === media.id)),
    ).toHaveLength(1)
    expect(galeria.filter((g) => g.midia.id === media.id)).toHaveLength(1)
    expect(
      await card.evaluate(
        (element) =>
          !!(
            element.compareDocumentPosition(
              document.querySelector('#galeria-pais')!,
            ) & Node.DOCUMENT_POSITION_FOLLOWING
          ),
      ),
    ).toBe(true)
    const open = card.getByRole('link', { name: /^Abrir PDF/ })
    await expect(open).toHaveAttribute('href', media.src!)
    await expect(open).toHaveAttribute('target', '_blank')
    const response = await request.get(media.src!)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/pdf')
    const body = await response.body()
    expect(body.length).toBe(media.bytes)
    expect(body.subarray(0, 5).toString()).toBe('%PDF-')
    if (info.project.name === '1440px') {
      const popupPromise = context.waitForEvent('page')
      const responsePromise = context.waitForEvent('response', (res) =>
        res.url().endsWith(media.src!),
      )
      await open.click()
      const popup = await popupPromise
      // Chromium headless shell has no PDF viewer; verify the actual navigation response.
      const opened = await responsePromise
      expect(opened.status()).toBe(200)
      expect(opened.headers()['content-type']).toContain('application/pdf')
      expect(opened.request().isNavigationRequest()).toBe(true)
      await popup.close()
    }
    const downloadPromise = page.waitForEvent('download')
    await card.getByRole('link', { name: /^Baixar PDF/ }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe(media.src!.split('/').at(-1))
    expect(
      createHash('sha256')
        .update(readFileSync((await download.path())!))
        .digest('hex'),
    ).toBe(createHash('sha256').update(body).digest('hex'))
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true)
    const problems = await new AxeBuilder({ page })
      .include('.country-materials')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    expect(problems.violations).toEqual([])
    await page.goto(`/galeria?pais=${slug}&tipo=document`)
    await expect(
      page.getByRole('heading', { name: title, exact: true }),
    ).toHaveCount(1)
    await page.goto('/documentos')
    await expect(
      page.getByRole('link', { name: new RegExp(title) }),
    ).toHaveCount(1)
    await page.getByRole('button', { name: 'Abrir busca' }).click()
    await page.getByRole('searchbox').fill(title)
    const result = page.locator('.search-results a')
    await expect(result).toHaveCount(1)
    await result.click()
    await expect(page).toHaveURL(new RegExp(`/paises/${slug}#${media.id}$`))
  })
}

test('vídeo de Astalania: sob demanda, reprodução e avanço', async ({
  page,
  request,
}) => {
  const requested: string[] = []
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) requested.push(r.url())
  })
  await page.goto('/paises/astalania')
  const player = page
    .getByRole('region', { name: 'Materiais em destaque' })
    .locator('video')
  await expect(player).toBeVisible()
  await expect(player).toHaveAttribute('aria-label', 'Vídeo de Astalania')
  await expect(player).toHaveAttribute('preload', 'none')
  await expect(player).toHaveAttribute('playsinline', '')
  await expect(player).not.toHaveAttribute('autoplay')
  expect(requested).toEqual([])
  await player.evaluate((v: HTMLVideoElement) => {
    v.muted = true
    return v.play()
  })
  await expect
    .poll(() => player.evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(0)
  await expect
    .poll(() => player.evaluate((v: HTMLVideoElement) => v.duration))
    .toBeCloseTo(98.266667, 1)
  expect(
    await player.evaluate((v: HTMLVideoElement) => [
      v.videoWidth,
      v.videoHeight,
    ]),
  ).toEqual([576, 720])
  for (const time of [35, 90]) {
    await player.evaluate((v: HTMLVideoElement, t) => {
      v.currentTime = t
    }, time)
    await expect
      .poll(() => player.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeGreaterThanOrEqual(time)
    await expect
      .poll(() => player.evaluate((v: HTMLVideoElement) => v.seeking))
      .toBe(false)
  }
  expect(await player.evaluate((v: HTMLVideoElement) => v.error)).toBeNull()
  const response = await request.get(
    '/midia/astalania/video-de-astalania.mp4',
    { headers: { Range: 'bytes=1024-2047' } },
  )
  expect(response.status()).toBe(206)
  expect((await response.body()).length).toBe(1024)
  await page.goto('/galeria?pais=astalania&tipo=video')
  await expect(
    page.getByRole('heading', { name: 'Vídeo de Astalania', exact: true }),
  ).toHaveCount(1)
  await page.goto('/paises/galixandria')
  await expect(
    page.getByRole('heading', { name: 'Vídeo de Astalania', exact: true }),
  ).toHaveCount(0)
})
