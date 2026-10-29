// Local production preview: uses the same explicit routes as vercel.json.
// Unknown paths retain HTTP 404 instead of the Vite SPA fallback.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '4173' },
    strictPort: { type: 'boolean' },
  },
})
const root = resolve('dist')
const config = JSON.parse(await readFile('vercel.json', 'utf8'))
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.csv': 'text/csv; charset=utf-8',
  '.vtt': 'text/vtt; charset=utf-8',
}
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    let path
    try {
      path = decodeURIComponent(url.pathname)
    } catch {
      path = '/__invalid_path__'
    }
    for (const rule of config.headers ?? [])
      if (rule.source === '/(.*)')
        for (const h of rule.headers) res.setHeader(h.key, h.value)
    const trimmed = path.replace(/\/+$/, '') || '/'
    const redirect = config.redirects?.find((r) => r.source === trimmed)
    if (redirect || (config.trailingSlash === false && trimmed !== path)) {
      res.writeHead(308, {
        Location: (redirect?.destination ?? trimmed) + url.search,
      })
      res.end()
      return
    }
    const rewrite = config.rewrites?.find((r) => r.source === path)
    let target = resolve(root, '.' + (rewrite?.destination ?? path))
    let status = 200
    try {
      if (target !== root && !target.startsWith(root + sep))
        throw new Error('Outside dist')
      if ((await stat(target)).isDirectory())
        target = resolve(target, 'index.html')
      await stat(target)
    } catch {
      target = resolve(root, '404.html')
      status = 404
    }
    const body = await readFile(target)
    res.setHeader(
      'Content-Type',
      mime[extname(target)] ?? 'application/octet-stream',
    )
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    if (status === 404) res.setHeader('X-Robots-Tag', 'noindex')
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
    if (range && status === 200) {
      const start = Number(range[1]),
        end = range[2]
          ? Math.min(Number(range[2]), body.length - 1)
          : body.length - 1
      if (start > end || start >= body.length) {
        res.writeHead(416, { 'Content-Range': `bytes */${body.length}` })
        res.end()
        return
      }
      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Range': `bytes ${start}-${end}/${body.length}`,
        'Content-Length': end - start + 1,
      })
      res.end(req.method === 'HEAD' ? undefined : body.subarray(start, end + 1))
      return
    }
    res.writeHead(status, {
      'Content-Length': body.length,
      'Accept-Ranges': 'bytes',
    })
    res.end(req.method === 'HEAD' ? undefined : body)
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('Build indisponível. Execute npm run build.')
  }
})
server.listen(Number(values.port), values.host, () =>
  console.log(`Production preview: http://${values.host}:${values.port}`),
)
