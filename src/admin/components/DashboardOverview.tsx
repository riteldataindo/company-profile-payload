'use client'

import React, { useEffect, useState } from 'react'

interface Stats {
  blogPosts: { total: number; published: number; draft: number }
  features: number
  submissions: { total: number; unread: number }
  lastUpdate: string
}

interface RecentItem {
  id: string
  title?: string
  email?: string
  formType?: string
  status?: string
  createdAt: string
  updatedAt?: string
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      style={{
        background: 'var(--theme-elevation-50)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '8px',
        padding: '20px',
      }}
    >
      <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--theme-text)', fontFamily: "'Fira Code', monospace" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginTop: '4px' }}>
          {sub}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    published: { bg: 'rgba(34, 197, 94, 0.12)', text: '#22c55e' },
    draft: { bg: 'var(--theme-elevation-100)', text: 'var(--theme-elevation-400)' },
    new: { bg: 'rgba(220, 38, 38, 0.12)', text: '#DC2626' },
    read: { bg: 'var(--theme-elevation-100)', text: 'var(--theme-elevation-400)' },
    replied: { bg: 'rgba(34, 197, 94, 0.12)', text: '#22c55e' },
  }
  const c = colors[status] || colors.draft
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        background: c.bg,
        color: c.text,
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  )
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentPosts, setRecentPosts] = useState<RecentItem[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, featuresRes, subsRes] = await Promise.all([
          fetch('/api/blog-posts?limit=5&sort=-createdAt'),
          fetch('/api/features?limit=0'),
          fetch('/api/form-submissions?limit=5&sort=-createdAt'),
        ])

        const posts = await postsRes.json()
        const features = await featuresRes.json()
        const subs = await subsRes.json()

        const published = posts.docs?.filter((p: any) => p.status === 'published').length || 0
        const draft = posts.docs?.filter((p: any) => p.status === 'draft').length || 0
        const unread = subs.docs?.filter((s: any) => s.status === 'new').length || 0

        setStats({
          blogPosts: { total: posts.totalDocs || 0, published, draft },
          features: features.totalDocs || 0,
          submissions: { total: subs.totalDocs || 0, unread },
          lastUpdate: posts.docs?.[0]?.updatedAt || new Date().toISOString(),
        })

        setRecentPosts(
          (posts.docs || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            status: p.status,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          })),
        )

        setRecentSubmissions(
          (subs.docs || []).map((s: any) => ({
            id: s.id,
            email: s.email,
            formType: s.formType,
            status: s.status,
            createdAt: s.createdAt,
          })),
        )
      } catch {
        // Payload API may not be ready yet
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const cardStyle: React.CSSProperties = {
    background: 'var(--theme-elevation-50)',
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: '8px',
    padding: '20px',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--theme-text)',
    marginBottom: '16px',
  }

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--theme-elevation-100)',
  }

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '12px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#DC2626',
    textDecoration: 'none',
  }

  const actionBtnStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 600,
    border: '1px solid var(--theme-elevation-150)',
    background: 'var(--theme-elevation-50)',
    color: 'var(--theme-text)',
    cursor: 'pointer',
    textDecoration: 'none',
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 0' }}>
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '14px' }}>Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 0', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--theme-text)', margin: 0 }}>
          Overview
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-400)', marginTop: '4px' }}>
          SmartCounter company profile admin panel
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <StatCard label="Blog Posts" value={stats?.blogPosts.total || 0} sub={`${stats?.blogPosts.published || 0} published · ${stats?.blogPosts.draft || 0} draft`} />
        <StatCard label="Features" value={stats?.features || 0} sub="visible on website" />
        <StatCard
          label="Form Submissions"
          value={stats?.submissions.total || 0}
          sub={stats?.submissions.unread ? `${stats.submissions.unread} unread` : 'all read'}
        />
        <StatCard label="Last Update" value={stats?.lastUpdate ? timeAgo(stats.lastUpdate) : '—'} sub="most recent content change" />
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Recent Posts */}
        <div style={cardStyle}>
          <div style={headingStyle}>Recent Blog Posts</div>
          {recentPosts.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--theme-elevation-400)' }}>No blog posts yet</div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} style={rowStyle}>
                <div>
                  <a
                    href={`/admin/collections/blog-posts/${post.id}`}
                    style={{ fontSize: '13px', fontWeight: 500, color: 'var(--theme-text)', textDecoration: 'none' }}
                  >
                    {post.title || 'Untitled'}
                  </a>
                  <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400)', marginTop: '2px' }}>
                    {timeAgo(post.createdAt)}
                  </div>
                </div>
                <StatusBadge status={post.status || 'draft'} />
              </div>
            ))
          )}
          <a href="/admin/collections/blog-posts" style={linkStyle}>View All Posts →</a>
        </div>

        {/* Recent Submissions */}
        <div style={cardStyle}>
          <div style={headingStyle}>Recent Form Submissions</div>
          {recentSubmissions.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--theme-elevation-400)' }}>No submissions yet</div>
          ) : (
            recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                style={{
                  ...rowStyle,
                  background: sub.status === 'new' ? 'rgba(220, 38, 38, 0.05)' : 'transparent',
                  padding: '10px 8px',
                  margin: '0 -8px',
                  borderRadius: '4px',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--theme-text)' }}>
                    {sub.email}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400)', marginTop: '2px' }}>
                    {sub.formType} · {timeAgo(sub.createdAt)}
                  </div>
                </div>
                <StatusBadge status={sub.status || 'new'} />
              </div>
            ))
          )}
          <a href="/admin/collections/form-submissions" style={linkStyle}>View All Submissions →</a>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={cardStyle}>
        <div style={headingStyle}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="/admin/collections/blog-posts/create" style={{ ...actionBtnStyle, background: '#DC2626', borderColor: '#DC2626', color: '#fff' }}>New Blog Post</a>
          <a href="/admin/globals/site-settings" style={actionBtnStyle}>Edit Site Settings</a>
          <a href="/admin/globals/homepage" style={actionBtnStyle}>Homepage Config</a>
          <a href="/admin/collections/features" style={actionBtnStyle}>Manage Features</a>
          <a href="/admin/collections/deployment-locations" style={actionBtnStyle}>Deployment Map</a>
        </div>
      </div>
    </div>
  )
}
