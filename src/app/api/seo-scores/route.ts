import { NextRequest, NextResponse } from 'next/server'
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth'

const MESSAGE = 'Checklist history is disabled because local filesystem snapshots are not durable in production.'

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, 'read')
  if (!authorization.ok) return authorization.response

  return NextResponse.json(
    {
      snapshots: [],
      lastUpdated: '',
      disabled: true,
      message: MESSAGE,
    },
    { headers: privateAdminHeaders() },
  )
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, 'write')
  if (!authorization.ok) return authorization.response

  return NextResponse.json(
    {
      error: 'Durable checklist history is not configured',
      message: MESSAGE,
    },
    {
      status: 501,
      headers: privateAdminHeaders(),
    },
  )
}
