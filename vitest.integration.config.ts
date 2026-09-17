import { defineConfig } from 'vitest/config'

/**
 * Integration suite: talks to a running build over HTTP and the Payload REST API, so the
 * hooks run inside a real Next request scope - which is the only way to observe revalidation.
 *
 * It creates and deletes documents, so it must point at a throwaway database. `pnpm test`
 * (the unit suite) stays separate and needs no server.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/integration/**/*.test.ts'],
    globalSetup: ['tests/integration/globalSetup.ts'],
    // The suite publishes and unpublishes shared pages; parallel files would race.
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
