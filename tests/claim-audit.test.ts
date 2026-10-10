import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync, execFile } from 'node:child_process'
import { promisify } from 'node:util'
import test from 'node:test'

const run = promisify(execFile)

test('claim audit accepts neutral source copy', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'smartcounter-claim-audit-'))
  try {
    writeFileSync(join(directory, 'page.html'), '<h1>Visitor analytics for configured deployments</h1>')
    const { stdout } = await run('node', ['scripts/claim-audit.mjs'], {
      cwd: process.cwd(),
      env: { ...process.env, CLAIM_AUDIT_SOURCE_ROOT: directory, CLAIM_AUDIT_RENDERED_ROOT: directory },
    })
    assert.match(stdout, /audit passed/i)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('claim audit rejects rendered placeholders and unsupported claims', () => {
  const directory = mkdtempSync(join(tmpdir(), 'smartcounter-claim-audit-'))
  try {
    writeFileSync(join(directory, 'page.html'), '<p>[Dashboard Preview] 99.9% accuracy</p>')
    assert.throws(() => execFileSync('node', ['scripts/claim-audit.mjs'], {
      cwd: process.cwd(),
      env: { ...process.env, CLAIM_AUDIT_SOURCE_ROOT: directory, CLAIM_AUDIT_RENDERED_ROOT: directory },
      stdio: 'pipe',
    }))
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
