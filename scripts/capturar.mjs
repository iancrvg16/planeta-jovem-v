import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
const output = process.argv[2] ?? 'docs/screenshots/revisao-local'
await mkdir(output, { recursive: true })
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
      ['jambor', '/paises/jambor'],
      ['atividades', '/atividades'],
      ['galeria', '/galeria'],
      ['parceiros', '/parceiros'],
    ]) {
      await page.goto('http://127.0.0.1:4173' + route)
      await page.locator('main h1').waitFor()
      await page.evaluate(() => document.fonts.ready)
      await page.waitForLoadState('networkidle')
      await page.screenshot({
        path: `${output}/${name}-${width}.png`,
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
          path: `${output}/home-completa-${width}.png`,
          fullPage: true,
        })
        // Force the lazy section's layout before positioning the viewport.
        await page.locator('#outras-edicoes button').first().focus()
        await page
          .locator('#other-editions-title')
          .evaluate((heading) =>
            heading.scrollIntoView({ behavior: 'instant', block: 'start' }),
          )
        await page.waitForFunction(() => {
          const heading = document.getElementById('other-editions-title')
          const top = heading?.getBoundingClientRect().top ?? -1
          return top >= 0 && top < innerHeight
        })
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(resolve)),
            ),
        )
        await page.screenshot({ path: `${output}/outras-edicoes-${width}.png` })
      }
      if (['astalania', 'jakkar', 'jambor'].includes(name)) {
        await page.locator('.country-materials').screenshot({
          path: `${output}/materiais-${name}-${width}.png`,
        })
      }
    }
    // Gesto realista sobre o elemento que recebe os eventos touch.
    await page.goto('http://127.0.0.1:4173/galeria?tipo=image')
    await page.locator('.gallery-card button').first().click()
    const before = await page.getByRole('dialog').getAttribute('aria-label')
    await page.locator('.lightbox-stage').dispatchEvent('touchstart', {
      touches: [{ identifier: 1, clientX: 300, clientY: 150 }],
    })
    await page.locator('.lightbox-stage').dispatchEvent('touchend', {
      changedTouches: [{ identifier: 1, clientX: 100, clientY: 150 }],
    })
    const after = await page.getByRole('dialog').getAttribute('aria-label')
    if (before === after) throw new Error('Swipe não avançou a galeria')
    await page.keyboard.press('Escape')
    console.log(`Capturas ${width}px e navegação por swipe verificadas.`)
    await context.close()
  }
} finally {
  await browser.close()
}
