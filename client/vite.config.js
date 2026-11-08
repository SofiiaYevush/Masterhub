/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['i18next', 'react-i18next'],
  },
  json: {
    stringify: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Intentionally includes every component/page, not just the ones with
      // tests today - the report is meant to show real gaps (per the test
      // plan, most pages/components don't have tests yet), not hide them.
      include: ['src/**'],
      exclude: [
        'src/main.jsx', // app bootstrap, exercised by e2e instead
        'src/config/**', // i18next wiring, exercised by e2e instead
        'src/test/**',
      ],
      // No thresholds enforced yet - coverage here is a growing baseline,
      // not a gate. Re-introduce thresholds once more components/pages have
      // tests; an enforced floor today would just be excluding real gaps.
    },
  },
})
