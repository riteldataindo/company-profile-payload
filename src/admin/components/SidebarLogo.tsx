'use client'

import React from 'react'

export default function SidebarLogo() {
  return (
    <a
      href="/admin"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 16px',
        borderBottom: '1px solid var(--sc-sidebar-border, rgba(255,255,255,0.04))',
        textDecoration: 'none',
        color: 'inherit',
        marginBottom: 4,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#fff',
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
            letterSpacing: '-0.02em',
          }}
        >
          SC
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            fontFamily: "var(--font-sans, 'Manrope', sans-serif)",
          }}
        >
          <span style={{ color: '#dc2626' }}>Smart</span>
          <span style={{ color: 'var(--sc-text, #fafafa)' }}>Counter</span>
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--sc-text-muted, #52525b)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
          }}
        >
          Admin
        </span>
      </div>
    </a>
  )
}
