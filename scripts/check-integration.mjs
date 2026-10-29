import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, join, extname, sep } from 'node:path'
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'

const root = process.argv[2]
if (!root)
  throw new Error(
    'Informe a pasta do Pirambu Innovation: npm run test:integration -- /caminho/pirambu-innovation',
  )
const publicRoot = resolve(root, 'public')
await stat(join(publicRoot, 'index.html'))
const configured = JSON.parse(
  await readFile(resolve(root, 'content/site.json'), 'utf8'),
).planetaJovemUrl
const expectedUrl = new URL(configured)
const errors = []
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, 'http://localhost').pathname,
    )
    let target = resolve(publicRoot, `.${pathname}`)
    if (target !== publicRoot && !target.startsWith(publicRoot + sep)) {
      res.writeHead(403)
      res.end()
      return
    }
    if ((await stat(target)).isDirectory()) target = join(target, 'index.html')
    const data = await readFile(target)
    res.writeHead(200, {
      'Content-Type': mime[extname(target)] ?? 'application/octet-stream',
    })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Arquivo não encontrado')
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
let browser
try {
  browser = await chromium.launch()
  const address = `http://127.0.0.1:${server.address().port}`
  for (const width of [1440, 768, 360]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
    })
    context.on('page', (page) => {
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
    })
    const principal = await context.newPage()
    await principal.goto(address)
    const link = principal.locator('.featured-spotlight-link')
    assert.equal(await link.getAttribute('href'), configured)
    const opened = context.waitForEvent('page')
    await link.click()
    const portal = await opened
    await portal.locator('main h1').waitFor()
    assert.equal(new URL(portal.url()).origin, expectedUrl.origin)
    await portal.locator('.country-tile.jakkar .text-link').click()
    await portal.waitForURL('**/paises/jakkar')
    await portal.locator('main h1').waitFor()
    await portal.locator('footer a[href="/noticias"]').click()
    await portal.waitForURL('**/noticias')
    await portal
      .locator('main a[href="/noticias/manual-intergalactico-disponivel"]')
      .first()
      .click()
    await portal.waitForURL('**/noticias/manual-intergalactico-disponivel')
    await portal.locator('.article-body').waitFor()
    await portal.locator('footer a[href="/documentos"]').click()
    await portal.waitForURL('**/documentos')
    await portal
      .getByRole('heading', { name: '5ª edição do Planeta Jovem' })
      .waitFor()
    assert.ok(
      await portal
        .getByRole('link', {
          name: 'Abrir Manual do Tripulante Intergaláctico (nova aba)',
        })
        .isVisible(),
    )
    await principal.bringToFront()
    await principal.goto(`${address}/projetos/`)
    assert.ok((await principal.locator('h1').innerText()).length > 0)
    await context.close()
    console.log(
      `OK ${width}px: Pirambu → portal → Jakkar → notícia → documentos; institucional preservado.`,
    )
  }
  assert.deepEqual(errors, [], 'Erros de console no fluxo integrado')
} finally {
  await browser?.close()
  await new Promise((resolve) => server.close(resolve))
}
