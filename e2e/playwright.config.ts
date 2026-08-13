import { defineConfig, devices } from '@playwright/test';

/**
 * Yerel ortama karşı E2E test yapılandırması.
 * Çalıştırmadan önce: Docker veritabanı + backend (3000) + frontend (5173) açık olmalı.
 * Adresler ortam değişkenleriyle değiştirilebilir (BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD).
 */
export default defineConfig({
  testDir: './tests',
  // Admin testleri ortak veritabanını değiştirdiği için seri çalıştırıyoruz.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
