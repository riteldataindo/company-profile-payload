import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { getScopeCompareCopy } from '../src/lib/i18n/scope-compare'
import { getDemoWalkthroughCopy } from '../src/lib/i18n/demo-walkthrough'

test('scope compare copy exposes entrance, zone, and floor with four fields in EN and ID', () => {
  for (const locale of ['en', 'id'] as const) {
    const copy = getScopeCompareCopy(locale)
    const ids = copy.rows.map((row) => row.id)
    assert.deepEqual(ids, ['entrance', 'zone', 'floor'])
    for (const row of copy.rows) {
      assert.ok(row.label.trim())
      assert.ok(row.coverage.trim())
      assert.ok(row.prerequisite.trim())
      assert.ok(row.output.trim())
      assert.ok(row.limitation.trim())
    }
    assert.equal(copy.columns.coverage.length > 0, true)
    assert.doesNotMatch(JSON.stringify(copy), /\d+(?:\.\d+)?%\s+(?:accuracy|accurate|uptime)/i)
  }
  assert.notEqual(getScopeCompareCopy('en').title, getScopeCompareCopy('id').title)
  assert.match(getScopeCompareCopy('id').rows[0].coverage, /gate|ambang/i)
})

test('deployment page renders the isolated scope compare table', () => {
  const page = readFileSync('src/app/(frontend)/[locale]/deployment/page.tsx', 'utf8')
  const table = readFileSync('src/components/trust/ScopeCompareTable.tsx', 'utf8')
  assert.match(page, /ScopeCompareTable/)
  assert.match(table, /getScopeCompareCopy/)
  assert.match(table, /<table/)
  assert.match(table, /copy\.rows\.map/)
})

test('demo walkthrough is a still plus transcript without autoplay or video', () => {
  const copy = getDemoWalkthroughCopy('en')
  const id = getDemoWalkthroughCopy('id')
  const component = readFileSync('src/components/demo/DemoWalkthrough.tsx', 'utf8')
  const demoPage = readFileSync('src/app/(frontend)/[locale]/demo/page.tsx', 'utf8')
  assert.equal(copy.beats.length >= 4, true)
  assert.equal(id.beats.length, copy.beats.length)
  assert.match(copy.stillSrc, /home-device-coverage-v4\.webp/)
  assert.match(component, /getDemoWalkthroughCopy/)
  assert.match(component, /<details/)
  assert.match(demoPage, /DemoWalkthrough/)
  assert.doesNotMatch(component, /<video|autoplay|autoPlay/)
  assert.doesNotMatch(demoPage, /autoplay|autoPlay/)
  assert.notEqual(copy.title, id.title)
})

test('P3 does not add an installation still or expand glass beyond the existing HUD', () => {
  const walkthrough = readFileSync('src/components/demo/DemoWalkthrough.tsx', 'utf8')
  const compare = readFileSync('src/components/trust/ScopeCompareTable.tsx', 'utf8')
  const css = readFileSync('src/app/globals.css', 'utf8')
  assert.doesNotMatch(walkthrough, /install|calibration photograph/i)
  assert.doesNotMatch(compare, /backdrop-blur/)
  assert.doesNotMatch(walkthrough, /backdrop-blur/)
  const hudFrost = css.includes('spatial-stage__controls') && css.includes('backdrop-filter: blur(12px)')
  assert.equal(hudFrost, true)
  assert.doesNotMatch(compare, /Liquid Glass|backdrop-blur-xl/)
})
