import { User } from '@/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User | null): boolean => {
  if (!user) return false

  const hasPermission = allRoles.some((role) =>
    user.roles.some((individualRole) => individualRole === role),
  )

  return hasPermission
}
