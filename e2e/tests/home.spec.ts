import { test, expect } from '@playwright/test';

test.describe('Ziyaretçi arayüzü', () => {
  test('anasayfa yüklenir ve ana başlık görünür', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Teknoloji ve Gündem/i }),
    ).toBeVisible();
  });

  test('en az bir yazı kartı listelenir', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('a[href^="/yazi/"]');
    await expect(cards.first()).toBeVisible();
  });

  test('bir yazıya tıklanınca detay sayfası açılır', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href^="/yazi/"]').first().click();
    await expect(page).toHaveURL(/\/yazi\//);
    // Yazı gövdesinden en az bir paragraf görünmeli
    await expect(page.locator('p').first()).toBeVisible();
  });

  test('arama kutusu mevcut ve kullanılabilir', async ({ page }) => {
    await page.goto('/');
    const search = page.getByPlaceholder('Yazılarda ara...');
    await expect(search).toBeVisible();
    await search.fill('TypeScript');
    // Debounce (400ms) sonrası sonuçların yenilenmesini bekle
    await page.waitForTimeout(800);
    await expect(page.locator('a[href^="/yazi/"]').first()).toBeVisible();
  });
});
