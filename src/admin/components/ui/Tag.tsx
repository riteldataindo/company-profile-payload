'use client'

import React from 'react'

type TagVariant = 'green' | 'red' | 'amber' | 'muted' | 'blue' | 'white'

interface TagProps {
  label: string
  variant?: TagVariant
}

const variantStyles: Record<TagVariant, { color: string; background: string }> = {
  green: { color: 'var(--sc-green)', background: 'var(--sc-green-soft)' },
  red: { color: 'var(--sc-red)', background: 'var(--sc-red-soft)' },
  amber: { color: 'var(--sc-amber)', background: 'var(--sc-amber-soft)' },
  muted: { color: 'var(--sc-text-muted)', background: 'var(--sc-surface-2)' },
  blue: { color: 'var(--sc-blue)', background: 'var(--sc-blue-soft)' },
  white: { color: '#fff', background: 'var(--sc-red)' },
}

export function Tag({ label, variant = 'muted' }: TagProps) {
  const s = variantStyles[variant]
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        color: s.color,
        background: s.background,
        borderRadius: 20,
        padding: '3px 10px',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        lineHeight: '16px',
        display: 'inline-block',
      }}
    >
      {label}
    </span>
  )
}
