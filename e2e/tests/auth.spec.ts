import { test, expect } from '@playwright/test';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers';

test.describe('Kimlik doğrulama', () => {
  test('korumalı panel, girişe yönlendirir', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('hatalı bilgiyle giriş hata mesajı gösterir', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-posta').fill('yanlis@ornek.com');
    await page.getByLabel('Şifre').fill('yanlissifre');
    await page.getByRole('button', { name: 'Giriş Yap' }).click();
    await expect(page.getByText(/hatalı/i)).toBeVisible();
    // Hâlâ giriş sayfasında kalmalı
    await expect(page).toHaveURL(/\/login/);
  });

  test('doğru bilgiyle giriş panele götürür', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('E-posta').fill(ADMIN_EMAIL);
    await page.getByLabel('Şifre').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Giriş Yap' }).click();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByText(/Hoş geldin/i)).toBeVisible();
  });
});
