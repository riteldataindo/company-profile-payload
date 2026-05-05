'use client'

import React from 'react'

interface PageHeaderProps {
  title: string
  desc?: string
  onCreate?: () => void
  createLabel?: string
}

export function PageHeader({ title, desc, onCreate, createLabel }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', margin: 0 }}>
          {title}
        </h1>
        {desc && (
          <p style={{ fontSize: 14, color: 'var(--sc-text-secondary)', marginTop: 4, margin: 0 }}>
            {desc}
          </p>
        )}
      </div>
      {onCreate && (
        <button
          onClick={onCreate}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '9px 16px',
            borderRadius: 10,
            background: 'var(--sc-red)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(220,38,38,0.25)',
            transition: 'all 180ms ease',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
          {createLabel || 'Create new'}
        </button>
      )}
    </div>
  )
}
