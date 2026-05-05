'use client'

import React, { useState, useEffect } from 'react'

interface Post {
  id: string
  title: string
  status: string
  excerpt?: string
  category?: { name: string } | null
  author?: { name: string } | null
  publishedAt?: string
  readingTime?: number
  updatedAt: string
}

function HoverActions({ editHref }: { editHref: string }) {
  return (
    <div className="sc-act-hide" style={{ display: 'flex', gap: 2 }}>
      <a href={editHref} onClick={e => e.stopPropagation()} title="Edit" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sc-text-muted)', textDecoration: 'none', transition: 'all 150ms ease' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-2)'; e.currentTarget.style.color = 'var(--sc-text)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sc-text-muted)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      </a>
      <button onClick={e => { e.stopPropagation(); e.preventDefault() }} title="Delete" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sc-text-muted)', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'all 150ms ease' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#dc2626' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sc-text-muted)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  )
}

const CAT_COLORS: Record<string, string> = {
  'Retail Analytics': '#2563eb', Compliance: '#d97706', Features: '#059669',
  Technical: '#7c3aed', Analytics: '#2563eb', 'Use Cases': '#059669',
  'Industry Insights': '#dc2626',
}

function Tag({ label, variant }: { label: string; variant: string }) {
  const map: Record<string, { c: string; bg: string }> = {
    green: { c: '#059669', bg: 'rgba(5,150,105,0.1)' },
    blue: { c: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
    muted: { c: 'var(--sc-text-muted)', bg: 'var(--sc-surface-2)' },
  }
  const s = map[variant] || map.muted
  return <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "var(--font-mono)", color: s.c, background: s.bg, borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{label}</span>
}

function formatDate(d?: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function PostsView() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cards' | 'list'>('cards')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/blog-posts?limit=50&sort=-updatedAt&depth=1')
      .then(r => r.json())
      .then(d => setPosts(d.docs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = posts.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
    (p.category as any)?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.6s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4px 0 48px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>Blog Posts</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', marginTop: 4, margin: 0 }}>Articles published on the blog. Supports SEO and multi-language.</p>
        </div>
        <a href="/admin/collections/blog-posts/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
          New post
        </a>
      </div>

      {/* Search + View Toggle */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, padding: '8px 14px', borderRadius: 10, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', transition: 'all 180ms ease' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sc-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input style={{ flex: 1, fontSize: 14, minHeight: 24, background: 'transparent', border: 'none', outline: 'none', color: 'var(--sc-text)', fontFamily: 'var(--font-sans)' }} placeholder="Search by title or category..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', border: '1px solid var(--sc-border)', borderRadius: 10, overflow: 'hidden' }}>
          {(['cards', 'list'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '7px 12px', background: view === v ? 'var(--sc-surface-2)' : 'transparent', color: view === v ? 'var(--sc-text)' : 'var(--sc-text-muted)', border: 'none', cursor: 'pointer', transition: 'all 150ms ease', borderRight: v === 'cards' ? '1px solid var(--sc-border)' : 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {v === 'cards' ? <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></> : <><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/></>}
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Cards View */}
      {view === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {filtered.map(post => {
            const catName = (post.category as any)?.name || 'Uncategorized'
            const catColor = CAT_COLORS[catName] || '#2563eb'
            return (
              <div key={post.id} onClick={() => window.location.href = `/admin/collections/blog-posts/${post.id}`} style={{ borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)', cursor: 'pointer', color: 'inherit', transition: 'all 180ms ease', display: 'block' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--sc-border-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--sc-border)' }}
              >
                <div style={{ height: 3, background: catColor }} />
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag label={catName} variant="blue" />
                      <Tag label={post.status} variant={post.status === 'published' ? 'green' : 'muted'} />
                    </div>
                    <HoverActions editHref={`/admin/collections/blog-posts/${post.id}`} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 6, letterSpacing: '-0.01em', margin: '0 0 6px' }}>{post.title}</h3>
                  {post.excerpt && <p style={{ fontSize: 13, color: 'var(--sc-text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>{post.excerpt}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--sc-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(220,38,38,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontSize: 8, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                        {((post.author as any)?.name || 'A').split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--sc-text-muted)' }}>{(post.author as any)?.name || 'Unknown'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {post.readingTime && <span>{post.readingTime} min read</span>}
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span>{formatDate(post.publishedAt || post.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 130px 120px', padding: '12px 20px', borderBottom: '1px solid var(--sc-border)', gap: 12 }}>
            {['Title', 'Status', 'Category', 'Published'].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--sc-text-muted)' }}>{h}</span>
            ))}
          </div>
          {filtered.map((post, i) => (
            <a key={post.id} href={`/admin/collections/blog-posts/${post.id}`} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 130px 120px', padding: '10px 20px', borderBottom: i < filtered.length - 1 ? '1px solid var(--sc-border)' : 'none', gap: 12, alignItems: 'center', cursor: 'pointer', transition: 'all 180ms ease', background: i % 2 === 1 ? 'var(--sc-surface-2)' : 'transparent', textDecoration: 'none', color: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 1 ? 'var(--sc-surface-2)' : 'transparent' }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
              <Tag label={post.status} variant={post.status === 'published' ? 'green' : 'muted'} />
              <span style={{ fontSize: 13, color: 'var(--sc-text-secondary)' }}>{(post.category as any)?.name || '—'}</span>
              <span style={{ fontSize: 13, color: 'var(--sc-text-muted)', fontFamily: 'var(--font-mono)' }}>{formatDate(post.publishedAt || post.updatedAt)}</span>
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: 'var(--sc-text-muted)', fontSize: 14 }}>No posts match your search.</div>}
    </div>
  )
}
