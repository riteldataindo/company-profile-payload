import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const HISTORY_FILE = path.join(DATA_DIR, 'seo-history.json')
const MAX_SNAPSHOTS_PER_ITEM = 30

interface ScoreSnapshot {
  id: string
  title: string
  collection: string
  score: number
  breakdown: { technical: number; ctr: number; geo: number; info: number }
  timestamp: string
}

interface HistoryData {
  snapshots: ScoreSnapshot[]
  lastUpdated: string
}

function readHistory(): HistoryData {
  if (!existsSync(HISTORY_FILE)) return { snapshots: [], lastUpdated: '' }
  try {
    return JSON.parse(readFileSync(HISTORY_FILE, 'utf-8'))
  } catch {
    return { snapshots: [], lastUpdated: '' }
  }
}

function writeHistory(data: HistoryData) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = readHistory()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const items: { id: string; title: string; collection: string; score: number; checks?: any[] }[] = body.items || []

    if (items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const history = readHistory()

    for (const item of items) {
      const checks = item.checks || []
      const tierSum = (tier: string) => checks.filter((c: any) => c.tier === tier).reduce((s: number, c: any) => s + c.score, 0)

      const snapshot: ScoreSnapshot = {
        id: `${item.collection}-${item.id}`,
        title: item.title,
        collection: item.collection,
        score: item.score,
        breakdown: {
          technical: tierSum('high'),
          ctr: tierSum('medium'),
          geo: tierSum('geo'),
          info: tierSum('info'),
        },
        timestamp: now,
      }
      history.snapshots.push(snapshot)
    }

    // Keep only last MAX_SNAPSHOTS_PER_ITEM per item
    const grouped = new Map<string, ScoreSnapshot[]>()
    for (const s of history.snapshots) {
      const arr = grouped.get(s.id) || []
      arr.push(s)
      grouped.set(s.id, arr)
    }
    history.snapshots = []
    for (const [, arr] of grouped) {
      history.snapshots.push(...arr.slice(-MAX_SNAPSHOTS_PER_ITEM))
    }

    history.lastUpdated = now
    writeHistory(history)

    return NextResponse.json({
      message: `Snapshot saved for ${items.length} items`,
      totalSnapshots: history.snapshots.length,
      timestamp: now,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save snapshot', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}
