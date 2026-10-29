import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import { launch } from 'chrome-launcher'
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const url = process.argv[2] || 'http://127.0.0.1:4173/'
await mkdir('docs/validacao', { recursive: true })
const results = []
for (const device of ['mobile', 'desktop']) {
  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  })
  try {
    const { lhr, report } = await lighthouse(
      url,
      {
        port: chrome.port,
        output: ['json', 'html'],
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
        logLevel: 'error',
      },
      device === 'desktop' ? desktopConfig : undefined,
    )
    for (const [index, extension] of ['json', 'html'].entries()) {
      await writeFile(
        `docs/validacao/lighthouse-${device}.${extension}`,
        report[index],
      )
    }
    const result = {
      device,
      url: lhr.finalDisplayedUrl,
      date: lhr.fetchTime,
      lighthouseVersion: lhr.lighthouseVersion,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'total-blocking-time',
          'cumulative-layout-shift',
          'speed-index',
        ].map((key) => [
          key,
          {
            value: lhr.audits[key].numericValue,
            display: lhr.audits[key].displayValue,
          },
        ]),
      ),
      improvements: Object.values(lhr.audits)
        .filter((a) => a.score !== null && a.score < 0.9 && a.details)
        .map((a) => ({ id: a.id, title: a.title, display: a.displayValue })),
    }
    results.push(result)
    console.log(JSON.stringify(result, null, 2))
  } finally {
    await chrome.kill()
  }
}
await writeFile(
  'docs/validacao/lighthouse-resumo.json',
  JSON.stringify(results, null, 2) + '\n',
)
