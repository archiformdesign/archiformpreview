import { defineConfig } from '@playwright/test';

/* QA suite: every page in Chrome, Firefox and Safari's engine (WebKit) at nine screen sizes.
   Runs against a production build: `npm run build` first, then `npm run test:e2e`.
   BASE_URL=https://archiformdesign.me npm run test:e2e tests the live site instead (no local server is started).
   SHOTS=before|after sets the folder the screenshots are saved to (audit/screens/<SHOTS>/...). */
const PORT = 3100;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: BASE_URL, trace: 'retain-on-failure' },
  webServer: process.env.BASE_URL ? undefined : {
    command: `npx next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    // Google Chrome rather than Playwright's Chromium: the home films are H.264, which only branded Chrome decodes
    { name: 'chrome', use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
