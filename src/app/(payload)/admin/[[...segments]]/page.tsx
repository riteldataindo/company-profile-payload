import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'
import config from '@payload-config'

interface PageProps {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function normalizeSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): Record<string, string | string[]> {
  return Object.fromEntries(
    Object.entries(searchParams).filter(
      (entry): entry is [string, string | string[]] => entry[1] !== undefined,
    ),
  )
}

function normalizeSegments(segments: string[] | undefined): string[] {
  return (segments ?? []).filter((segment) => segment.length > 0)
}

function normalizeParams(segments: string[] | undefined): { segments?: string[] } {
  const normalizedSegments = normalizeSegments(segments)

  return normalizedSegments.length > 0 ? { segments: normalizedSegments } : {}
}

function normalizeRootParams(segments: string[] | undefined): { segments: string[] } {
  // Payload's runtime accepts an omitted segment for an optional catch-all route,
  // although its RootPage declaration currently marks the property as required.
  return normalizeParams(segments) as { segments: string[] }
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  return generatePageMetadata({
    config,
    params: Promise.resolve(normalizeParams(resolvedParams.segments)),
    searchParams: Promise.resolve(normalizeSearchParams(resolvedSearchParams)),
  })
}

export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams])
  return RootPage({
    config,
    importMap,
    params: Promise.resolve(normalizeRootParams(resolvedParams.segments)),
    searchParams: Promise.resolve(normalizeSearchParams(resolvedSearchParams)),
  })
}
