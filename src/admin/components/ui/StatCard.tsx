'use client'

import React, { useState } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  gradient: string
  onClick?: () => void
}

export function StatCard({ label, value, sub, gradient, onClick }: StatCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        border: '1px solid',
        borderColor: hovered ? 'var(--sc-border-hover)' : 'var(--sc-border)',
        background: 'var(--sc-surface)',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined,
        position: 'relative',
        boxShadow: hovered ? 'var(--sc-shadow), 0 0 0 1px var(--sc-border-hover)' : 'var(--sc-shadow)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
      }}
    >
      <div style={{ height: 3, background: gradient }} />
      <div style={{ padding: '18px 22px' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--sc-text-muted)',
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--sc-text)',
          }}
        >
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 13, color: 'var(--sc-text-secondary)', marginTop: 8 }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )
}
