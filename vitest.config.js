import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Налаштування для покриття коду (за бажанням)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    }
  }
});