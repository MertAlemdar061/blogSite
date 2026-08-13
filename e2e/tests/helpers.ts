import { Page, expect } from '@playwright/test';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@blog.com';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin123!';

/** Yönetim paneline giriş yapar ve /admin'e ulaşıldığını doğrular. */
export async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.getByLabel('E-posta').fill(ADMIN_EMAIL);
  await page.getByLabel('Şifre').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Giriş Yap' }).click();
  await expect(page).toHaveURL(/\/admin/);
}
