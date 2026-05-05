'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  value?: string
  placeholder?: string
  type?: 'text' | 'textarea' | 'select' | 'email' | 'password' | 'date' | 'number'
  options?: string[]
  onChange?: (value: string) => void
  disabled?: boolean
}

const baseInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid var(--sc-border)',
  background: 'var(--sc-surface-2)',
  fontSize: 14,
  color: 'var(--sc-text)',
  transition: 'all 180ms ease',
  minHeight: 42,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
}

export function FormField({ label, value, placeholder, type = 'text', options, onChange, disabled }: FormFieldProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: 'block',
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 6,
          color: 'var(--sc-text-secondary)',
        }}
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          style={{ ...baseInputStyle, minHeight: 100, resize: 'vertical' }}
        />
      ) : type === 'select' ? (
        <select
          defaultValue={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          style={{ ...baseInputStyle, cursor: 'pointer' }}
        >
          {options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          style={baseInputStyle}
        />
      )}
    </div>
  )
}
