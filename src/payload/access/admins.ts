import type { Access, FieldAccess, PayloadRequest } from 'payload'
import { checkRole } from '@/payload/collections/Users/checkRole'

// Reads only `req`, which collection and field access args both carry.
const isAdmin = ({ req: { user } }: { req: PayloadRequest }) => checkRole(['admin'], user)

/** Collection-level access (`access.create`, ...): admins only. */
export const admins: Access = isAdmin

/** Field-level access (`field.access.read`, ...): admins only. */
export const adminsField: FieldAccess = isAdmin
