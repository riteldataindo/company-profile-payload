import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: '#fff',
            fontFamily: "'Manrope', sans-serif",
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
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          <span style={{ color: '#DC2626' }}>Smart</span>
          <span style={{ color: 'var(--theme-text, #fafafa)' }}>Counter</span>
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: 'var(--color-base-400, #71717a)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Admin
        </span>
      </div>
    </div>
  )
}
