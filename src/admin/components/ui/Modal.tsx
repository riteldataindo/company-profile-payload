'use client'

import React, { useEffect } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  onSave?: () => void
  saveLabel?: string
  children: React.ReactNode
  width?: number
}

export function Modal({ title, onClose, onSave, saveLabel, children, width = 520 }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        animation: 'overlay-in 0.15s ease',
      }}
    >
      <div
        style={{
          width,
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: '70vh',
          background: 'var(--sc-surface)',
          border: '1px solid var(--sc-border-hover)',
          borderRadius: 16,
          boxShadow: 'var(--sc-shadow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scale-in 0.15s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--sc-border)',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              color: 'var(--sc-text-muted)',
              padding: 4,
              borderRadius: 6,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {children}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '12px 20px',
            borderTop: '1px solid var(--sc-border)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid var(--sc-border)',
              fontSize: 13,
              fontWeight: 600,
              background: 'var(--sc-surface)',
              color: 'var(--sc-text)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          {onSave && (
            <button
              onClick={onSave}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: 'var(--sc-red)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(220,38,38,0.25)',
              }}
            >
              {saveLabel || 'Save'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
