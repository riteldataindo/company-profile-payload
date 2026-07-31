import { lookup } from 'dns/promises'
import { request as httpRequest, type IncomingMessage } from 'http'
import { request as httpsRequest } from 'https'
import { isIP } from 'net'

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024
const MAX_REDIRECTS = 3
const REQUEST_TIMEOUT_MS = 10_000

function isPrivateIPv4(address: string): boolean {
  const octets = address.split('.').map(Number)
  if (
    octets.length !== 4
    || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)
  ) {
    return true
  }

  const [a, b] = octets
  return (
    a === 0
    || a === 10
    || a === 127
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 0)
    || (a === 192 && b === 168)
    || (a === 198 && (b === 18 || b === 19))
    || (a === 198 && b === 51)
    || (a === 203 && b === 0)
    || a >= 224
  )
}

export function isPrivateIPAddress(address: string): boolean {
  const version = isIP(address)
  if (version === 4) return isPrivateIPv4(address)
  if (version !== 6) return true

  const normalized = address.toLowerCase()
  if (normalized.startsWith('::ffff:')) {
    return isPrivateIPv4(normalized.slice('::ffff:'.length))
  }

  return (
    normalized === '::'
    || normalized === '::1'
    || normalized.startsWith('fc')
    || normalized.startsWith('fd')
    || /^fe[89ab]/.test(normalized)
    || normalized.startsWith('ff')
    || normalized.startsWith('2001:db8:')
  )
}

type ResolvedPublicUrl = {
  address: string
  family: 4 | 6
  url: URL
}

async function resolvePublicUrl(rawUrl: string): Promise<ResolvedPublicUrl> {
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
    ? [{ address: hostname, family: directIpVersion }]
    : await lookup(hostname, { all: true, verbatim: true })

  if (addresses.length === 0 || addresses.some(entry => isPrivateIPAddress(entry.address))) {
    throw new Error('Private or reserved network addresses are not allowed')
  }

  const selected = addresses[0]
  return {
    address: selected.address,
    family: selected.family as 4 | 6,
    url: parsed,
  }
}

export async function validatePublicUrl(rawUrl: string): Promise<URL> {
  return (await resolvePublicUrl(rawUrl)).url
}

function readLimitedText(response: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const declaredSize = Number(response.headers['content-length'] || 0)
    if (declaredSize > MAX_RESPONSE_BYTES) {
      response.destroy()
      reject(new Error('Response is too large to analyze'))
      return
    }

    const chunks: Buffer[] = []
    let size = 0
    response.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_RESPONSE_BYTES) {
        response.destroy(new Error('Response is too large to analyze'))
        return
      }
      chunks.push(chunk)
    })
    response.on('end', () => resolve(Buffer.concat(chunks, size).toString('utf8')))
    response.on('error', reject)
  })
}

async function requestPinnedHtml(resolved: ResolvedPublicUrl): Promise<{
  body: string
  contentType: string
  location?: string
  status: number
}> {
  return new Promise((resolve, reject) => {
    const requestFn = resolved.url.protocol === 'https:' ? httpsRequest : httpRequest
    const request = requestFn(resolved.url, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (compatible; SmartCounter SEO Analyzer)',
      },
      lookup: ((_hostname: string, _options: unknown, callback: Function) => {
        callback(null, resolved.address, resolved.family)
      }) as any,
    }, async (response) => {
      const status = response.statusCode || 0
      const location = response.headers.location
      if (status >= 300 && status < 400) {
        response.resume()
        resolve({ body: '', contentType: '', location, status })
        return
      }

      try {
        resolve({
          body: await readLimitedText(response),
          contentType: String(response.headers['content-type'] || ''),
          status,
        })
      } catch (error) {
        reject(error)
      }
    })

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error('Remote request timed out'))
    })
    request.on('socket', (socket) => {
      socket.once('connect', () => {
        if (!socket.remoteAddress || isPrivateIPAddress(socket.remoteAddress)) {
          request.destroy(new Error('Connected address is private or reserved'))
        }
      })
    })
    request.on('error', reject)
    request.end()
  })
}

export async function fetchPublicHtml(rawUrl: string): Promise<{ html: string; finalUrl: URL }> {
  let current = await resolvePublicUrl(rawUrl)

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const response = await requestPinnedHtml(current)

    if (response.status >= 300 && response.status < 400) {
      if (!response.location || redirectCount === MAX_REDIRECTS) {
        throw new Error('Too many or invalid redirects')
      }
      current = await resolvePublicUrl(new URL(response.location, current.url).toString())
      continue
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Remote server returned HTTP ${response.status}`)
    }
    if (
      !response.contentType.includes('text/html')
      && !response.contentType.includes('application/xhtml+xml')
    ) {
      throw new Error('URL did not return an HTML page')
    }

    return { html: response.body, finalUrl: current.url }
  }

  throw new Error('Unable to fetch URL')
}
