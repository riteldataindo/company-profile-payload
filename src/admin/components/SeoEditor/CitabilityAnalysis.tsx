'use client'

import React from 'react'

interface CitableBlock {
  text: string
  wordCount: number
  status: 'green' | 'amber' | 'red'
}

function analyzeParagraphs(content: string): CitableBlock[] {
  if (!content || content.trim().length < 20) return []
  const paragraphs = content.split(/\n\n+|\r\n\r\n+/).filter(p => p.trim().length > 10)
  return paragraphs.map(p => {
    const trimmed = p.trim()
    const wordCount = trimmed.split(/\s+/).length
    const status: CitableBlock['status'] =
      wordCount >= 100 && wordCount <= 200 ? 'green' :
      wordCount >= 50 && wordCount <= 300 ? 'amber' : 'red'
    return { text: trimmed, wordCount, status }
  })
}

const statusColors = {
  green: { bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.3)', text: '#059669', label: 'Citable' },
  amber: { bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.3)', text: '#d97706', label: 'Adjust' },
  red: { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.3)', text: '#dc2626', label: 'Too Short' },
}

export function CitabilityAnalysis({ sourceContent }: { sourceContent: string | null }) {
  const blocks = analyzeParagraphs(sourceContent || '')

  if (blocks.length === 0) {
    return (
      <div style={{ padding: '16px', borderRadius: 10, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', fontSize: 13, color: '#a1a1aa' }}>
        No content available for citability analysis.
      </div>
    )
  }

  const citableCount = blocks.filter(b => b.status === 'green').length
  const totalWords = blocks.reduce((s, b) => s + b.wordCount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Content Citability Analysis
        </span>
        <span style={{ fontSize: 11, color: '#71717a' }}>
          {citableCount}/{blocks.length} passages citable · {totalWords} total words
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
        {blocks.map((_, i) => {
          const b = blocks[i]
          return (
            <div key={i} style={{
              flex: 1, height: 6, borderRadius: 3,
              background: statusColors[b.status].border,
              maxWidth: 40,
            }} title={`P${i + 1}: ${b.wordCount} words`} />
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 260, overflowY: 'auto' }}>
        {blocks.map((block, i) => {
          const sc = statusColors[block.status]
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px',
              borderRadius: 8, background: sc.bg, border: `1px solid ${sc.border}`,
              fontSize: 12,
            }}>
              <div style={{
                minWidth: 52, padding: '2px 6px', borderRadius: 4,
                background: sc.border, color: sc.text,
                fontSize: 10, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap',
              }}>
                {block.wordCount}w · {sc.label}
              </div>
              <div style={{ color: '#a1a1aa', lineHeight: 1.4, flex: 1 }}>
                {block.text.length > 150 ? block.text.substring(0, 150) + '…' : block.text}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ fontSize: 10, color: '#52525b', marginTop: 2, lineHeight: 1.4 }}>
        AI search (Google AIO, ChatGPT, Perplexity) cites passages of 100-200 words.
        Green = optimal for citation. Amber = consider splitting or merging. Red = too short to cite standalone.
      </div>
    </div>
  )
}
