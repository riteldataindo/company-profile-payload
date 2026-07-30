'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

export default function SeoNavLink() {
  const pathname = usePathname()
  const isActive = pathname === '/admin/seo-management'

  return (
    <div style={{ padding: '0 16px' }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--theme-elevation-400)',
          padding: '12px 8px 4px',
        }}
      >
        SEO
      </div>
      <a
        href="/admin/seo-management"
        style={{
          display: 'block',
          padding: '6px 8px',
          fontSize: 13,
          color: isActive ? 'var(--theme-success-500)' : 'var(--theme-elevation-400)',
          fontWeight: isActive ? 600 : 400,
          textDecoration: 'none',
          borderRadius: 4,
          background: isActive ? 'var(--theme-success-50)' : 'transparent',
        }}
      >
        SEO Management
      </a>
    </div>
  )
}
