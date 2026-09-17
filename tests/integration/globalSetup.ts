import { BASE_URL } from './client'

/** Fails fast with a useful message rather than letting every test time out separately. */
export default async function waitForServer() {
  const deadline = Date.now() + 120_000

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE_URL}/api/access`)
      if (res.ok) return
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000))
  }

  throw new Error(
    `No server answered at ${BASE_URL} within 120s. Start one (pnpm build && pnpm start) or set INTEGRATION_BASE_URL.`,
  )
}
