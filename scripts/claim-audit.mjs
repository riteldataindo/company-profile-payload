import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'

const textExtensions = new Set(['.html', '.htm', '.json', '.mjs', '.ts', '.tsx'])
const forbidden = [
  { pattern: /\[dashboard preview\]/i, label: 'dashboard placeholder' },
  { pattern: /\[featured image\]/i, label: 'featured-image placeholder' },
  { pattern: /content placeholder\.?/i, label: 'content placeholder' },
  { pattern: /\b(?:#1|number one)\b/i, label: 'market-leadership claim' },
  { pattern: /\b\d+(?:\.\d+)?%\s+(?:accuracy|accurate|uptime|increase|reduction|uplift|improvement)\b/i, label: 'quantified performance claim' },
  { pattern: /\b(?:guaranteed?|fully compliant|100%\s+compliant)\b/i, label: 'guarantee or compliance claim' },
  { pattern: /\b\d+\+\s+(?:stores|clients|locations|customers)\b/i, label: 'customer-count claim' },
]

function filesUnder(root) {
  if (!existsSync(root)) return []
  const entries = readdirSync(root, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const path = resolve(root, entry.name)
    if (entry.isDirectory()) return filesUnder(path)
    return textExtensions.has(extname(entry.name).toLowerCase()) ? [path] : []
  })
}

function scanRoot(root, findings) {
  const files = filesUnder(root)
  for (const file of files) {
    const content = readFileSync(file, 'utf8')
    for (const { pattern, label } of forbidden) {
      const match = content.match(pattern)
      if (match) findings.push({ file, label, match: match[0] })
    }
  }
  return files.length
}

const sourceRoots = process.env.CLAIM_AUDIT_SOURCE_ROOT
  ? process.env.CLAIM_AUDIT_SOURCE_ROOT.split(',').filter(Boolean).map((root) => resolve(root))
  : [resolve('src/lib/i18n/dictionaries')]
const renderedRoots = process.env.CLAIM_AUDIT_RENDERED_ROOT
  ? process.env.CLAIM_AUDIT_RENDERED_ROOT.split(',').filter(Boolean).map((root) => resolve(root))
  : [resolve('.next/server/app')].filter(existsSync)

const findings = []
const scanned = [
  ...sourceRoots.map((root) => scanRoot(root, findings)),
  ...renderedRoots.map((root) => scanRoot(root, findings)),
].reduce((sum, count) => sum + count, 0)

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.label}: ${finding.file} (${finding.match})`)
  }
  process.exitCode = 1
} else {
  console.log(`Claim/placeholder audit passed (${scanned} files scanned)`)
}
