import type { Access } from 'payload'
import { describe, expect, it } from 'vitest'
import { checkRole } from '@/payload/collections/Users/checkRole'
import type { User } from '@/payload-types'
import { admins, adminsField } from './admins'
import { anyone } from './anyone'
import { authenticated } from './authenticated'
import { authenticatedOrPublished } from './authenticatedOrPublished'

// Access functions only ever read `req.user`; the rest of the request is irrelevant here.
const asUser = (user: Partial<User> | null) => ({ req: { user } }) as Parameters<Access>[0]
const user = (roles: User['roles']) => ({ id: '1', email: 'a@b.c', roles }) satisfies Partial<User>

describe('anyone', () => {
  it('lets everyone through', () => {
    expect(anyone(asUser(null))).toBe(true)
  })
})

describe('authenticated', () => {
  it('requires a user', () => {
    expect(authenticated(asUser(user(['editor'])))).toBe(true)
    expect(authenticated(asUser(null))).toBe(false)
  })
})

describe('authenticatedOrPublished', () => {
  it('lets a logged-in user read everything', () => {
    expect(authenticatedOrPublished(asUser(user(['editor'])))).toBe(true)
  })

  it('narrows anonymous reads to published documents', () => {
    expect(authenticatedOrPublished(asUser(null))).toEqual({ _status: { equals: 'published' } })
  })
})

describe('admins', () => {
  it('allows admins at both collection and field level', () => {
    const args = asUser(user(['admin']))
    expect(admins(args)).toBe(true)
    expect(adminsField(args as unknown as Parameters<typeof adminsField>[0])).toBe(true)
  })

  it('denies other roles and anonymous requests', () => {
    expect(admins(asUser(user(['editor'])))).toBe(false)
    expect(admins(asUser(null))).toBe(false)
  })
})

describe('checkRole', () => {
  const req = (u: Partial<User> | null) => (u as User | null) ?? null

  it('matches when the user holds any of the allowed roles', () => {
    expect(checkRole(['admin', 'editor'], req(user(['editor'])))).toBe(true)
  })

  it('denies when no role matches', () => {
    expect(checkRole(['admin'], req(user(['editor'])))).toBe(false)
  })

  it('denies when there is no user', () => {
    expect(checkRole(['admin'], null)).toBe(false)
    expect(checkRole(['admin'], undefined)).toBe(false)
  })

  it('denies legacy users stored without a roles array', () => {
    expect(checkRole(['admin'], req({ id: '1', email: 'a@b.c' }))).toBe(false)
  })

  it('denies when no roles are asked for', () => {
    expect(checkRole([], req(user(['admin'])))).toBe(false)
    expect(checkRole(undefined, req(user(['admin'])))).toBe(false)
  })
})
