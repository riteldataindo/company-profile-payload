import type { Access, FieldAccess } from 'payload'

type Role = 'super_admin' | 'editor' | 'viewer'

function roleFromUser(user: unknown): Role | null {
  if (!user || typeof user !== 'object') return null
  const role = (user as { role?: unknown }).role
  return role === 'super_admin' || role === 'editor' || role === 'viewer' ? role : null
}

export const publicRead: Access = () => true

export const authenticatedRead: Access = ({ req }) => Boolean(req.user)

export const canManageContent: Access = ({ req }) => {
  const role = roleFromUser(req.user)
  return role === 'super_admin' || role === 'editor'
}

export const superAdminOnly: Access = ({ req }) => roleFromUser(req.user) === 'super_admin'

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { status: { equals: 'published' } }
}

export const visibleOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { isVisible: { equals: true } }
}

export const ownUserOrSuperAdmin: Access = ({ req }) => {
  if (roleFromUser(req.user) === 'super_admin') return true
  if (!req.user) return false
  return { id: { equals: req.user.id } }
}

export const superAdminFieldOnly: FieldAccess = ({ req }) => roleFromUser(req.user) === 'super_admin'

export const verifiedIdentityField: FieldAccess = ({ req, doc }) => (
  Boolean(req.user)
  || Boolean((doc as { identityVerified?: unknown } | undefined)?.identityVerified)
)
