import { mediaAccessibility } from '../src/data/mediaAccessibility.ts'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
const media = JSON.parse(readFileSync('src/data/generated/midias.json'))
const files = new Set()
const update = JSON.parse(readFileSync('scripts/atualizacao-2026-10-30.json'))
for (const expected of update) {
  const matching = media.filter((m) => m.original === expected.original)
  assert.equal(
    matching.length,
    1,
    `Registro da atualização ausente ou duplicado: ${expected.original}`,
  )
  const actual = matching[0]
  for (const key of ['country', 'collection', 'title', 'description', 'alt'])
    assert.equal(
      actual[key],
      expected[key],
      `Associação editorial incorreta: ${key}`,
    )
  assert.equal(actual.activity, 0, 'Não inferir atividade dos novos materiais')
  assert.equal(
    actual.phase,
    'nao-informada',
    'Não inferir fase dos novos materiais',
  )
}
assert.equal(media.filter((m) => m.collection === 'outras-edicoes').length, 11)
for (const m of media) {
  for (const path of [
    m.src,
    m.poster,
    ...(m.variants ?? []).map((v) => v.src),
    ...(m.posterSrcSet ?? '')
      .split(',')
      .filter(Boolean)
      .map((v) => v.trim().split(' ')[0]),
  ].filter(Boolean)) {
    assert(existsSync(`public${path}`), `Arquivo ausente: ${path}`)
    assert(/^[a-z0-9/.-]+$/.test(path), `Nome não normalizado: ${path}`)
    files.add(path)
  }
  if (m.type === 'image') {
    assert(m.width > 0 && m.height > 0)
    assert(m.variants.every((v) => v.width <= m.width && v.width <= 1600))
    assert(m.variants.every((v) => statSync(`public${v.src}`).size <= 350000))
  }
  if (m.type === 'video') assert(m.bytes <= 10 * 1024 * 1024)
  if (m.type === 'document') {
    if (m.preserveOriginal) {
      assert.equal(m.collection, 'materiais-pais')
      assert(
        update.some(
          (entry) =>
            entry.original === m.original &&
            entry.country === m.country &&
            entry.original.endsWith('.pdf'),
        ),
        'Preservação integral permitida somente para os três PDFs desta entrega',
      )
      assert(m.bytes <= 100 * 1024 * 1024, 'PDF excede o limite do Git normal')
      assert.equal(m.bytes, m.originalBytes, 'Tamanho original do PDF alterado')
      assert.equal(statSync(`public${m.src}`).size, m.bytes)
      assert.equal(m.publicSHA256, m.sha256, 'PDF original alterado')
      assert.equal(
        createHash('sha256')
          .update(readFileSync(`public${m.src}`))
          .digest('hex'),
        m.sha256,
      )
    } else assert(m.bytes <= 5 * 1024 * 1024)
  }
  assert(!m.original.startsWith('Screenshot_'))
}
const old = JSON.parse(readFileSync('docs/inventario-anterior.json'))
for (const path of [
  'public/documents/Manual_do_Tripulante_Intergalactico.pdf',
  'public/assets/planeta-jovem-oficial.png',
]) {
  assert.equal(
    createHash('sha256').update(readFileSync(path)).digest('hex'),
    old.find((x) => x.arquivo === path).sha256,
  )
}
assert.equal(new Set(media.map((m) => m.id)).size, media.length)
assert.equal(
  new Set(media.filter((m) => m.sha256).map((m) => m.sha256)).size,
  media.filter((m) => m.sha256).length,
)
const html = readFileSync('dist/index.html', 'utf8')
assert(html.includes('lang="pt-BR"'))
assert(html.includes('summary_large_image'))
assert(html.includes('application/ld+json'))
const routes = JSON.parse(readFileSync('docs/rotas-geradas.json'))
const vercel = JSON.parse(readFileSync('vercel.json'))
for (const { path } of routes) {
  const file = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
  assert(existsSync(file), file)
  if (path !== '/')
    assert(
      vercel.rewrites.some(
        (r) => r.source === path && r.destination === `${path}/index.html`,
      ),
    )
}
console.log(
  `${media.length} registros de mídia, ${files.size} derivados e ${routes.length} rotas verificados. Manual e logo originais preservados por SHA-256.`,
)

for (const [id, entry] of Object.entries(mediaAccessibility)) {
  assert(
    media.some((m) => m.id === id && m.type === 'video'),
    'ID de vídeo acessível desconhecido',
  )
  if (entry.status !== 'reviewed') continue
  assert(entry.evidenceId.trim(), 'Revisão precisa de referência editorial')
  for (const track of entry.captions) {
    assert(
      /^\/legendas\/[a-z0-9.-]+\.vtt$/.test(track.src),
      'Caminho de legenda deve ser local e normalizado',
    )
    assert(track.language && track.label, 'Idioma e rótulo obrigatórios')
    assert(
      readFileSync('public' + track.src, 'utf8').startsWith('WEBVTT'),
      'WebVTT inválido',
    )
  }
  if (entry.transcript)
    assert(
      entry.transcript.text.trim() &&
        entry.transcript.language &&
        entry.transcript.label,
    )
}
console.log(
  'Infraestrutura audiovisual validada; nenhum rascunho foi publicado.',
)
