'use client'

import React, { useEffect, useState } from 'react'

interface Stats {
  posts: { total: number; published: number; draft: number }
  features: number; useCases: number; faqItems: number
  packages: number; locations: number; categories: number
  submissions: { total: number; unread: number }
}

interface AnalyticsData {
  stats: { sessions: number; pageViews: number; activeUsers: number; avgSessionDuration: number }
  weeklyTraffic: { date: string; pageViews: number; uniqueUsers: number }[]
  trafficSources: { source: string; sessions: number; percentage: number }[]
  topPages: { pagePath: string; pageTitle: string; views: number; changePercent: number }[]
  monthlyComparison: { thisMonth: number; lastMonth: number; changePercent: number }
}

interface SeoItem {
  label: string; value: string | number; status: 'green' | 'amber' | 'red'; detail: string
}

interface Post { id: string; title: string; status: string; updatedAt: string }
interface Sub { id: string; email: string; formType: string; status: string; createdAt: string }

function ago(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (m < 1) return 'now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function getDayName(dateStr: string): string {
  const d = new Date(dateStr)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
}

const panelStyle: React.CSSProperties = {
  borderRadius: 20, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)',
  boxShadow: 'var(--sc-shadow)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
}

const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '16px 24px', borderBottom: '1px solid var(--sc-border)',
  textDecoration: 'none', cursor: 'pointer', minHeight: 52, transition: 'background 180ms ease',
}

const rowBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 24px', textDecoration: 'none', cursor: 'pointer',
  borderBottom: '1px solid var(--sc-border)', minHeight: 52, transition: 'all 180ms ease', color: 'inherit',
}

function Chevron() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
}

function Tag({ label, variant }: { label: string; variant: 'green' | 'red' | 'amber' | 'muted' | 'white' }) {
  const map = {
    green: { color: '#059669', bg: 'rgba(5,150,105,0.08)' },
    red: { color: '#dc2626', bg: 'rgba(220,38,38,0.08)' },
    amber: { color: '#d97706', bg: 'rgba(217,119,6,0.08)' },
    muted: { color: 'var(--sc-text-muted)', bg: 'rgba(148,163,184,0.08)' },
    white: { color: '#fff', bg: '#dc2626' },
  }
  const s = map[variant]
  return <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: s.color, background: s.bg, borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
}

function StatCard({ label, value, sub, href, gradient }: {
  label: string; value: number | string; sub: string; href: string; gradient: string
}) {
  return (
    <a href={href} style={{
      ...panelStyle, textDecoration: 'none', cursor: 'pointer',
      transition: 'all 180ms ease', position: 'relative',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--sc-shadow), 0 0 0 1px var(--sc-border-hover)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--sc-shadow)' }}
    >
      <div style={{ height: 4, background: gradient, borderRadius: '20px 20px 0 0' }} />
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--sc-text-muted)', marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: 'var(--sc-text)', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--sc-text-secondary)', marginTop: 8 }}>{sub}</div>
      </div>
    </a>
  )
}

const SOURCE_COLORS: Record<string, string> = {
  'Organic Search': '#059669',
  'Direct': '#2563eb',
  'Referral': '#d97706',
  'Social': '#dc2626',
  'Organic Social': '#dc2626',
  'Paid Search': '#7c3aed',
  'Email': '#0891b2',
  'Unassigned': '#6b7280',
}

function TrafficChart({ data }: { data: AnalyticsData }) {
  const weekly = [...data.weeklyTraffic].sort((a, b) => a.date.localeCompare(b.date))
  const maxViews = Math.max(...weekly.map(d => d.pageViews), 1)
  const totalWeek = weekly.reduce((s, d) => s + d.pageViews, 0)
  const peakDay = weekly.reduce((a, b) => a.pageViews > b.pageViews ? a : b, weekly[0])

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--sc-border)' }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Website Traffic</span>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--sc-text-muted)', background: 'var(--sc-surface-2)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>Live from GA4</span>
      </div>
      <div style={{ padding: '16px 20px 8px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--sc-text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2563eb' }} /> Page Views
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--sc-text-muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: '#059669', opacity: 0.6 }} /> Unique Users
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140 }}>
          {weekly.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                <div title={`${d.pageViews} views`} style={{ flex: 1, height: Math.max((d.pageViews / maxViews) * 120, 4), background: '#2563eb', borderRadius: '3px 3px 0 0', opacity: 0.8 }} />
                <div title={`${d.uniqueUsers} users`} style={{ flex: 1, height: Math.max((d.uniqueUsers / maxViews) * 120, 4), background: '#059669', borderRadius: '3px 3px 0 0', opacity: 0.5 }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--sc-text-muted)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>{getDayName(d.date)}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 24, padding: '12px 20px 16px', borderTop: '1px solid var(--sc-border)' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontWeight: 500, marginBottom: 2 }}>This Week</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{formatNumber(totalWeek)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontWeight: 500, marginBottom: 2 }}>vs Last Month</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: data.monthlyComparison.changePercent >= 0 ? '#059669' : '#dc2626' }}>
            {data.monthlyComparison.changePercent >= 0 ? '+' : ''}{data.monthlyComparison.changePercent}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontWeight: 500, marginBottom: 2 }}>Peak Day</div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{peakDay ? getDayName(peakDay.date) : '—'}</div>
        </div>
      </div>
    </div>
  )
}

