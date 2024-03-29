import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Specify the environment
    environment: 'jsdom',
    // Other configurations...
  },
});
