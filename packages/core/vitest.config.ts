import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts', 'test/**/*.test.ts'],
		testTimeout: 1_000_000,
		// common testing functions are automatically made available globally in all your test files without needing to import them
		globals: true,
		environment: 'jsdom',
	},
})
