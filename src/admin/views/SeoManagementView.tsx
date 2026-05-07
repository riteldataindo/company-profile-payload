'use client'

import React, { useState, useEffect } from 'react'
import { CitabilityAnalysis } from '@/admin/components/SeoEditor/CitabilityAnalysis'
import { SparklineInline, ScoreTrendDetail } from '@/admin/components/SeoEditor/ScoreTrend'
import { CompetitorComparison } from '@/admin/components/SeoEditor/CompetitorComparison'
import { SEO_GUIDANCE } from '@/admin/data/seo-guidance'

interface SeoCheck {
  name: string
  score: number
  max: number
  status: 'green' | 'amber' | 'red'
  tip: string
  tier?: 'high' | 'medium' | 'info' | 'geo'
}

interface SeoItem {
  id: string
  title: string
  collection: string
  type?: string
  slug?: string
  meta?: {
    title?: string
    description?: string
    imageId?: string | null
  }
  score?: number
  checks?: SeoCheck[]
  sourceContent?: string
  url?: string
  ogImageAlt?: string | null
  contentImageAlt?: string | null
  hasAuthor?: boolean
  hasPublishedAt?: boolean
  hasExcerpt?: boolean
}

interface EditFormData {
  metaTitle: string
  metaDescription: string
  ogImageId: string | null
  ogImagePreview: string | null
  ogImageAlt: string
}

