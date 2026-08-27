import type { FieldAccess } from 'payload'
import { checkRole } from '@/payload/collections/Users/checkRole'

type isAdmin = FieldAccess

export const admins: isAdmin = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}
