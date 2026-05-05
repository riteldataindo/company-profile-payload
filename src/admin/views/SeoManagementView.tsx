'use client'

import React, { useState, useEffect } from 'react'

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
  sourceContent?: string
  url?: string
}

interface EditFormData {
  metaTitle: string
  metaDescription: string
  ogImageId: string | null
  ogImagePreview: string | null
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
  let score = 0

  if (item.meta?.title) {
    const len = item.meta.title.length
    if (len >= 30 && len <= 60) score += 30
    else if (len > 0 && len < 30) score += 15
    else if (len > 60) score += 20
  }

  if (item.meta?.description) {
    const len = item.meta.description.length
    if (len >= 100 && len <= 160) score += 40
    else if (len > 0 && len < 100) score += 20
    else if (len > 160) score += 25
  }

  if (item.meta?.imageId) score += 30

  return score
}

export default function SeoManagementView() {
  const [items, setItems] = useState<SeoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'blog' | 'feature' | 'useCase'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'complete' | 'missing'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditFormData>({ metaTitle: '', metaDescription: '', ogImageId: null, ogImagePreview: null })
  const [autoFixLoading, setAutoFixLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
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
  }, [typeFilter, statusFilter, searchTerm])

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
        body: JSON.stringify({ action: 'auto-fix-all' }),
      })
      if (!res1.ok) throw new Error('Auto-fix meta failed')

      const res2 = await fetch('/api/seo-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'use-content-images' }),
      })
      if (!res2.ok) throw new Error('Auto-fix images failed')

      const refreshRes = await fetch(`/api/seo-items?type=${typeFilter !== 'all' ? typeFilter : ''}`)
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        setItems(data.items || [])
      }
      setError('')
    } catch (err) {
      setError('Auto-fix failed. Please try again.')
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
          meta: metaPayload,
        }),
      })

      if (!res.ok) throw new Error('Save failed')

      setItems(items.map(i =>
        getItemUid(i) === expandedId
          ? {
              ...i,
              meta: {
                ...i.meta,
                title: editForm.metaTitle,
                description: editForm.metaDescription,
                imageId: editForm.ogImageId || null,
              },
            }
          : i
      ))

      setExpandedId(null)
      setError('')
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setSaveLoading(false)
    }
  }

  const getItemUid = (item: SeoItem) => `${item.collection}-${item.id}`

  const handleRowClick = (item: SeoItem) => {
    const uid = getItemUid(item)
    if (expandedId === uid) {
      setExpandedId(null)
      return
    }
    setExpandedId(uid)
    setEditForm({
      metaTitle: item.meta?.title || '',
      metaDescription: item.meta?.description || '',
      ogImageId: item.meta?.imageId || null,
      ogImagePreview: item.meta?.imageId ? `/api/media/${item.meta?.imageId}/file` : null,
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

      setEditForm(prev => ({
        ...prev,
        ogImageId: data.doc?.id?.toString() || null,
        ogImagePreview: data.doc?.url || `/api/media/file/${data.doc?.filename}`,
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
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '4px 0 48px' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>SEO Management</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Manage SEO across all content</p>
        </div>
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
          {autoFixLoading ? '⏳ Auto-fixing...' : '✨ Auto-fix All'}
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderBottom: '1px solid var(--sc-border)', flexWrap: 'wrap' }}>
        <div style={statCardStyle}>
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
      </div>

      {/* Filter Bar */}
      <div style={filterRowStyle}>
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

      {/* Error Message */}
      {error && (
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
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'ellipsis', overflow: 'hidden' }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--sc-text-muted)' }}>{item.url || `/${item.collection}/${item.id}`}</div>
                </div>
                <div style={{ ...badgeStyle(item.collection) }}>{collectionLabels[item.collection]}</div>
                <div style={{ textAlign: 'center', ...statusBadgeStyle(hasMeta) }}>{hasMeta ? '✓' : '✗'}</div>
                <div style={{ textAlign: 'center', ...statusBadgeStyle(hasOg) }}>{hasOg ? '✓' : '✗'}</div>
                <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: getScoreColor(score) }}>{score}%</div>
              </div>

              {/* Expanded Editor */}
              {isExpanded && (
                <div onClick={(e) => e.stopPropagation()} style={{ padding: '20px 24px', borderBottom: '1px solid var(--sc-border)', background: 'var(--sc-surface-2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
                    {/* Left Column - Inputs */}
                    <div>
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--sc-text)' }}>Meta Title</label>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const typeKeywords: Record<string, string> = {
                                'features': 'AI People Counting & CCTV Analytics',
                                'blog-posts': 'People Counting & Visitor Analytics',
                                'use-cases': 'CCTV AI & Visitor Analytics',
                              }
                              const suffix = ` — ${typeKeywords[item.collection] || 'CCTV AI Analytics'}`
                              const maxTitleLen = 60 - suffix.length
                              const truncTitle = item.title.length > maxTitleLen
                                ? item.title.substring(0, item.title.lastIndexOf(' ', maxTitleLen)) || item.title.substring(0, maxTitleLen)
                                : item.title
                              setEditForm(prev => ({ ...prev, metaTitle: `${truncTitle}${suffix}` }))
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
                            onClick={(e) => {
                              e.stopPropagation()
                              const source = item.sourceContent || item.meta?.description || ''
                              const trimmed = source.length > 155 ? source.substring(0, source.lastIndexOf(' ', 155)) + '...' : source
                              setEditForm(prev => ({ ...prev, metaDescription: trimmed }))
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
                          maxLength={160}
                        />
                        <div
                          style={{
                            fontSize: 12,
                            marginTop: 6,
                            color: editForm.metaDescription.length > 160 ? '#dc2626' : 'var(--sc-text-muted)',
                          }}
                        >
                          {editForm.metaDescription.length}/160
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
                                onClick={(e) => { e.stopPropagation(); setEditForm(prev => ({ ...prev, ogImageId: null, ogImagePreview: null })) }}
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
                          <div style={{ fontSize: 12, color: 'var(--sc-text-muted)', lineHeight: 1.5 }}>
                            Recommended: 1200×630px<br />
                            Used when sharing on social media
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Preview */}
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--sc-text)' }}>Google Search Preview</label>
                      <div style={googlePreviewStyle}>
                        <div style={googleUrlStyle}>smartcounter.id/content/...</div>
                        <div style={googleTitleStyle}>{editForm.metaTitle || 'Your page title will appear here'}</div>
                        <div style={googleDescStyle}>{editForm.metaDescription || 'Your page description will appear here...'}</div>
                      </div>
                    </div>
                  </div>

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
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
