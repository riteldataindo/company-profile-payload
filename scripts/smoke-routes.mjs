const baseUrl = new URL(process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3014')

async function expectStatus(path, expected, options = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    redirect: 'manual',
    ...options,
  })
  if (response.status !== expected) {
    throw new Error(`${path}: expected ${expected}, received ${response.status}`)
  }
  return response
}

const sitemapResponse = await expectStatus('/sitemap.xml', 200)
const sitemap = await sitemapResponse.text()
const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map(match => new URL(match[1]).pathname)
const staticPaths = ['/en', '/id', '/ko', '/ja', '/zh', '/en/blog', '/id/blog']
const paths = [...new Set([...staticPaths, ...sitemapPaths])]

let htmlChecks = 0
let rscChecks = 0

await expectStatus('/', 307)

for (const path of paths) {
  const htmlResponse = await expectStatus(path, 200, {
    headers: { Accept: 'text/html' },
  })
  const html = await htmlResponse.text()
  if (/Internal Server Error|Application error: a server-side exception/i.test(html)) {
    throw new Error(`${path}: rendered an application error`)
  }
  for (const header of [
    'content-security-policy',
    'permissions-policy',
    'referrer-policy',
    'x-content-type-options',
    'x-frame-options',
  ]) {
    if (!htmlResponse.headers.get(header)) {
      throw new Error(`${path}: missing ${header}`)
    }
  }
  if (htmlResponse.headers.get('x-powered-by')) {
    throw new Error(`${path}: leaks x-powered-by`)
  }
  htmlChecks++

  const separator = path.includes('?') ? '&' : '?'
  const rscResponse = await expectStatus(`${path}${separator}_rsc=qa-smoke`, 200, {
    headers: {
      Accept: 'text/x-component',
      RSC: '1',
      'Next-Router-Prefetch': '1',
    },
  })
  const rsc = await rscResponse.text()
  if (/Internal Server Error|Application error: a server-side exception/i.test(rsc)) {
    throw new Error(`${path}: RSC rendered an application error`)
  }
  rscChecks++
}

await expectStatus('/en/features/definitely-not-a-feature', 404)
await expectStatus('/en/use-cases/definitely-not-a-use-case', 404)
await expectStatus('/en/blog/definitely-not-a-post', 404)
await expectStatus('/en/blog?page=-1', 308)
await expectStatus('/en/blog?page=abc', 308)
await expectStatus('/en/blog?page=1001', 308)

console.log(`Smoke QA passed: ${htmlChecks} HTML + ${rscChecks} RSC routes`)
