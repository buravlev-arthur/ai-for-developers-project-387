import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:8080',
    browserName: 'chromium',
  },
  webServer: [
    {
      command: 'npm run server:start',
      port: 3001,
      timeout: 10_000,
      reuseExistingServer: true,
    },
    {
      command: 'npm run client:dev',
      env: { VITE_E2E: 'true' },
      port: 8080,
      timeout: 30_000,
      reuseExistingServer: true,
    },
  ],
});