function TrafficSources({ sources }: { sources: AnalyticsData['trafficSources'] }) {
  const total = sources.reduce((s, src) => s + src.sessions, 0)
  const withPct = sources.map(s => ({ ...s, pct: total > 0 ? Math.round((s.sessions / total) * 100) : 0 }))

  return (
    <div style={panelStyle}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--sc-border)' }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Traffic Sources</span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
          {withPct.map((s, i) => (
            <div key={i} style={{ width: `${s.pct}%`, height: '100%', background: SOURCE_COLORS[s.source] || '#6b7280', opacity: 0.8 }} />
          ))}
        </div>
        {withPct.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < withPct.length - 1 ? '1px solid var(--sc-border)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: SOURCE_COLORS[s.source] || '#6b7280', opacity: 0.8 }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s.source}</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopPages({ pages }: { pages: AnalyticsData['topPages'] }) {
  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--sc-border)' }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Top Pages</span>
      </div>
      {pages.length === 0 ? (
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--sc-text-muted)', fontSize: 14 }}>No page data yet</div>
      ) : pages.map((p, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px', gap: 12, padding: '10px 20px', borderBottom: i < pages.length - 1 ? '1px solid var(--sc-border)' : 'none', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.pageTitle || p.pagePath}</div>
            <div style={{ fontSize: 11, color: 'var(--sc-text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{p.pagePath}</div>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right' }}>{formatNumber(p.views)}</span>
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', color: p.changePercent >= 0 ? '#059669' : '#dc2626' }}>
            {p.changePercent >= 0 ? '+' : ''}{p.changePercent}%
          </span>
        </div>
      ))}
    </div>
  )
}

