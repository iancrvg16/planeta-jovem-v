import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { entregas, midias } from '../src/data/acervo'

test('Lervúria pelo card, símbolos, acervo, documento e atividades vazias', async ({
  page,
  request,
}) => {
  await page.goto('/paises')
  await page
    .locator('.country-tile.lervuria')
    .getByRole('link', { name: 'Explorar país' })
    .click()
  await expect(page).toHaveURL(/\/paises\/lervuria$/)
  await expect(page.locator('h1')).toHaveText('Lervúria')
  await expect(page.locator('.country-hero')).toContainText(
    'Progresso e Preservação',
  )
  await expect(page.locator('#governo')).toContainText('República Democrática')
  await expect(page.locator('#territorio .panel')).toHaveCount(5)
  await expect(page.locator('#identidade')).toContainText('Hino de Lervúria')
  for (const name of ['Bandeira de Lervúria', 'Brasão oficial de Lervúria']) {
    const trigger = page.locator('#identidade').getByRole('button', {
      name: `Ampliar imagem: ${name}`,
      exact: true,
    })
    await trigger.click()
    const image = page.locator('dialog img')
    await expect(image).toBeVisible()
    expect(
      await image.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    ).toBe(true)
    await page.keyboard.press('Escape')
    await expect(trigger).toBeFocused()
  }
  await expect(page.locator('#galeria-pais .gallery-card')).toHaveCount(13)
  await expect(page.locator('#documentos-pais .download-card')).toHaveCount(1)
  const document = page.locator('#documentos-pais .download-card')
  const response = await request.get((await document.getAttribute('href'))!)
  expect(response.ok()).toBe(true)
  expect(response.headers()['content-type']).toContain('application/pdf')
  expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  await page.reload()
  await expect(page.locator('h1')).toHaveText('Lervúria')

  const records = entregas.filter((e) => e.paisSlug === 'lervuria')
  expect(records).toHaveLength(16)
  expect(
    records.every(
      (e) =>
        e.atividade === 1 &&
        e.fase === 'fase-1' &&
        !e.dataISO &&
        !e.hora &&
        !e.responsaveis.length,
    ),
  ).toBe(true)
  const images = midias.filter(
    (m) => m.country === 'lervuria' && m.type === 'image',
  )
  expect(new Set(images.map((m) => m.src)).size).toBe(13)
  for (const media of images) {
    for (const candidate of media.srcSet!.split(', ')) {
      const res = await request.get(candidate.split(' ')[0])
      expect(res.ok(), candidate).toBe(true)
      expect(res.headers()['content-type']).toContain('image/webp')
    }
  }
  for (const activity of [2, 3]) {
    await page.goto(`/atividades?pais=lervuria&atividade=${activity}`)
    await expect(page.locator('.result-count')).toHaveText(
      '0 entregas encontradas',
    )
  }
  await page.goto('/galeria?pais=lervuria&tipo=image')
  await expect(page.locator('.gallery-card')).toHaveCount(13)
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(result.violations.map((v) => v.id)).toEqual([])
})
