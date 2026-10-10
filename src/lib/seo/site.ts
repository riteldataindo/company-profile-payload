const LOCAL_SITE_URL = 'http://127.0.0.1:3000'

/**
 * Resolve the canonical release origin without silently claiming ownership of
 * a host. Production metadata is intentionally hostless when the release URL
 * is absent or malformed; local/test runs retain a deterministic origin.
 */
export function getSiteUrl(): URL | undefined {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) {
    return process.env.NODE_ENV === 'production' ? undefined : new URL(LOCAL_SITE_URL)
  }

  try {
    const url = new URL(configured)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
      return undefined
    }
    if (url.pathname !== '/' && url.pathname !== '') return undefined
    url.pathname = url.pathname.replace(/\/+$/, '') || '/'
    url.search = ''
    url.hash = ''
    return url
  } catch {
    return undefined
  }
}

export function siteUrlForPath(path: string): string | undefined {
  const siteUrl = getSiteUrl()
  if (!siteUrl) return undefined
  return new URL(path.replace(/^\/?/, '/'), siteUrl).toString()
}
