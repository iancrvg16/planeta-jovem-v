import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Each fixture gets a fresh page/context. No mutation of the public configuration.
test('contato sem canais: modal, teclado, fechamento, foco e axe', async ({
  page,
}) => {
  await page.goto(
    'http://127.0.0.1:4175/tests/fixtures/components.html?mode=contact',
  )
  const trigger = page.getByRole('button', { name: 'Seja Parceiro' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Fechar janela' }),
  ).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(
    true,
  )
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(
    true,
  )
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([])
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await trigger.click()
  await page.getByRole('button', { name: 'Fechar janela' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('canal configurado: link acessível por teclado sem abrir destino externo', async ({
  page,
}) => {
  await page.goto('/')
  const link = page
    .locator('.hero-actions')
    .getByRole('link', { name: 'Seja Parceiro' })
  await link.focus()
  await expect(link).toBeFocused()
  await expect(link).toHaveAttribute(
    'href',
    'https://pirambu-innovation.vercel.app/contato/',
  )
  await expect(link).toHaveAttribute('rel', /noopener/)
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.keyboard.press('Tab')
  await expect(link).not.toBeFocused()
})

test('WebVTT revisado: carrega trilha, permite selecionar e expõe transcrição', async ({
  page,
}) => {
  await page.goto(
    'http://127.0.0.1:4175/tests/fixtures/components.html?mode=captions',
  )
  const video = page.locator('video')
  await expect(page.locator('track')).toHaveAttribute('srclang', 'pt-BR')
  await expect(page.locator('track')).toHaveAttribute(
    'label',
    'Português — teste sintético',
  )
  // Load a small local video to exercise the browser text-track loader.
  await video.evaluate((node: HTMLVideoElement) => {
    node.load()
    node.textTracks[0].mode = 'showing'
  })
  await expect
    .poll(() =>
      video.evaluate(
        (node: HTMLVideoElement) => node.textTracks[0]?.cues?.length ?? 0,
      ),
    )
    .toBe(1)
  await expect
    .poll(() =>
      video.evaluate((node: HTMLVideoElement) => node.textTracks[0].mode),
    )
    .toBe('showing')
  await video.evaluate((node: HTMLVideoElement) => {
    node.textTracks[0].mode = 'disabled'
  })
  expect(
    await video.evaluate((node: HTMLVideoElement) => node.textTracks[0].mode),
  ).toBe('disabled')
  await page.getByText('Transcrição de teste', { exact: true }).click()
  await expect(
    page.getByText('Texto sintético de teste. Não transcreve o vídeo.'),
  ).toBeVisible()
  await page.goto(
    'http://127.0.0.1:4175/tests/fixtures/components.html?mode=pending',
  )
  await expect(page.locator('video')).toBeVisible()
  await expect(page.locator('track')).toHaveCount(0)
  await expect(page.locator('details')).toHaveCount(0)
})

test('home destaca identidade estática e preserva navegação para Galixandria', async ({
  page,
}) => {
  await page.goto('/')
  const feature = page.locator('.video-feature')
  await expect(
    feature.getByRole('img', { name: 'Bandeira de Galixandria' }),
  ).toBeVisible()
  await expect(feature.getByRole('button')).toHaveCount(0)
  await feature
    .getByRole('link', { name: 'Conhecer Galixandria', exact: true })
    .click()
  await expect(page).toHaveURL(/\/paises\/galixandria$/)
  await expect(page.locator('h1')).toHaveText('Galixandria')
})
