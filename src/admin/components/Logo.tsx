import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          fontFamily: "'Fira Sans', sans-serif",
        }}
      >
        <span style={{ color: '#FF0000', fontVariant: 'small-caps' }}>SMART</span>
        <span style={{ color: 'var(--theme-text)' }}>Counter</span>
      </span>
      <span
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--theme-elevation-500)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Admin
      </span>
    </div>
  )
}
