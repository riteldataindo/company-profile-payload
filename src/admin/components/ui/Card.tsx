'use client'

import React, { useState } from 'react'

interface CardProps {
  children: React.ReactNode
  style?: React.CSSProperties
  hover?: boolean
  onClick?: () => void
  gradient?: string
  className?: string
}

export function Card({ children, style, hover, onClick, gradient, className }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const isHov = hovered && hover

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        border: '1px solid',
        borderColor: isHov ? 'var(--sc-border-hover)' : 'var(--sc-border)',
        background: 'var(--sc-surface)',
        overflow: 'hidden',
        boxShadow: isHov ? 'var(--sc-shadow), 0 0 0 1px var(--sc-border-hover)' : 'var(--sc-shadow)',
        transform: isHov ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {gradient && <div style={{ height: 3, background: gradient }} />}
      {children}
    </div>
  )
}
