import { test, expect } from '@playwright/test'
import { entregas, midias } from '../src/data/acervo'

test('Jambor pelo card, documentos, galeria e vídeos sob demanda', async ({
  page,
  request,
}) => {
  const videoRequests: string[] = []
  page.on('request', (r) => {
    if (r.url().endsWith('.mp4')) videoRequests.push(r.url())
  })
  await page.goto('/paises')
  await page
    .locator('.country-tile.jambor')
    .getByRole('link', { name: 'Explorar país' })
    .click()
  await expect(page).toHaveURL(/\/paises\/jambor$/)
  await expect(page.locator('h1')).toHaveText('Jambor')
  await expect(page.locator('#governo')).toContainText(
    'Monarquia Parlamentar Constitucional',
  )
  await expect(page.locator('#identidade')).toContainText(
    'Hino Nacional de Jambor',
  )
  await expect(page.locator('#identidade')).not.toContainText('Saúde Digital')
  await expect(
    page.getByRole('button', {
      name: 'Ampliar imagem: Brasão oficial de Jambor',
    }),
  ).toBeVisible()
  await expect(page.locator('#documentos-pais .download-card')).toHaveCount(8)
  expect(videoRequests).toEqual([])

  const assets = midias.filter((m) => m.country === 'jambor')
  for (const asset of assets.filter((m) => m.type === 'document')) {
    const res = await request.get(asset.src!)
    expect(res.ok(), asset.original).toBe(true)
    expect(res.headers()['content-type']).toContain('application/pdf')
    expect((await res.body()).subarray(0, 5).toString()).toBe('%PDF-')
  }
  for (const asset of assets.filter((m) => m.type === 'image')) {
    for (const candidate of asset.srcSet!.split(', ')) {
      const res = await request.get(candidate.split(' ')[0])
      expect(res.ok(), candidate).toBe(true)
      expect(res.headers()['content-type']).toContain('image/webp')
    }
  }

  await page.goto('/galeria?pais=jambor&tipo=video')
  await expect(page.locator('.gallery-card')).toHaveCount(3)
  expect(videoRequests).toEqual([])
  for (let i = 0; i < 3; i++) {
    await page.locator('.gallery-card button').nth(i).click()
    const video = page.locator('video')
    await expect(video).toHaveAttribute('preload', 'none')
    await expect(video).toHaveAttribute('playsinline', '')
    expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)
    await video.evaluate((v: HTMLVideoElement) => {
      v.muted = true
      return v.play()
    })
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime))
      .toBeGreaterThan(0)
    await page.keyboard.press('Escape')
  }
  expect(
    entregas
      .filter((e) => e.paisSlug === 'jambor')
      .every(
        (e) =>
          e.atividade === 1 &&
          e.fase === 'fase-1' &&
          !e.dataISO &&
          !e.hora &&
          e.responsaveis.length === 0,
      ),
  ).toBe(true)
})
