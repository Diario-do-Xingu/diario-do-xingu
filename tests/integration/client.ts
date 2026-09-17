export const BASE_URL = process.env.INTEGRATION_BASE_URL ?? 'http://localhost:3000'

// On an empty database the suite creates this account itself. Against a database that already
// has users - a clone of production, say - point these at an existing admin instead.
const ADMIN = {
  email: process.env.INTEGRATION_ADMIN_EMAIL ?? 'integration@example.com',
  password: process.env.INTEGRATION_ADMIN_PASSWORD ?? 'integration-only-password',
}

type ApiInit = Omit<RequestInit, 'body'> & { body?: unknown }

/** Calls the Payload REST API as the integration admin, returning the parsed body. */
export async function api<T = Record<string, unknown>>(
  path: string,
  { body, headers, ...init }: ApiInit = {},
) {
  const isForm = body instanceof FormData
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...init,
    body: isForm ? body : body === undefined ? undefined : JSON.stringify(body),
    headers: {
      ...(isForm || body === undefined ? {} : { 'content-type': 'application/json' }),
      Authorization: `JWT ${await token()}`,
      ...headers,
    },
  })

  const text = await res.text()
  const json = text ? (JSON.parse(text) as T) : ({} as T)
  return { status: res.status, json }
}

/** Fetches a public page, bypassing fetch's own cache so only the server's cache is in play. */
export async function page(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store' })
  return { status: res.status, html: await res.text() }
}

let tokenPromise: Promise<string> | undefined
const token = () => {
  tokenPromise ??= logIn()
  return tokenPromise
}

async function logIn() {
  // Only works while the collection is empty; a database that already has users just 403s here.
  await fetch(`${BASE_URL}/api/users/first-register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...ADMIN, roles: ['admin'] }),
  })

  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(ADMIN),
  })
  const { token } = (await res.json()) as { token?: string }

  if (!token) {
    throw new Error(
      `Could not log in at ${BASE_URL} as ${ADMIN.email} (status ${res.status}). On a database ` +
        'that already has users, set INTEGRATION_ADMIN_EMAIL and INTEGRATION_ADMIN_PASSWORD to ' +
        'an existing admin.',
    )
  }
  return token
}
