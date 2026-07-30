'use client'

import React from 'react'
import { SmartCounterLogo } from '@/components/brand/SmartCounterLogo'

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
      <SmartCounterLogo style={{ width: 150, height: 'auto' }} priority />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
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
