import { chromium } from '@playwright/test'
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const base = 'http://127.0.0.1:4173'
const routes = JSON.parse(await readFile('docs/rotas-geradas.json', 'utf8'))
const { redirects } = JSON.parse(await readFile('vercel.json', 'utf8'))
const browser = await chromium.launch()
const context = await browser.newContext({ reducedMotion: 'reduce' })
const page = await context.newPage()
const pages = new Map(),
  files = new Set(),
  external = new Set(),
  errors = []
try {
  for (const route of routes) {
    const path = typeof route === 'string' ? route : route.path
    await page.goto(base + path)
    await page.locator('main h1').waitFor()
    const record = await page.evaluate(() => ({
      ids: [...document.querySelectorAll('[id]')].map((e) => e.id),
      links: [...document.querySelectorAll('a[href]')].map((e) =>
        e.getAttribute('href'),
      ),
    }))
    pages.set(path, record)
  }
  let checked = 0
  for (const [path, record] of pages)
    for (const href of record.links) {
      checked++
      const url = new URL(href, base + path)
      if (url.origin !== base) {
        external.add(url.href)
        continue
      }
      const originalTarget = url.pathname.replace(/\/$/, '') || '/'
      const target =
        redirects.find((r) => r.source === originalTarget)?.destination ??
        originalTarget
      if (pages.has(target)) {
        if (
          url.hash &&
          !pages.get(target).ids.includes(decodeURIComponent(url.hash.slice(1)))
        )
          errors.push({ path, href, reason: 'Âncora ausente' })
      } else {
        try {
          const file = resolve('dist', '.' + target)
          if (!(await stat(file)).isFile()) throw new Error()
          files.add(target)
        } catch {
          errors.push({ path, href, reason: 'Arquivo ou rota ausente' })
        }
      }
    }
  await mkdir('test-results', { recursive: true })
  const result = {
    date: new Date().toISOString(),
    routes: pages.size,
    checked,
    downloads: [...files],
    external: [...external],
    errors,
  }
  await writeFile(
    'test-results/links.json',
    JSON.stringify(result, null, 2) + '\n',
  )
  console.log(JSON.stringify(result, null, 2))
  if (errors.length) process.exitCode = 1
} finally {
  await context.close()
  await browser.close()
}
