import type { User } from '@/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User | null): boolean => {
  if (!user) return false

  const hasPermission = allRoles.some((role) =>
    // Legacy user documents can lack a roles array; deny instead of throwing
    (user.roles ?? []).some((individualRole) => individualRole === role),
  )

  return hasPermission
}
