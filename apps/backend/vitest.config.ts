import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    include: ['src/**/*.test.ts'],
  },
});