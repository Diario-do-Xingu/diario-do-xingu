import { defineConfig } from 'vitest/config'

// Unit tests only: everything under test is pure or takes its Payload dependencies as
// arguments, so no server, database or DOM is needed.
export default defineConfig({
  // Resolves the `@/*` aliases from tsconfig.json (native since Vite 8, no plugin needed).
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
