import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import type { Payload, TypedUser } from 'payload'

type AdminRole = 'super_admin' | 'editor' | 'viewer'
type AdminCapability = 'read' | 'write'

type AuthorizedAdmin = {
  ok: true
  payload: Payload
  role: AdminRole
  user: TypedUser
}

type RejectedAdmin = {
  ok: false
  response: NextResponse
}

export type AdminAuthorization = AuthorizedAdmin | RejectedAdmin

/**
 * Authenticate custom admin routes against Payload's signed auth cookie.
 * Viewer accounts are intentionally read-only; editor and super_admin may mutate.
 */
export async function authorizeAdminRequest(
  request: Request,
  capability: AdminCapability = 'read',
): Promise<AdminAuthorization> {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: request.headers })

  if (!user || user.collection !== 'users') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Authentication required' },
        {
          status: 401,
          headers: { 'Cache-Control': 'no-store' },
        },
      ),
    }
  }

  const rawRole = (user as { role?: AdminRole | null }).role
  const role: AdminRole = rawRole === 'super_admin' || rawRole === 'editor' || rawRole === 'viewer'
    ? rawRole
    : 'viewer'

  if (capability === 'write' && role === 'viewer') {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Insufficient permissions' },
        {
          status: 403,
          headers: { 'Cache-Control': 'no-store' },
        },
      ),
    }
  }

  return { ok: true, payload, role, user }
}

export function privateAdminHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
  }
}
