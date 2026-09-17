export const BASE_URL = process.env.INTEGRATION_BASE_URL ?? 'http://localhost:3000'

const ADMIN = {
  email: 'integration@example.com',
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
  // Succeeds once, on an empty database; afterwards the user is already there.
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

  if (!token) throw new Error(`Could not log in at ${BASE_URL} (status ${res.status})`)
  return token
}
