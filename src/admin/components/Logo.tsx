import React from 'react'
import { SmartCounterLogo } from '@/components/brand/SmartCounterLogo'

export default function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <SmartCounterLogo style={{ width: 170, height: 'auto' }} priority />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
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
