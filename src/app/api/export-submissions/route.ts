import { NextResponse } from 'next/server'
import { authorizeAdminRequest, privateAdminHeaders } from '@/lib/admin-auth'

export async function GET(request: Request) {
  try {
    const authorization = await authorizeAdminRequest(request, 'read')
    if (!authorization.ok) return authorization.response
    const { payload } = authorization

    const { docs } = await payload.find({
      collection: 'form-submissions',
      limit: 10000,
      sort: '-createdAt',
    })

    const headers = ['Created At', 'Form Type', 'Email', 'Status', 'Data']
    const rows = docs.map((doc: any) => [
      new Date(doc.createdAt).toISOString(),
      doc.formType || '',
      doc.email || '',
      doc.status || '',
      JSON.stringify(doc.data || {}),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell: string) => `"${cell.replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n')

    return new NextResponse(csv, {
      headers: {
        ...privateAdminHeaders(),
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="submissions-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
