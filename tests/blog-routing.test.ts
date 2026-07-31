import assert from 'node:assert/strict'
import test from 'node:test'
import {
  MAX_BLOG_PAGE,
  blogPageHref,
  parseBlogPage,
} from '../src/lib/blog-routing'
import {
  canonicalSlugForLocale,
  localizedSectionPaths,
  mapDocumentsBySourceSlug,
} from '../src/lib/localized-routes'
import {
  extractRichTextHeadings,
  localizedPublicHref,
  safeRichTextHref,
} from '../src/lib/richtext'
import {
  detectMediaMime,
  validateMediaUpload,
} from '../src/lib/media-validation'
import { isPrivateIPAddress } from '../src/lib/safe-fetch'

test('parseBlogPage accepts an absent or valid positive page', () => {
  assert.deepEqual(parseBlogPage(undefined), { page: 1, shouldRedirect: false })
  assert.deepEqual(parseBlogPage('2'), { page: 2, shouldRedirect: false })
  assert.deepEqual(parseBlogPage(String(MAX_BLOG_PAGE)), {
    page: MAX_BLOG_PAGE,
    shouldRedirect: false,
  })
})

test('parseBlogPage canonicalizes explicit page one', () => {
  assert.deepEqual(parseBlogPage('1'), { page: 1, shouldRedirect: true })
})

test('parseBlogPage rejects malformed, negative, repeated, and extreme values', () => {
  for (const value of ['0', '-1', '1.5', 'abc', '', `0${MAX_BLOG_PAGE}`]) {
    assert.deepEqual(parseBlogPage(value), { page: 1, shouldRedirect: true })
  }
  assert.deepEqual(parseBlogPage([ '1', '2' ]), { page: 1, shouldRedirect: true })
  assert.deepEqual(parseBlogPage(String(MAX_BLOG_PAGE + 1)), {
    page: 1,
    shouldRedirect: true,
  })
})

test('blogPageHref omits the duplicate page-one query', () => {
  assert.equal(blogPageHref('/en/blog', 1), '/en/blog')
  assert.equal(blogPageHref('/en/blog/category/analytics', 2), '/en/blog/category/analytics?page=2')
})

test('localized routes select the requested canonical slug with an English fallback', () => {
  const slugs = {
    en: 'visitor-traffic',
    id: 'lalu-lintas-pengunjung',
  } as const

  assert.equal(canonicalSlugForLocale(slugs, 'id'), 'lalu-lintas-pengunjung')
  assert.equal(canonicalSlugForLocale(slugs, 'ko'), 'visitor-traffic')
  assert.deepEqual(localizedSectionPaths('features', slugs), {
    en: '/features/visitor-traffic',
    id: '/features/lalu-lintas-pengunjung',
  })
})

test('localized related documents retain identity when slugs differ', () => {
  const source = [
    { id: 1, slug: 'visitor-traffic', name: 'Visitor Traffic' },
    { id: 2, slug: 'occupancy', name: 'Occupancy' },
  ]
  const localized = [
    { id: 1, slug: 'lalu-lintas-pengunjung', name: 'Lalu Lintas Pengunjung' },
    { id: 2, slug: 'okupansi', name: 'Okupansi' },
  ]

  const mapped = mapDocumentsBySourceSlug(source, localized)
  assert.equal(mapped.get('visitor-traffic')?.slug, 'lalu-lintas-pengunjung')
  assert.equal(mapped.get('occupancy')?.name, 'Okupansi')
})

test('rich text headings receive stable unique anchors', () => {
  const data = {
    root: {
      children: [
        { type: 'heading', tag: 'h2', children: [{ type: 'text', text: 'Store Traffic' }] },
        { type: 'paragraph', children: [{ type: 'text', text: 'Body' }] },
        { type: 'heading', tag: 'h3', children: [{ type: 'text', text: 'Store Traffic' }] },
      ],
    },
  }

  assert.deepEqual(extractRichTextHeadings(data), [
    { id: 'store-traffic', title: 'Store Traffic', level: 2 },
    { id: 'store-traffic-2', title: 'Store Traffic', level: 3 },
  ])
})

test('rich text links allow public navigation schemes and reject scripts', () => {
  assert.equal(safeRichTextHref('/en/contact'), '/en/contact')
  assert.equal(safeRichTextHref('mailto:hello@example.com'), 'mailto:hello@example.com')
  assert.equal(safeRichTextHref('https://example.com/path'), 'https://example.com/path')
  assert.equal(safeRichTextHref('javascript:alert(1)'), null)
  assert.equal(safeRichTextHref('data:text/html,bad'), null)
  assert.equal(localizedPublicHref('/contact', 'en', '/en/contact'), '/en/contact')
  assert.equal(localizedPublicHref('/id/contact', 'en', '/en/contact'), '/id/contact')
  assert.equal(
    localizedPublicHref('https://example.com', 'en', '/en/contact'),
    'https://example.com/',
  )
})

test('media validation checks signatures, MIME types, extensions, and SVG policy', () => {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  assert.equal(detectMediaMime(png), 'image/png')
  assert.equal(validateMediaUpload({
    data: png,
    mimetype: 'image/png',
    name: 'logo.png',
    size: png.length,
  }), 'image/png')

  assert.throws(() => validateMediaUpload({
    data: png,
    mimetype: 'image/jpeg',
    name: 'logo.jpg',
    size: png.length,
  }), /does not match/)
  assert.throws(() => validateMediaUpload({
    data: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
    mimetype: 'image/svg+xml',
    name: 'logo.svg',
    size: 46,
  }), /SVG|signature/)
})

test('SSRF address policy blocks private and reserved networks', () => {
  for (const address of [
    '127.0.0.1',
    '10.0.0.1',
    '169.254.169.254',
    '172.16.0.1',
    '192.168.1.1',
    '::1',
    'fc00::1',
    '2001:db8::1',
    '::ffff:127.0.0.1',
  ]) {
    assert.equal(isPrivateIPAddress(address), true, address)
  }
  assert.equal(isPrivateIPAddress('8.8.8.8'), false)
  assert.equal(isPrivateIPAddress('2606:4700:4700::1111'), false)
})
