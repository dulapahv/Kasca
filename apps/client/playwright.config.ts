/**
 * Playwright test configuration for end-to-end testing.
 * Features:
 * - Parallel test execution
 * - Retries and timeouts
 * - Multi-browser support
 * - Screenshot and trace capture
 *
 * By Dulapah Vibulsanti (https://dulapahv.dev)
 */

import path from 'path';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true, // Run tests in files in parallel
  forbidOnly: !!process.env.CI, // Fail the build on CI if you accidentally left test.only in the source code
  retries: process.env.CI ? 2 : 0, // Retry on CI only
  workers: process.env.CI ? 7 : undefined, // Run tests in parallel on CI
  reporter: process.env.CI ? [['html'], ['github']] : 'html', // Reporter to use
  timeout: 120000, // Timeout for each test
  // Shared settings for all the projects below
  use: {
    baseURL: 'http://localhost:3000', // Base URL for all the projects
    trace: 'on-first-retry', // Collect trace when retrying the failed test
    screenshot: 'only-on-failure', // Collect screenshot after each test failure
  },
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // Configure the web server for the test
  webServer: [
    {
      command: process.env.CI
        ? 'cd ../server && pnpm start'
        : 'cd ../server && pnpm dev',
      url: 'http://localhost:3001',
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: process.env.CI ? 'pnpm start' : 'pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
