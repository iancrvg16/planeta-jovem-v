import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
const maintained = [
  'README.md',
  'CHECKLIST_GITHUB.md',
  'RELATORIO_CORRECOES.md',
  'docs/PUBLICACAO.md',
  'docs/PROCESSAMENTO.md',
]
const errors = []
let links = 0
for (const file of maintained) {
  if (!existsSync(file)) {
    errors.push(`${file}: ausente`)
    continue
  }
  for (const match of readFileSync(file, 'utf8').matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0]
    if (!target || /^(?:https?:|mailto:)/.test(target)) continue
    links++
    if (!existsSync(resolve(dirname(file), decodeURIComponent(target))))
      errors.push(`${file}: ${target}`)
  }
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else
  console.log(
    `${maintained.length} documentos mantidos e ${links} links locais válidos. Evidências históricas não foram reescritas.`,
  )