function Chevron({ direction = 'down' }: { direction?: 'down' | 'up' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: direction === 'up' ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#059669'
  if (score >= 40) return '#d97706'
  return '#dc2626'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'green'
  if (score >= 40) return 'amber'
  return 'red'
}

function calculateScore(item: SeoItem): number {
  return item.score ?? 0
}

export default function SeoManagementView() {
  const [items, setItems] = useState<SeoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [localeFilter, setLocaleFilter] = useState<'en' | 'id'>('en')
  const [typeFilter, setTypeFilter] = useState<'all' | 'blog' | 'feature' | 'useCase'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'missing'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormData>({ metaTitle: '', metaDescription: '', ogImageId: null, ogImagePreview: null, ogImageAlt: '' })
  const [autoFixLoading, setAutoFixLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [liveChecks, setLiveChecks] = useState<SeoCheck[] | null>(null)
  const [snapshots, setSnapshots] = useState<Record<string, { score: number; timestamp: string; breakdown?: any }[]>>({})
  const [snapshotLoading, setSnapshotLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const TOPIC_KW = ['people counting', 'cctv ai', 'visitor analytics', 'analitik pengunjung', 'smart cctv', 'ai camera', 'foot traffic', 'retail analytics']

  const recalcChecks = (title: string, desc: string, imageId: string | null, _slug: string, content: string | null, item?: SeoItem) => {
    const checks: SeoCheck[] = []
    const tl = title.toLowerCase()
    const isBlog = item?.type === 'blog'

    // === TECHNICAL (38 pts) ===

    const tLen = title.length
    checks.push(tLen >= 50 && tLen <= 60
      ? { name: 'Title Length', score: 8, max: 8, status: 'green', tip: `${tLen} chars — optimal (50-60)`, tier: 'high' }
      : tLen >= 30 && tLen <= 70
        ? { name: 'Title Length', score: 5, max: 8, status: 'amber', tip: `${tLen} chars — acceptable, optimal 50-60`, tier: 'high' }
        : tLen > 0
          ? { name: 'Title Length', score: 2, max: 8, status: 'red', tip: `${tLen} chars — should be 50-60`, tier: 'high' }
          : { name: 'Title Length', score: 0, max: 8, status: 'red', tip: 'Missing', tier: 'high' })

    const allTitles = items.map(i => i.meta?.title).filter(Boolean) as string[]
    const dupes = allTitles.filter(t => t === title).length
    checks.push(dupes <= 1
      ? { name: 'Title Unique', score: 7, max: 7, status: 'green', tip: 'Unique', tier: 'high' }
      : { name: 'Title Unique', score: 0, max: 7, status: 'red', tip: `Duplicate (${dupes})`, tier: 'high' })

    const artifacts = [/ for —/, / for -/, /— —/, /  /, /\[\d+\]/, /\.{2,}/]
    const hasArt = artifacts.some(p => p.test(title))
    const words = tl.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean)
    const bigrams: string[] = []
    for (let i = 0; i < words.length - 1; i++) bigrams.push(`${words[i]} ${words[i+1]}`)
    const bgCounts = new Map<string, number>()
    for (const bg of bigrams) bgCounts.set(bg, (bgCounts.get(bg) || 0) + 1)
    const repeated = Array.from(bgCounts.entries()).filter(([,c]) => c >= 3)

    if (!hasArt && repeated.length === 0) {
      checks.push({ name: 'Title Natural', score: 6, max: 6, status: 'green', tip: 'Reads naturally', tier: 'high' })
    } else {
      const issues: string[] = []
      if (hasArt) issues.push('auto-gen artifact')
      if (repeated.length > 0) issues.push(`repeated: "${repeated[0][0]}"`)
      checks.push({ name: 'Title Natural', score: 0, max: 6, status: 'red', tip: issues.join('; '), tier: 'high' })
    }

    checks.push(imageId
      ? { name: 'OG Image', score: 7, max: 7, status: 'green', tip: 'Present — multi-modal = 156% higher AI selection', tier: 'high' }
      : { name: 'OG Image', score: 0, max: 7, status: 'red', tip: 'Missing — needed for social + AI citations', tier: 'high' })

    const serverOgAlt = item?.checks?.find(c => c.name === 'OG Image Alt')
    checks.push(serverOgAlt || { name: 'OG Image Alt', score: imageId ? 6 : 0, max: 6, status: imageId ? 'green' : 'red', tip: imageId ? 'Assumed present' : 'No image', tier: 'high' })

    const serverContentAlt = item?.checks?.find(c => c.name === 'Content Image Alt')
    if (serverContentAlt) checks.push(serverContentAlt)
    else checks.push({ name: 'Content Image Alt', score: 2, max: 4, status: 'amber', tip: 'Check in server response', tier: 'high' })

    // === CTR & TRUST (30 pts) ===

    const dLen = desc.length
    checks.push(dLen >= 120 && dLen <= 150
      ? { name: 'Desc Length', score: 7, max: 7, status: 'green', tip: `${dLen} chars — optimal for SERP CTR (120-150)`, tier: 'medium' }
      : dLen >= 80
        ? { name: 'Desc Length', score: 4, max: 7, status: 'amber', tip: `${dLen} chars — ideal 120-150`, tier: 'medium' }
        : { name: 'Desc Length', score: dLen > 0 ? 2 : 0, max: 7, status: dLen > 0 ? 'amber' : 'red', tip: dLen > 0 ? `${dLen} chars — too short` : 'Missing', tier: 'medium' })

    const descSentences = desc.split(/\.\s*/).filter(s => s.trim().length > 3)
    const last = descSentences[descSentences.length - 1] || ''
    const lastVerb = /\b(is|are|help|track|use|learn|get|boost|reduce|monitor|detect|provide|transform|optimize|untuk|dengan|yang|dapat|bisa|membantu)\b/i.test(last)
    let dnScore = 0
    if (descSentences.length >= 1) dnScore += 3
    if (lastVerb || last.length > 25) dnScore += 3
    checks.push({ name: 'Desc Natural', score: Math.min(dnScore, 6), max: 6, status: dnScore >= 6 ? 'green' : dnScore >= 3 ? 'amber' : 'red', tip: dnScore >= 6 ? 'Reads naturally' : 'Ends abruptly', tier: 'medium' })

    const serverEEAT = (item?.checks || []).filter(c => c.name.startsWith('E-E-A-T'))
    if (serverEEAT.length > 0) {
      checks.push(...serverEEAT)
    } else {
      checks.push({ name: 'E-E-A-T: Depth', score: 10, max: 17, status: 'amber', tip: 'Check server data', tier: 'medium' })
    }

    // === GEO / AI SEARCH (17 pts) ===

    const contentText = content || ''
    const first60 = contentText.split(/\s+/).slice(0, 60).join(' ').toLowerCase()
    const hasDef = /\b(adalah|is|refers to|merupakan|yaitu|ialah)\b/.test(first60)
    if (hasDef) {
      checks.push({ name: 'Opening Definition', score: 7, max: 7, status: 'green', tip: 'Starts with definition — optimal for AI citation', tier: 'geo' })
    } else if (contentText.length > 0) {
      checks.push({ name: 'Opening Definition', score: 2, max: 7, status: 'amber', tip: 'No "X is/adalah..." in first 60 words — add for AI Overviews', tier: 'geo' })
    } else {
      checks.push({ name: 'Opening Definition', score: 0, max: 7, status: 'red', tip: 'No content — AI crawlers need SSR text', tier: 'geo' })
    }

    const paras = contentText.split(/\n\n+|\r\n\r\n+/).filter(p => p.trim().length > 50)
    const citable = paras.filter(p => { const wc = p.trim().split(/\s+/).length; return wc >= 100 && wc <= 200 })
    if (citable.length >= 2) {
      checks.push({ name: 'Citability Blocks', score: 10, max: 10, status: 'green', tip: `${citable.length} citable passages (100-200 words)`, tier: 'geo' })
    } else if (citable.length === 1) {
      checks.push({ name: 'Citability Blocks', score: 6, max: 10, status: 'amber', tip: '1 citable passage — aim for 2+ (100-200 words each)', tier: 'geo' })
    } else {
      checks.push({ name: 'Citability Blocks', score: 2, max: 10, status: 'amber', tip: 'No 100-200 word passages — AI needs self-contained answer blocks', tier: 'geo' })
    }

    // === INFORMATIONAL (15 pts) ===

    const cWords = contentText.split(/\s+/).filter(Boolean).length
    const greenW = isBlog ? 800 : 300
    const amberW = isBlog ? 400 : 100
    let cs: number, cst: 'green' | 'amber' | 'red', ct: string
    if (cWords >= greenW) { cs = 10; cst = 'green'; ct = `${cWords} words — comprehensive` }
    else if (cWords >= amberW) { cs = 6; cst = 'amber'; ct = `${cWords} words — ${isBlog ? 'target 800+ for depth' : 'consider expanding'}` }
    else if (cWords > 0) { cs = 3; cst = 'amber'; ct = `${cWords} words — thin content` }
    else { cs = 0; cst = 'red'; ct = 'No content body' }
    checks.push({ name: 'Content Depth', score: cs, max: 10, status: cst, tip: ct, tier: 'info' })

    const topicMatches = TOPIC_KW.filter(k => tl.includes(k))
    if (topicMatches.length >= 1) {
      checks.push({ name: 'Topic Indicator', score: 5, max: 5, status: 'green', tip: `"${topicMatches[0]}" found in title`, tier: 'info' })
    } else {
      const contentMatches = TOPIC_KW.filter(k => contentText.toLowerCase().includes(k))
      checks.push({ name: 'Topic Indicator', score: contentMatches.length > 0 ? 3 : 2, max: 5, status: 'amber', tip: contentMatches.length > 0 ? 'Topic in content, not title — OK' : 'No exact keyword — fine if semantically covered', tier: 'info' })
    }

    setLiveChecks(checks)
  }

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        params.append('locale', localeFilter)
        if (typeFilter !== 'all') params.append('type', typeFilter)
        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (searchTerm) params.append('search', searchTerm)

        const res = await fetch(`/api/seo-items?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setItems(data.items || [])
        setError('')
      } catch (err) {
        setError('Failed to load items')
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchItems()

    // Fetch score history
    fetch('/api/seo-scores').then(r => r.json()).then(data => {
      const grouped: Record<string, { score: number; timestamp: string; breakdown?: any }[]> = {}
      for (const s of (data.snapshots || [])) {
        if (!grouped[s.id]) grouped[s.id] = []
        grouped[s.id].push({ score: s.score, timestamp: s.timestamp, breakdown: s.breakdown })
      }
      setSnapshots(grouped)
    }).catch(() => {})
  }, [localeFilter, typeFilter, statusFilter, searchTerm])

  // Filter items based on status
  const filteredItems = items.filter(item => {
    const score = calculateScore(item)
    const isMissingMeta = !item.meta?.title || !item.meta?.description
    const isMissingImage = !item.meta?.imageId

    if (statusFilter === 'complete') {
      return !isMissingMeta && !isMissingImage
    }
    if (statusFilter === 'missing') {
      return isMissingMeta || isMissingImage
    }
    return true
  })

  const stats = {
    total: items.length,
    complete: items.filter(item => {
      const isMissingMeta = !item.meta?.title || !item.meta?.description
      const isMissingImage = !item.meta?.imageId
      return !isMissingMeta && !isMissingImage
    }).length,
    missing: items.filter(item => {
      const isMissingMeta = !item.meta?.title || !item.meta?.description
      const isMissingImage = !item.meta?.imageId
      return isMissingMeta || isMissingImage
    }).length,
  }

  const handleAutoFix = async () => {
    try {
      setAutoFixLoading(true)

      const res1 = await fetch('/api/seo-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto-fix-all', locale: localeFilter }),
      })
      if (!res1.ok) throw new Error('Auto-fix meta failed')

      const res2 = await fetch('/api/seo-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'use-content-images', locale: localeFilter }),
      })
      if (!res2.ok) throw new Error('Auto-fix images failed')

      const refreshParams = new URLSearchParams({ locale: localeFilter })
      if (typeFilter !== 'all') refreshParams.append('type', typeFilter)
      const refreshRes = await fetch(`/api/seo-items?${refreshParams.toString()}`)
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setItems(data.items || [])
      }
      setError('')
      showToast('Auto-fix completed — titles, descriptions & images optimized')
    } catch (err) {
      showToast('Auto-fix failed. Please try again.', 'error')
    } finally {
      setAutoFixLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!expandedId) return

    try {
      setSaveLoading(true)
      const item = items.find(i => getItemUid(i) === expandedId)
      if (!item) return

      const metaPayload: Record<string, unknown> = {
        title: editForm.metaTitle,
        description: editForm.metaDescription,
      }
      if (editForm.ogImageId !== undefined) {
        metaPayload.image = editForm.ogImageId
      }

      const res = await fetch(`/api/seo-items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: item.collection,
          locale: localeFilter,
          meta: metaPayload,
        }),
      })

      if (!res.ok) throw new Error('Save failed')

      if (editForm.ogImageId && editForm.ogImageAlt) {
        try {
          await fetch(`/api/media/${editForm.ogImageId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alt: editForm.ogImageAlt }),
          })
        } catch { /* non-blocking */ }
      }

      setExpandedId(null)
      setLiveChecks(null)
      setError('')
      showToast('SEO data saved successfully')

      const params = new URLSearchParams({ locale: localeFilter })
      if (typeFilter !== 'all') params.append('type', typeFilter)
      const refreshRes = await fetch(`/api/seo-items?${params.toString()}`)
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setItems(data.items || [])
      }
    } catch (err) {
      showToast('Failed to save. Please try again.', 'error')
    } finally {
      setSaveLoading(false)
    }
  }

  const getItemUid = (item: SeoItem) => `${item.collection}-${item.id}`

  const handleRowClick = async (item: SeoItem) => {
    const uid = getItemUid(item)
    if (expandedId === uid) {
      setExpandedId(null)
      return
    }
    setExpandedId(uid)
    setLiveChecks(null)
    let preview: string | null = null
    let altText = ''
    if (item.meta?.imageId) {
      try {
        const res = await fetch(`/api/media/${item.meta.imageId}`)
        if (res.ok) {
          const data = await res.json()
          preview = data.url || null
          altText = data.alt || ''
        }
      } catch { /* ignore */ }
    }
    setEditForm({
      metaTitle: item.meta?.title || '',
      metaDescription: item.meta?.description || '',
      ogImageId: item.meta?.imageId || null,
      ogImagePreview: preview,
      ogImageAlt: altText,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadLoading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', `OG Image — ${editForm.metaTitle || 'SmartCounter'}`)

      const res = await fetch('/api/seo-items/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Upload failed')
      }
      const data = await res.json()

      const autoAlt = `OG Image — ${editForm.metaTitle || 'SmartCounter'}`
      setEditForm(prev => ({
        ...prev,
        ogImageId: data.doc?.id?.toString() || null,
        ogImagePreview: data.doc?.url || `/api/media/file/${data.doc?.filename}`,
        ogImageAlt: data.doc?.alt || autoAlt,
      }))
    } catch (err) {
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploadLoading(false)
    }
  }

  const collectionLabels = {
    blog: 'Blog',
    feature: 'Feature',
    useCase: 'Use Case',
  }

  // Styles
  const panelStyle: React.CSSProperties = {
    borderRadius: 20,
    border: '1px solid var(--sc-border)',
    background: 'var(--sc-surface)',
    boxShadow: 'var(--sc-shadow)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  }

  const statCardStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 120,
    padding: '16px 20px',
    borderRadius: 12,
    border: '1px solid var(--sc-border)',
    background: 'var(--sc-surface-2)',
    textAlign: 'center',
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid var(--sc-border)',
    minHeight: 60,
  }

  const filterRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 24px',
    borderBottom: '1px solid var(--sc-border)',
    flexWrap: 'wrap',
  }

  const selectStyle: React.CSSProperties = {
    padding: '8px 32px 8px 12px',
    borderRadius: 10,
    border: '1px solid var(--sc-border)',
    background: '#18181b',
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 180ms ease',
    colorScheme: 'dark',
    WebkitAppearance: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  }

  const searchInputStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 200,
    padding: '8px 12px',
    borderRadius: 10,
    border: '1px solid var(--sc-border)',
    background: '#18181b',
    color: '#fafafa',
    fontSize: 14,
    transition: 'all 180ms ease',
  }

  const tableHeaderStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 0.6fr 0.6fr 0.8fr',
    gap: 16,
    padding: '14px 24px',
    borderBottom: '1px solid var(--sc-border)',
    background: 'var(--sc-surface-2)',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--sc-text-muted)',
    fontFamily: 'var(--font-mono)',
  }

  const tableRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 0.6fr 0.6fr 0.8fr',
    gap: 16,
    padding: '16px 24px',
    borderBottom: '1px solid var(--sc-border)',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 180ms ease',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 10,
    border: 'none',
    background: 'var(--sc-red)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 180ms ease',
  }

  const inputFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid var(--sc-border)',
    background: 'var(--sc-surface-2)',
    color: 'var(--sc-text)',
    fontSize: 14,
    fontFamily: '"Manrope", sans-serif',
    transition: 'all 180ms ease',
  }

  const googlePreviewStyle: React.CSSProperties = {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    border: '1px solid var(--sc-border)',
    background: 'var(--sc-surface-2)',
    fontSize: 13,
  }

  const googleUrlStyle: React.CSSProperties = {
    color: '#059669',
    fontSize: 12,
    marginBottom: 6,
  }

  const googleTitleStyle: React.CSSProperties = {
    color: '#2563eb',
    fontWeight: 600,
    textDecoration: 'underline',
    marginBottom: 4,
    wordBreak: 'break-word' as const,
  }

  const googleDescStyle: React.CSSProperties = {
    color: 'var(--sc-text-secondary)',
    fontSize: 13,
    lineHeight: 1.4,
    wordBreak: 'break-word' as const,
  }

  const badgeStyle = (type: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    background:
      type === 'blog'
        ? 'rgba(37,99,235,0.1)'
        : type === 'feature'
          ? 'rgba(217,119,6,0.1)'
          : 'rgba(5,150,105,0.1)',
    color:
      type === 'blog'
        ? '#2563eb'
        : type === 'feature'
          ? '#d97706'
          : '#059669',
  })

  const statusBadgeStyle = (exists: boolean): React.CSSProperties => ({
    fontSize: 16,
    color: exists ? '#059669' : '#dc2626',
  })

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div
          style={{
            width: 28,
            height: 28,
            border: '2.5px solid var(--sc-border)',
            borderTopColor: '#dc2626',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4px 0 48px', position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            borderRadius: 14,
            border: `1px solid ${toast.type === 'success' ? 'rgba(5,150,105,0.3)' : 'rgba(220,38,38,0.3)'}`,
            background: toast.type === 'success'
              ? 'linear-gradient(135deg, rgba(5,150,105,0.12) 0%, rgba(5,150,105,0.04) 100%)'
              : 'linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.04) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: toast.type === 'success'
              ? '0 8px 32px rgba(5,150,105,0.15), 0 0 0 1px rgba(5,150,105,0.05)'
              : '0 8px 32px rgba(220,38,38,0.15), 0 0 0 1px rgba(220,38,38,0.05)',
            fontSize: 13,
            fontWeight: 600,
            color: toast.type === 'success' ? '#34d399' : '#f87171',
            animation: 'toastSlide 300ms cubic-bezier(0.16,1,0.3,1)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: toast.type === 'success' ? '#059669' : '#dc2626',
            boxShadow: toast.type === 'success' ? '0 0 12px rgba(5,150,105,0.6)' : '0 0 12px rgba(220,38,38,0.6)',
          }} />
          {toast.message}
          <button
            onClick={() => setToast(null)}
            style={{ background: 'none', border: 'none', color: 'var(--sc-text-muted)', cursor: 'pointer', padding: '0 0 0 8px', fontSize: 16, lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}
      <style>{`@keyframes toastSlide { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>

      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>SEO Management</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Manage SEO across all content</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {localeFilter === 'id' && (
            <button
              onClick={async () => {
                try {
                  setAutoFixLoading(true)
                  const res = await fetch('/api/seo-items/seed-id-slugs', { method: 'POST' })
                  if (!res.ok) throw new Error('Seed failed')
                  const data = await res.json()
                  showToast(`Seeded: ${data.updated.features} features, ${data.updated.useCases} use cases, ${data.updated.blogPosts} blog posts`)
                  const refreshParams = new URLSearchParams({ locale: localeFilter })
                  const refreshRes = await fetch(`/api/seo-items?${refreshParams.toString()}`)
                  if (refreshRes.ok) {
                    const refreshData = await refreshRes.json()
                    setItems(refreshData.items || [])
                  }
                } catch (err) {
                  showToast('Failed to seed Indonesian slugs', 'error')
                } finally {
                  setAutoFixLoading(false)
                }
              }}
              disabled={autoFixLoading}
              style={{
                ...buttonStyle,
                background: '#059669',
                opacity: autoFixLoading ? 0.6 : 1,
                cursor: autoFixLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!autoFixLoading) (e.currentTarget as HTMLButtonElement).style.background = '#047857' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#059669' }}
            >
              Seed ID Slugs
            </button>
          )}
          <button
            onClick={async () => {
              setSnapshotLoading(true)
              try {
                const payload = items.map(item => ({ id: item.id, title: item.title, collection: item.collection, score: calculateScore(item), checks: item.checks }))
                const res = await fetch('/api/seo-scores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: payload }) })
                const data = await res.json()
                showToast(data.message || 'Snapshot saved')
                // Refresh snapshots
                const histRes = await fetch('/api/seo-scores')
                const histData = await histRes.json()
                const grouped: Record<string, any[]> = {}
                for (const s of (histData.snapshots || [])) { if (!grouped[s.id]) grouped[s.id] = []; grouped[s.id].push({ score: s.score, timestamp: s.timestamp, breakdown: s.breakdown }) }
                setSnapshots(grouped)
              } catch { showToast('Failed to save snapshot', 'error') }
              setSnapshotLoading(false)
            }}
            disabled={snapshotLoading}
            style={{
              ...buttonStyle,
              background: '#3b82f6',
              opacity: snapshotLoading ? 0.6 : 1,
              cursor: snapshotLoading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!snapshotLoading) (e.currentTarget as HTMLButtonElement).style.background = '#2563eb' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#3b82f6' }}
          >
            {snapshotLoading ? 'Saving...' : 'Snapshot Scores'}
          </button>
          <button
            onClick={handleAutoFix}
            disabled={autoFixLoading}
            style={{
              ...buttonStyle,
              opacity: autoFixLoading ? 0.6 : 1,
              cursor: autoFixLoading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (!autoFixLoading) {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--sc-red-hover)'
                ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(220,38,38,0.3)'
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--sc-red)'
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
            }}
          >
            {autoFixLoading ? 'Processing...' : 'Auto-fix All'}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderBottom: '1px solid var(--sc-border)', flexWrap: 'wrap' }}>
        <div style={{ ...statCardStyle, borderColor: localeFilter === 'id' ? '#059669' : 'var(--sc-border)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: localeFilter === 'id' ? '#059669' : '#2563eb', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {localeFilter === 'en' ? 'English' : 'Indonesia'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--sc-text)', marginBottom: 4 }}>{stats.total}</div>
          <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontWeight: 600 }}>TOTAL ITEMS</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#059669', marginBottom: 4 }}>{stats.complete}</div>
          <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontWeight: 600 }}>COMPLETE SEO</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', marginBottom: 4 }}>{stats.missing}</div>
          <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontWeight: 600 }}>MISSING DATA</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706', marginBottom: 4 }}>
            {items.length > 0 ? Math.round(items.reduce((sum, item) => sum + calculateScore(item), 0) / items.length) : 0}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', fontWeight: 600 }}>AVG SCORE</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterRowStyle}>
        <select
          value={localeFilter}
          onChange={e => setLocaleFilter(e.target.value as any)}
          style={{ ...selectStyle, fontWeight: 700, borderColor: localeFilter === 'id' ? '#059669' : 'var(--sc-border)' }}
        >
          <option value="en">EN — English</option>
          <option value="id">ID — Indonesia</option>
        </select>

        <div style={{ width: 1, height: 24, background: 'var(--sc-border)' }} />

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as any)}
          style={selectStyle}
        >
          <option value="all">All Types</option>
          <option value="blog">Blog Posts</option>
          <option value="feature">Features</option>
          <option value="useCase">Use Cases</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          style={selectStyle}
        >
          <option value="all">All Status</option>
          <option value="complete">Complete</option>
          <option value="missing">Missing Data</option>
        </select>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Error Message (legacy) */}
      {error && !toast && (
        <div style={{ padding: '12px 24px', background: 'rgba(220,38,38,0.08)', borderBottom: '1px solid rgba(220,38,38,0.2)', color: '#dc2626', fontSize: 14, fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Table Header */}
      <div style={tableHeaderStyle}>
        <div>Title</div>
        <div>Type</div>
        <div style={{ textAlign: 'center' }}>Meta</div>
        <div style={{ textAlign: 'center' }}>OG</div>
        <div style={{ textAlign: 'center' }}>Score</div>
      </div>

      {/* Table Rows */}
      {filteredItems.length === 0 ? (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--sc-text-secondary)' }}>
          No items found. Try adjusting your filters.
        </div>
      ) : (
        filteredItems.map(item => {
          const score = calculateScore(item)
          const hasMeta = !!(item.meta?.title && item.meta?.description)
          const hasOg = !!item.meta?.imageId
          const isExpanded = expandedId === getItemUid(item)

          return (
            <div key={`${item.collection}-${item.id}`}>
              {/* Main Row */}
              <div
                style={{ ...tableRowStyle, background: isExpanded ? 'var(--sc-surface-hover)' : 'transparent' }}
                onMouseEnter={e => {
                  if (!isExpanded) {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--sc-surface-hover)'
                  }
                }}
                onMouseLeave={e => {
                  if (!isExpanded) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                  }
                }}
                onClick={() => handleRowClick(item)}
              >
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--sc-text-muted)' }}>{item.url || `/${item.collection}/${item.id}`}</div>
                </div>
                <div style={{ ...badgeStyle(item.collection) }}>{collectionLabels[item.collection as keyof typeof collectionLabels] || item.collection}</div>
                <div style={{ textAlign: 'center', ...statusBadgeStyle(hasMeta) }}>{hasMeta ? '✓' : '✗'}</div>
                <div style={{ textAlign: 'center', ...statusBadgeStyle(hasOg) }}>{hasOg ? '✓' : '✗'}</div>
                <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: getScoreColor(score) }}>{score}%</span>
                  <SparklineInline snapshots={snapshots[`${item.collection}-${item.id}`] || []} />
                </div>
              </div>

              {/* Expanded Editor */}
              {isExpanded && (() => {
                const fetchSuggestionFn = async (): Promise<{ title: string; description: string } | null> => {
                  try {
                    const res = await fetch('/api/seo-items/suggest', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: item.id, collection: item.collection, locale: localeFilter }),
                    })
                    if (!res.ok) return null
                    return await res.json()
                  } catch { return null }
                }
                const doRecalcFn = (t: string, d: string) => {
                  recalcChecks(t, d, editForm.ogImageId, item.slug || '', item.sourceContent ?? null, item)
                }
                return (
                <div onClick={(e) => e.stopPropagation()} style={{ padding: '20px 24px', borderBottom: '1px solid var(--sc-border)', background: 'var(--sc-surface-2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                    {/* Left Column - Inputs */}
                    <div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--sc-text)' }}>Meta Title</label>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              const suggestion = await fetchSuggestionFn()
                              if (suggestion) {
                                setEditForm(prev => {
                                  doRecalcFn(suggestion.title, prev.metaDescription)
                                  return { ...prev, metaTitle: suggestion.title }
                                })
                                showToast(`Title: "${suggestion.title.substring(0, 40)}..."`)
                              }
                            }}
                            style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4 }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                          >
                            Auto-generate
                          </button>
                        </div>
                        <input
                          type="text"
                          value={editForm.metaTitle}
                          onChange={e => setEditForm({ ...editForm, metaTitle: e.target.value })}
                          style={inputFieldStyle}
                          placeholder="Page title for search results"
                          maxLength={60}
                        />
                        <div
                          style={{
                            fontSize: 12,
                            marginTop: 6,
                            color: editForm.metaTitle.length > 60 ? '#dc2626' : 'var(--sc-text-muted)',
                          }}
                        >
                          {editForm.metaTitle.length}/60
                        </div>
                      </div>

                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--sc-text)' }}>Meta Description</label>
                          <button
                            onClick={async (e) => {
                              e.stopPropagation()
                              const suggestion = await fetchSuggestionFn()
                              if (suggestion) {
                                setEditForm(prev => {
                                  doRecalcFn(prev.metaTitle, suggestion.description)
                                  return { ...prev, metaDescription: suggestion.description }
                                })
                                showToast(`Description: ${suggestion.description.length} chars`)
                              }
                            }}
                            style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px', borderRadius: 4 }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                          >
                            Auto-generate
                          </button>
                        </div>
                        <textarea
                          value={editForm.metaDescription}
                          onChange={e => setEditForm({ ...editForm, metaDescription: e.target.value })}
                          style={{
                            ...inputFieldStyle,
                            minHeight: 100,
                            resize: 'vertical',
                            fontFamily: '"Manrope", sans-serif',
                          }}
                          placeholder="Brief description for search results"
                          maxLength={150}
                        />
                        <div
                          style={{
                            fontSize: 12,
                            marginTop: 6,
                            color: editForm.metaDescription.length > 150 ? '#dc2626' : 'var(--sc-text-muted)',
                          }}
                        >
                          {editForm.metaDescription.length}/150
                        </div>
                      </div>

                      {/* OG Image Upload */}
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--sc-text)' }}>OG Image</label>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          {editForm.ogImagePreview ? (
                            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--sc-border)', flexShrink: 0 }}>
                              <img
                                src={editForm.ogImagePreview}
                                alt="OG Image"
                                style={{ width: 160, height: 84, objectFit: 'cover', display: 'block' }}
                              />
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditForm(prev => ({ ...prev, ogImageId: null, ogImagePreview: null, ogImageAlt: '' })) }}
                                style={{
                                  position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 6,
                                  background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <label style={{
                              width: 160, height: 84, borderRadius: 10, border: '2px dashed var(--sc-border)',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              cursor: uploadLoading ? 'wait' : 'pointer', transition: 'all 180ms ease',
                              background: 'var(--sc-surface)', flexShrink: 0,
                            }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.background = 'var(--sc-red-soft)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--sc-border)'; e.currentTarget.style.background = 'var(--sc-surface)' }}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                                disabled={uploadLoading}
                              />
                              {uploadLoading ? (
                                <div style={{ width: 20, height: 20, border: '2px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                              ) : (
                                <>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sc-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                                  <span style={{ fontSize: 11, color: 'var(--sc-text-muted)', marginTop: 4 }}>Upload image</span>
                                </>
                              )}
                            </label>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', lineHeight: 1.5, marginBottom: 8 }}>
                              Recommended: 1200×630px
                            </div>
                            {editForm.ogImageId && (
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--sc-text-muted)', display: 'block', marginBottom: 4 }}>Image Alt Text</label>
                                <input
                                  type="text"
                                  value={editForm.ogImageAlt}
                                  onChange={e => setEditForm(prev => ({ ...prev, ogImageAlt: e.target.value }))}
                                  placeholder="Describe this image for accessibility & SEO"
                                  style={{
                                    width: '100%',
                                    padding: '7px 10px',
                                    borderRadius: 8,
                                    border: '1px solid var(--sc-border)',
                                    background: 'var(--sc-surface-2)',
                                    color: 'var(--sc-text)',
                                    fontSize: 13,
                                    transition: 'all 180ms ease',
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Preview + Checks */}
                    <div>
                      {/* SEO Checks */}
                      {(liveChecks || item.checks) && (liveChecks || item.checks)!.length > 0 && (() => {
                        const activeChecks = liveChecks || item.checks || []

                        const fixTitle = async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          showToast('Generating smart title...')
                          const suggestion = await fetchSuggestionFn()
                          if (!suggestion) { showToast('Failed to generate', 'error'); return }
                          setEditForm(prev => {
                            doRecalcFn(suggestion.title, prev.metaDescription)
                            return { ...prev, metaTitle: suggestion.title }
                          })
                          showToast(`Title: "${suggestion.title.substring(0, 40)}..."`)
                        }

                        const fixDesc = async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          showToast('Generating smart description...')
                          const suggestion = await fetchSuggestionFn()
                          if (!suggestion) { showToast('Failed to generate', 'error'); return }
                          const sentences = suggestion.description.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 5)
                          let desc = ''
                          for (const s of sentences) {
                            const next = desc ? desc + ' ' + s.trim() : s.trim()
                            if (next.length > 150) break
                            desc = next
                          }
                          if (!desc.endsWith('.') && !desc.endsWith('!') && !desc.endsWith('?')) desc += '.'
                          setEditForm(prev => {
                            doRecalcFn(prev.metaTitle, desc)
                            return { ...prev, metaDescription: desc }
                          })
                          showToast(`Description: ${desc.length} chars`)
                        }

                        const fixAll = async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          showToast('Analyzing content & generating suggestions...')
                          const suggestion = await fetchSuggestionFn()
                          if (!suggestion) { showToast('Failed to generate', 'error'); return }
                          // Build description from complete sentences (120-150 chars)
                          const sentences = suggestion.description.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 5)
                          let desc = ''
                          for (const s of sentences) {
                            const next = desc ? desc + ' ' + s.trim() : s.trim()
                            if (next.length > 150) break
                            desc = next
                          }
                          if (!desc.endsWith('.') && !desc.endsWith('!') && !desc.endsWith('?')) desc += '.'
                          doRecalcFn(suggestion.title, desc)
                          setEditForm(prev => ({ ...prev, metaTitle: suggestion.title, metaDescription: desc }))
                          showToast(`Title + description applied (${desc.length} chars)`)
                        }

                        const fixDescLength = async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          const current = editForm.metaDescription
                          if (current.length >= 120 && current.length <= 150) { showToast('Already optimal'); return }
                          showToast('Generating optimal description (120-150 chars)...')
                          const suggestion = await fetchSuggestionFn()
                          if (!suggestion) { showToast('Failed to generate', 'error'); return }

                          const buildDesc = (raw: string): string => {
                            const sentences = raw.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 5)
                            // Build from complete sentences until 120-160
                            let result = ''
                            for (const s of sentences) {
                              const next = result ? result + ' ' + s.trim() : s.trim()
                              if (next.length > 150) break
                              result = next
                            }
                            // If still short, pad with content sentences
                            if (result.length < 120) {
                              const content = item.sourceContent || ''
                              const contentSentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20 && !result.includes(s.trim()))
                              for (const s of contentSentences) {
                                const next = result.replace(/\.$/, '') + '. ' + s.trim()
                                if (next.length > 150) break
                                result = next
                                if (result.length >= 120) break
                              }
                            }
                            if (!result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) result += '.'
                            return result
                          }

                          let desc = buildDesc(suggestion.description)
                          // Fallback: use current + extend
                          if (desc.length < 120 && current.length > 0) desc = buildDesc(current)
                          setEditForm(prev => {
                            doRecalcFn(prev.metaTitle, desc)
                            return { ...prev, metaDescription: desc }
                          })
                          showToast(`Description: ${desc.length} chars`)
                        }

                        const fixTopicIndicator = async (e: React.MouseEvent) => {
                          e.stopPropagation()
                          const title = editForm.metaTitle
                          const hasKw = TOPIC_KW.some(k => title.toLowerCase().includes(k))
                          if (hasKw) { showToast('Already has topic keyword'); return }
                          showToast('Adding topic keyword to title...')
                          const suggestion = await fetchSuggestionFn()
                          if (suggestion) {
                            setEditForm(prev => {
                              doRecalcFn(suggestion.title, prev.metaDescription)
                              return { ...prev, metaTitle: suggestion.title }
                            })
                            showToast('Title updated with topic keyword')
                          } else { showToast('Failed to generate', 'error') }
                        }

                        const openPayloadEditor = (e: React.MouseEvent) => {
                          e.stopPropagation()
                          const editUrl = `/admin/collections/${item.collection}/${item.id}`
                          window.open(editUrl, '_blank')
                        }

                        const fixMap: Record<string, (e: React.MouseEvent) => void> = {
                          'Title Length': fixTitle,
                          'Title Unique': fixTitle,
                          'Title Natural': fixTitle,
                          'Desc Length': fixDescLength,
                          'Desc Natural': fixDesc,
                          'Topic Indicator': fixTopicIndicator,
                          'Opening Definition': openPayloadEditor,
                          'Citability Blocks': openPayloadEditor,
                          'Content Depth': openPayloadEditor,
                          'E-E-A-T: Author': openPayloadEditor,
                          'E-E-A-T: Excerpt': openPayloadEditor,
                          'E-E-A-T: Date': openPayloadEditor,
                        }

                        // Guidance now comes from SEO_GUIDANCE imported from seo-guidance.ts

                        return (
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--sc-text)' }}>
                                SEO Health Checks
                                <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 800, fontFamily: 'var(--font-mono)', color: getScoreColor(activeChecks.reduce((s, c) => s + c.score, 0)) }}>
                                  {activeChecks.reduce((s, c) => s + c.score, 0)}/100
                                </span>
                              </label>
                              {activeChecks.some(c => c.status !== 'green' && fixMap[c.name]) && (
                                <button
                                  onClick={fixAll}
                                  style={{ padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, border: '1px solid rgba(5,150,105,0.3)', background: 'rgba(5,150,105,0.1)', color: '#34d399', cursor: 'pointer' }}
                                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.25)' }}
                                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.1)' }}
                                >
                                  Fix All Issues
                                </button>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {(['high', 'medium', 'geo', 'info'] as const).map(tier => {
                                const tierChecks = activeChecks.filter(c => (c.tier || 'high') === tier)
                                if (tierChecks.length === 0) return null
                                const tierLabels: Record<string, string> = { high: 'TECHNICAL', medium: 'CTR & TRUST', geo: 'GEO / AI SEARCH', info: 'INFORMATIONAL' }
                                const tierColors: Record<string, string> = { high: '#dc2626', medium: '#d97706', geo: '#8b5cf6', info: '#3b82f6' }
                                return (
                                  <React.Fragment key={tier}>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: tierColors[tier], textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 4px 2px', opacity: 0.8 }}>
                                      {tierLabels[tier]} ({tierChecks.reduce((s,c) => s + c.score, 0)}/{tierChecks.reduce((s,c) => s + c.max, 0)})
                                    </div>
                                    {tierChecks.map((check, ci) => {
                                      const handler = check.status !== 'green' ? fixMap[check.name] : undefined
                                      return (
                                        <React.Fragment key={ci}>
                                        <div style={{
                                          display: 'flex', alignItems: 'center', gap: 10, padding: '7px 12px',
                                          borderRadius: 8, fontSize: 12,
                                          background: check.status === 'green' ? 'rgba(5,150,105,0.06)' : check.status === 'amber' ? 'rgba(217,119,6,0.06)' : 'rgba(220,38,38,0.06)',
                                          border: `1px solid ${check.status === 'green' ? 'rgba(5,150,105,0.15)' : check.status === 'amber' ? 'rgba(217,119,6,0.15)' : 'rgba(220,38,38,0.15)'}`,
                                        }}>
                                          <div style={{
                                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                            background: check.status === 'green' ? '#059669' : check.status === 'amber' ? '#d97706' : '#dc2626',
                                            boxShadow: `0 0 6px ${check.status === 'green' ? 'rgba(5,150,105,0.4)' : check.status === 'amber' ? 'rgba(217,119,6,0.4)' : 'rgba(220,38,38,0.4)'}`,
                                          }} />
                                          <span style={{ fontWeight: 600, color: 'var(--sc-text)', minWidth: 100 }}>{check.name}</span>
                                          <span style={{ color: 'var(--sc-text-muted)', flex: 1, fontSize: 11 }}>{check.tip}</span>
                                          {handler && (() => {
                                            const isEdit = handler === openPayloadEditor
                                            const btnColor = isEdit ? '59,130,246' : '5,150,105'
                                            return (
                                              <button
                                                onClick={handler}
                                                style={{
                                                  padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                                                  border: `1px solid rgba(${btnColor},0.3)`, background: `rgba(${btnColor},0.1)`,
                                                  color: isEdit ? '#60a5fa' : '#34d399', cursor: 'pointer', transition: 'all 150ms',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = `rgba(${btnColor},0.25)` }}
                                                onMouseLeave={e => { e.currentTarget.style.background = `rgba(${btnColor},0.1)` }}
                                              >
                                                {isEdit ? 'Edit' : 'Fix'}
                                              </button>
                                            )
                                          })()}
                                          <span style={{
                                            fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: 11,
                                            color: check.status === 'green' ? '#059669' : check.status === 'amber' ? '#d97706' : '#dc2626',
                                          }}>{check.score}/{check.max}</span>
                                        </div>
                                        {check.status !== 'green' && SEO_GUIDANCE[check.name] && (() => {
                                          const g = SEO_GUIDANCE[check.name]
                                          return (
                                            <div style={{
                                              marginLeft: 18, marginBottom: 6, padding: '10px 14px',
                                              borderRadius: 8, background: 'rgba(139,92,246,0.05)',
                                              border: '1px solid rgba(139,92,246,0.12)',
                                              fontSize: 11, lineHeight: 1.6,
                                            }}>
                                              <div style={{ color: '#c4b5fd', fontWeight: 700, marginBottom: 4 }}>{g.what}</div>
                                              <div style={{ color: '#a1a1aa', marginBottom: 6 }}>
                                                <strong style={{ color: '#d97706' }}>Why it matters:</strong> {g.why}
                                              </div>
                                              <div style={{ color: '#a1a1aa', marginBottom: 6, whiteSpace: 'pre-line' }}>
                                                <strong style={{ color: '#34d399' }}>How to fix:</strong> {g.fix}
                                              </div>
                                              <div style={{ display: 'flex', gap: 12 }}>
                                                <div style={{ flex: 1, padding: '6px 8px', borderRadius: 4, background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.15)' }}>
                                                  <div style={{ fontSize: 9, fontWeight: 700, color: '#059669', marginBottom: 2 }}>GOOD EXAMPLE</div>
                                                  <div style={{ color: '#a1a1aa', fontSize: 10 }}>{g.good}</div>
                                                </div>
                                                <div style={{ flex: 1, padding: '6px 8px', borderRadius: 4, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                                                  <div style={{ fontSize: 9, fontWeight: 700, color: '#dc2626', marginBottom: 2 }}>BAD EXAMPLE</div>
                                                  <div style={{ color: '#a1a1aa', fontSize: 10 }}>{g.bad}</div>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        })()}
                                        </React.Fragment>
                                      )
                                    })}
                                  </React.Fragment>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })()}

                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--sc-text)' }}>Google Search Preview</label>
                      <div style={googlePreviewStyle}>
                        <div style={googleUrlStyle}>smartcounter.id/{localeFilter}/{item.collection === 'blog-posts' ? 'blog' : item.collection}/{item.slug || '...'}</div>
                        <div style={googleTitleStyle}>{editForm.metaTitle || 'Your page title will appear here'}</div>
                        <div style={googleDescStyle}>{editForm.metaDescription || 'Your page description will appear here...'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Citability + History + Competitor */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <CitabilityAnalysis sourceContent={item.sourceContent || null} />
                    <ScoreTrendDetail snapshots={snapshots[`${item.collection}-${item.id}`] || []} />
                  </div>
                  <CompetitorComparison
                    yourUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/${localeFilter}/${item.collection === 'blog-posts' ? 'blog' : item.collection === 'features' ? 'features' : 'use-cases'}/${item.slug}`}
                  />

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setExpandedId(null)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: 10,
                        border: '1px solid var(--sc-border)',
                        background: 'transparent',
                        color: 'var(--sc-text-secondary)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 180ms ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--sc-surface)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--sc-text)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--sc-text-secondary)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={saveLoading}
                      style={{
                        ...buttonStyle,
                        opacity: saveLoading ? 0.6 : 1,
                        cursor: saveLoading ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={e => {
                        if (!saveLoading) {
                          (e.currentTarget as HTMLButtonElement).style.background = 'var(--sc-red-hover)'
                          ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(220,38,38,0.3)'
                        }
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--sc-red)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
                      }}
                    >
                      {saveLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
                )
              })()}
            </div>
          )
        })
      )}
    </div>
  )
}
