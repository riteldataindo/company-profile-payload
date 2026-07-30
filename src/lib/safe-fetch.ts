import { lookup } from 'dns/promises'
import { isIP } from 'net'

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024
const MAX_REDIRECTS = 3

function isPrivateIPv4(address: string): boolean {
  const octets = address.split('.').map(Number)
  if (octets.length !== 4 || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)) {
    return true
  }

  const [a, b] = octets
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51) ||
    (a === 203 && b === 0) ||
    a >= 224
  )
}

function isPrivateIPAddress(address: string): boolean {
  const version = isIP(address)
  if (version === 4) return isPrivateIPv4(address)
  if (version !== 6) return true

  const normalized = address.toLowerCase()
  if (normalized.startsWith('::ffff:')) {
    return isPrivateIPv4(normalized.slice('::ffff:'.length))
  }

  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith('ff') ||
    normalized.startsWith('2001:db8:')
  )
}

export async function validatePublicUrl(rawUrl: string): Promise<URL> {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error('Invalid URL')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are allowed')
  }
  if (parsed.username || parsed.password) {
    throw new Error('URLs containing credentials are not allowed')
  }

  const hostname = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) {
    throw new Error('Local URLs are not allowed')
  }

  const directIpVersion = isIP(hostname)
  const addresses = directIpVersion
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true, verbatim: true })

  if (addresses.length === 0 || addresses.some(entry => isPrivateIPAddress(entry.address))) {
    throw new Error('Private or reserved network addresses are not allowed')
  }

  return parsed
}

async function readLimitedText(response: Response): Promise<string> {
  const declaredSize = Number(response.headers.get('content-length') || 0)
  if (declaredSize > MAX_RESPONSE_BYTES) {
    throw new Error('Response is too large to analyze')
  }
  if (!response.body) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let output = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_RESPONSE_BYTES) {
      await reader.cancel()
      throw new Error('Response is too large to analyze')
    }
    output += decoder.decode(value, { stream: true })
  }

  return output + decoder.decode()
}

export async function fetchPublicHtml(rawUrl: string): Promise<{ html: string; finalUrl: URL }> {
  let currentUrl = await validatePublicUrl(rawUrl)

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(currentUrl, {
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (compatible; SmartCounter SEO Analyzer)',
        },
      })

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (!location || redirectCount === MAX_REDIRECTS) {
          throw new Error('Too many or invalid redirects')
        }
        currentUrl = await validatePublicUrl(new URL(location, currentUrl).toString())
        continue
      }

      if (!response.ok) throw new Error(`Remote server returned HTTP ${response.status}`)
      const contentType = response.headers.get('content-type') || ''
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
        throw new Error('URL did not return an HTML page')
      }

      return { html: await readLimitedText(response), finalUrl: currentUrl }
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error('Unable to fetch URL')
}
