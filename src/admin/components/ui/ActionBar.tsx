'use client'

import React, { useState } from 'react'

interface ActionBtnProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  danger?: boolean
}

export function ActionBtn({ icon, label, onClick, danger }: ActionBtnProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 8,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 150ms ease',
        background: hovered ? (danger ? 'var(--sc-red-soft)' : 'var(--sc-surface-2)') : 'transparent',
        color: hovered ? (danger ? 'var(--sc-red)' : 'var(--sc-text)') : 'var(--sc-text-muted)',
      }}
    >
      {icon}
    </button>
  )
}

interface ActionBarProps {
  onEdit?: () => void
  onDelete?: () => void
  onMore?: () => void
  className?: string
}

export function ActionBar({ onEdit, onDelete, onMore, className }: ActionBarProps) {
  return (
    <div className={className} style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {onEdit && (
        <ActionBtn
          icon={<EditIcon />}
          label="Edit"
          onClick={onEdit}
        />
      )}
      {onDelete && (
        <ActionBtn
          icon={<TrashIcon />}
          label="Delete"
          onClick={onDelete}
          danger
        />
      )}
      {onMore && (
        <ActionBtn
          icon={<MoreIcon />}
          label="More"
          onClick={onMore}
        />
      )}
    </div>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  )
}
