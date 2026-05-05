'use client'

import React, { useState, useEffect } from 'react'

interface FaqItem { id: string; question: string; answer?: any; category?: string; isVisible?: boolean; sortOrder?: number }

function extractText(richText: any): string {
  if (!richText?.root?.children) return ''
  const extract = (nodes: any[]): string => nodes.map(n => n.text || (n.children ? extract(n.children) : '')).join('')
  return extract(richText.root.children)
}

export default function FaqView() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/faq-items?limit=50&sort=sortOrder&depth=0')
      .then(r => r.json())
      .then(d => setFaqs(d.docs || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: '80px 0', textAlign: 'center' }}><div style={{ width: 28, height: 28, border: '2.5px solid var(--sc-border)', borderTopColor: '#dc2626', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.6s linear infinite' }} /></div>

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '4px 0 48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>FAQs</h1>
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', margin: '4px 0 0' }}>Frequently asked questions grouped by category</p>
        </div>
        <a href="/admin/collections/faq-items/create" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'var(--sc-red)', color: '#fff', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 14px rgba(220,38,38,0.25)', textDecoration: 'none' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          Add FAQ
        </a>
      </div>

      {faqs.map(faq => (
        <div key={faq.id} style={{ borderRadius: 16, border: '1px solid var(--sc-border)', background: 'var(--sc-surface)', overflow: 'hidden', boxShadow: 'var(--sc-shadow)', marginBottom: 10, cursor: 'pointer' }}>
          <div onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}
            style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--sc-text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded === faq.id ? 'rotate(90deg)' : 'none', transition: 'transform 150ms ease', flexShrink: 0 }}>
                <path d="m9 18 6-6-6-6" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{faq.question}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {faq.category && <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#2563eb', background: 'rgba(37,99,235,0.1)', borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase' }}>{faq.category}</span>}
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)', color: faq.isVisible !== false ? '#059669' : 'var(--sc-text-muted)', background: faq.isVisible !== false ? 'rgba(5,150,105,0.1)' : 'var(--sc-surface-2)', borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase' }}>{faq.isVisible !== false ? 'visible' : 'hidden'}</span>
              <a href={`/admin/collections/faq-items/${faq.id}`} onClick={e => e.stopPropagation()} style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sc-text-muted)', transition: 'all 150ms ease', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--sc-surface-2)'; e.currentTarget.style.color = 'var(--sc-text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sc-text-muted)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </a>
            </div>
          </div>
          {expanded === faq.id && (
            <div style={{ padding: '0 20px 16px 46px', fontSize: 14, color: 'var(--sc-text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--sc-border)', paddingTop: 12 }}>
              {extractText(faq.answer) || 'No answer content'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
