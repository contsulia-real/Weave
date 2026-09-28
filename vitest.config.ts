import {
  fileURLToPath,
  URL,
} from 'node:url'
import {
  defineConfig,
} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'threads',
    include: [
      'src/**/*.test.{ts,tsx}',
      'tests/**/*.test.{ts,tsx}',
    ],
    setupFiles: [
      fileURLToPath(
        new URL(
          './tests/setup.ts',
          import.meta.url,
        ),
      ),
    ],
  },
})