function SeoHealth({ items }: { items: SeoItem[] }) {
  const passCount = items.filter(i => i.status === 'green').length
  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--sc-border)' }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>SEO Health</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag label={`${passCount}/${items.length} pass`} variant={passCount === items.length ? 'green' : passCount >= items.length / 2 ? 'amber' : 'red'} />
          <a href="/admin/seo-management" style={{ fontSize: 13, fontWeight: 600, color: '#dc2626', textDecoration: 'none' }}>Manage</a>
        </div>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 20px', borderBottom: i < items.length - 1 ? '1px solid var(--sc-border)' : 'none', cursor: 'pointer', transition: 'background 180ms ease' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.status === 'green' ? '#059669' : item.status === 'red' ? '#dc2626' : '#d97706', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: item.status === 'green' ? '#059669' : item.status === 'red' ? '#dc2626' : '#d97706' }}>{item.value}</span>
            <span style={{ fontSize: 11, color: 'var(--sc-text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardOverview() {
  const [s, setS] = useState<Stats | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [subs, setSubs] = useState<Sub[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [seoItems, setSeoItems] = useState<SeoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/blog-posts?limit=5&sort=-updatedAt').then(r => r.json()),
      fetch('/api/features?limit=0').then(r => r.json()),
      fetch('/api/use-cases?limit=0').then(r => r.json()),
      fetch('/api/faq-items?limit=0').then(r => r.json()),
      fetch('/api/pricing-tiers?limit=0').then(r => r.json()),
      fetch('/api/deployment-locations?limit=0').then(r => r.json()),
      fetch('/api/blog-categories?limit=0').then(r => r.json()),
      fetch('/api/form-submissions?limit=5&sort=-createdAt').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()).catch(() => null),
      fetch('/api/seo-health').then(r => r.json()).catch(() => null),
    ]).then(([p, f, u, q, t, l, c, sub, analyticsRes, seoRes]) => {
      setS({
        posts: { total: p.totalDocs || 0, published: p.docs?.filter((x: any) => x.status === 'published').length || 0, draft: p.docs?.filter((x: any) => x.status === 'draft').length || 0 },
        features: f.totalDocs || 0, useCases: u.totalDocs || 0, faqItems: q.totalDocs || 0,
        packages: t.totalDocs || 0, locations: l.totalDocs || 0, categories: c.totalDocs || 0,
        submissions: { total: sub.totalDocs || 0, unread: sub.docs?.filter((x: any) => x.status === 'new').length || 0 },
      })
      setPosts((p.docs || []).map((x: any) => ({ id: x.id, title: x.title, status: x.status, updatedAt: x.updatedAt })))
      setSubs((sub.docs || []).map((x: any) => ({ id: x.id, email: x.email, formType: x.formType, status: x.status, createdAt: x.createdAt })))
      if (analyticsRes && !analyticsRes.error) setAnalytics(analyticsRes)
      if (seoRes && !seoRes.error) setSeoItems(seoRes.items || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: '80px 0', textAlign: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.6s linear infinite' }} />
      <div style={{ color: 'var(--sc-text-muted)', fontSize: 14 }}>Loading dashboard...</div>
    </div>
  )

  return (
    <div style={{ padding: '4px 0 48px' }}>
      {/* Header */}
      <div className="sc-dash-header" style={{ marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--sc-text)', margin: 0, letterSpacing: '-0.04em' }}>Dashboard</h2>
          <p style={{ fontSize: 15, color: 'var(--sc-text-secondary)', marginTop: 4 }}>Manage your SmartCounter website</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 14, fontWeight: 600, color: 'var(--sc-text-secondary)',
            textDecoration: 'none', padding: '10px 18px', borderRadius: 12,
            border: '1px solid var(--sc-border)', background: 'var(--sc-surface)',
            boxShadow: 'var(--sc-shadow-sm)', cursor: 'pointer', transition: 'all 180ms ease', minHeight: 42,
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(220,38,38,0.2)'; e.currentTarget.style.color = '#dc2626' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--sc-border)'; e.currentTarget.style.color = 'var(--sc-text-secondary)' }}
          >
            Visit site
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
          </a>
          <a href="/admin/collections/blog-posts/create" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 14, fontWeight: 600, color: '#fff',
            textDecoration: 'none', padding: '10px 18px', borderRadius: 12,
            background: '#dc2626', cursor: 'pointer', minHeight: 42,
            boxShadow: '0 4px 14px rgba(220,38,38,0.25)', transition: 'all 180ms ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#b91c1c'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'none' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            New post
          </a>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="sc-grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Blog Posts" value={s?.posts.total || 0} sub={`${s?.posts.published} published · ${s?.posts.draft} draft`} href="/admin/collections/blog-posts" gradient="linear-gradient(90deg, #dc2626, #f43f5e, #fb923c)" />
        <StatCard label="Page Content" value={(s?.features || 0) + (s?.useCases || 0) + (s?.faqItems || 0)} sub={`${s?.features} features · ${s?.useCases} use cases · ${s?.faqItems} FAQs`} href="/admin/collections/features" gradient="linear-gradient(90deg, #0f172a, #334155, #64748b)" />
        <StatCard label="Website" value={`${s?.locations || 0} cities`} sub={`${s?.packages} packages · ${s?.categories} categories`} href="/admin/collections/deployment-locations" gradient="linear-gradient(90deg, #059669, #10b981, #34d399)" />
        <StatCard label="Inbox" value={s?.submissions.total || 0} sub={s?.submissions.unread ? `${s.submissions.unread} unread — needs attention` : 'All read'} href="/admin/collections/form-submissions" gradient={s?.submissions.unread ? 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)' : 'linear-gradient(90deg, #059669, #10b981, #34d399)'} />
      </div>

      {/* Analytics & SEO Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Analytics &amp; SEO</h2>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--sc-text-muted)', background: 'var(--sc-surface-2)', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>Last 30 days</span>
      </div>

      {analytics ? (
        <>
          <div className="sc-grid-4" style={{ marginBottom: 14 }}>
            <StatCard label="Total Visits" value={formatNumber(analytics.stats.sessions)} sub={`${analytics.monthlyComparison.changePercent >= 0 ? '+' : ''}${analytics.monthlyComparison.changePercent}% vs last month`} href="#" gradient="linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)" />
            <StatCard label="Page Views" value={formatNumber(analytics.stats.pageViews)} sub={`${analytics.stats.sessions > 0 ? (analytics.stats.pageViews / analytics.stats.sessions).toFixed(2) : '0'} pages/session`} href="#" gradient="linear-gradient(90deg, #7c3aed, #8b5cf6, #a78bfa)" />
            <StatCard label="Active Users" value={formatNumber(analytics.stats.activeUsers)} sub={`${formatDuration(analytics.stats.avgSessionDuration)} avg duration`} href="#" gradient="linear-gradient(90deg, #059669, #10b981, #34d399)" />
            <StatCard label="Avg. Duration" value={formatDuration(analytics.stats.avgSessionDuration)} sub={`${analytics.stats.activeUsers} active users`} href="#" gradient="linear-gradient(90deg, #d97706, #f59e0b, #fbbf24)" />
          </div>

          <div className="sc-grid-2" style={{ marginBottom: 14 }}>
            <TrafficChart data={analytics} />
            <TrafficSources sources={analytics.trafficSources} />
          </div>

          <div className="sc-grid-2" style={{ marginBottom: 14 }}>
            <TopPages pages={analytics.topPages} />
            <SeoHealth items={seoItems} />
          </div>
        </>
      ) : (
        <div style={{ ...panelStyle, padding: '40px 24px', textAlign: 'center', marginBottom: 14 }}>
          <div style={{ color: 'var(--sc-text-muted)', fontSize: 14 }}>Analytics not available — check GA4 connection</div>
        </div>
      )}

      {/* Content Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Content</h2>
      </div>

      <div className="sc-grid-2" style={{ marginBottom: 0 }}>
        {/* Recent Posts */}
        <div style={panelStyle}>
          <a href="/admin/collections/blog-posts" style={headerStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--sc-text)' }}>Recent Posts</span>
              {s?.posts.draft ? <Tag label={`${s.posts.draft} draft`} variant="amber" /> : null}
            </div>
            <span style={{ color: 'var(--sc-text-muted)' }}><Chevron /></span>
          </a>
          {posts.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--sc-text-muted)', fontSize: 14 }}>No posts yet</div>
          ) : posts.map(p => (
            <a key={p.id} href={`/admin/collections/blog-posts/${p.id}`} style={rowBase}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)'; e.currentTarget.style.paddingLeft = '28px' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.paddingLeft = '24px' }}
            >
              <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sc-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                <div style={{ fontSize: 13, color: 'var(--sc-text-muted)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{ago(p.updatedAt)}</div>
              </div>
              <Tag label={p.status} variant={p.status === 'published' ? 'green' : 'muted'} />
            </a>
          ))}
        </div>

        {/* Inbox */}
        <div style={panelStyle}>
          <a href="/admin/collections/form-submissions" style={headerStyle}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--sc-text)' }}>Inbox</span>
              {(s?.submissions.unread || 0) > 0 && <Tag label={`${s?.submissions.unread} new`} variant="white" />}
            </div>
            <span style={{ color: 'var(--sc-text-muted)' }}><Chevron /></span>
          </a>
          {subs.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--sc-text-muted)', fontSize: 14 }}>No submissions yet</div>
          ) : subs.map(sub => (
            <a key={sub.id} href={`/admin/collections/form-submissions/${sub.id}`}
              style={{ ...rowBase, background: sub.status === 'new' ? 'var(--sc-red-soft)' : 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-hover)'; e.currentTarget.style.paddingLeft = '28px' }}
              onMouseLeave={e => { e.currentTarget.style.background = sub.status === 'new' ? 'var(--sc-red-soft)' : 'transparent'; e.currentTarget.style.paddingLeft = '24px' }}
            >
              <div style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--sc-text)' }}>{sub.email}</div>
                <div style={{ fontSize: 13, color: 'var(--sc-text-muted)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{sub.formType === 'demo' ? 'Demo request' : 'Contact'} · {ago(sub.createdAt)}</div>
              </div>
              <Tag label={sub.status} variant={sub.status === 'new' ? 'red' : sub.status === 'replied' ? 'green' : 'muted'} />
            </a>
          ))}
        </div>
      </div>

      {/* Quick nav row */}
      <div className="sc-grid-4" style={{ marginTop: 14 }}>
        {[
          { label: 'Features', count: s?.features, href: '/admin/collections/features' },
          { label: 'Use Cases', count: s?.useCases, href: '/admin/collections/use-cases' },
          { label: 'FAQs', count: s?.faqItems, href: '/admin/collections/faq-items' },
          { label: 'Site Settings', href: '/admin/globals/site-settings' },
        ].map(item => (
          <a key={item.label} href={item.href} style={{
            ...panelStyle, textDecoration: 'none', cursor: 'pointer',
            padding: '16px 24px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            transition: 'all 180ms ease', minHeight: 52,
          } as React.CSSProperties}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sc-border-hover)'; e.currentTarget.style.background = 'var(--sc-surface-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--sc-border)'; e.currentTarget.style.background = 'var(--sc-surface)' }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--sc-text)' }}>{item.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.count !== undefined && <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--sc-text-secondary)' }}>{item.count}</span>}
              <span style={{ color: 'var(--sc-text-muted)' }}><Chevron /></span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
