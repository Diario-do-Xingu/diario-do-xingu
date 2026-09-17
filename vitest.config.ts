import { defineConfig } from 'vitest/config'

// Unit tests only: nothing here needs a server or a database. The default environment is
// node; the few tests that touch the DOM opt into jsdom with a `@vitest-environment` comment.
export default defineConfig({
  // Resolves the `@/*` aliases from tsconfig.json (native since Vite 8, no plugin needed).
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
