'use client'

import { useState, useEffect, useCallback } from 'react'

interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface UsePayloadAPIOptions {
  collection: string
  limit?: number
  page?: number
  sort?: string
  where?: Record<string, unknown>
  depth?: number
  locale?: string
}

export function usePayloadAPI<T = Record<string, unknown>>(options: UsePayloadAPIOptions) {
  const { collection, limit = 50, page = 1, sort = '-createdAt', where, depth = 1, locale } = options
  const [data, setData] = useState<PaginatedResponse<T> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        page: String(page),
        sort,
        depth: String(depth),
      })
      if (locale) params.set('locale', locale)
      if (where) params.set('where', JSON.stringify(where))

      const res = await fetch(`/api/${collection}?${params.toString()}`)
      if (!res.ok) throw new Error(`Failed to fetch ${collection}: ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [collection, limit, page, sort, where, depth, locale])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function usePayloadGlobal<T = Record<string, unknown>>(slug: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/globals/${slug}`)
      if (!res.ok) throw new Error(`Failed to fetch global ${slug}: ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export async function payloadCreate(collection: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Create failed: ${res.status}`)
  return res.json()
}

export async function payloadUpdate(collection: string, id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Update failed: ${res.status}`)
  return res.json()
}

export async function payloadDelete(collection: string, id: string) {
  const res = await fetch(`/api/${collection}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
  return res.json()
}
