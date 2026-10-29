import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
await mkdir('docs/screenshots/redesign', { recursive: true })
const browser = await chromium.launch()
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: 'reduce',
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    for (const [name, route] of [
      ['home', '/'],
      ['paises', '/paises'],
      ['galixandria', '/paises/galixandria'],
      ['astalania', '/paises/astalania'],
      ['jakkar', '/paises/jakkar'],
      ['atividades', '/atividades'],
      ['galeria', '/galeria'],
      ['parceiros', '/parceiros'],
    ]) {
      await page.goto('http://127.0.0.1:4173' + route)
      await page.locator('main h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: `docs/screenshots/redesign/${name}-${width}.png`,
      })
      if (name === 'home') {
        for (
          let top = 0;
          top < (await page.evaluate(() => document.body.scrollHeight));
          top += 800
        ) {
          await page.evaluate((y) => scrollTo(0, y), top)
          await page.waitForTimeout(80)
        }
        await page.waitForLoadState('networkidle')
        await page.evaluate(() => scrollTo(0, 0))
        await page.screenshot({
          path: `docs/screenshots/redesign/home-completa-${width}.png`,
          fullPage: true,
        })
      }
    }
    // Gesto realista sobre o elemento que recebe os eventos touch.
    await page.goto('http://127.0.0.1:4173/galeria?tipo=image')
    await page.locator('.gallery-card button').first().click()
    const before = await page.getByRole('dialog').getAttribute('aria-label')
    await page
      .locator('.lightbox-stage')
      .dispatchEvent('touchstart', { touches: [{ clientX: 300 }] })
    await page
      .locator('.lightbox-stage')
      .dispatchEvent('touchend', { changedTouches: [{ clientX: 100 }] })
    const after = await page.getByRole('dialog').getAttribute('aria-label')
    if (before === after) throw new Error('Swipe não avançou a galeria')
    await page.keyboard.press('Escape')
    console.log(`Capturas ${width}px e navegação por swipe verificadas.`)
    await context.close()
  }
} finally {
  await browser.close()
}
