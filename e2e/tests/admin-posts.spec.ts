import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Yönetim paneli — yazı yaşam döngüsü', () => {
  test('yeni yazı oluşturulur, yayınlanır ve anasayfada görünür', async ({ page }) => {
    const title = `Otomatik Test Yazisi ${Date.now()}`;

    await login(page);

    // Yeni yazı ekranı
    await page.goto('/admin/posts/new');
    await expect(
      page.getByRole('heading', { name: 'Yeni Yazı' }),
    ).toBeVisible();

    // Form alanları
    await page.getByRole('textbox', { name: 'Başlık' }).fill(title);
    await page.getByRole('textbox', { name: 'Özet' }).fill('Bu yazi otomatik E2E testi tarafindan olusturuldu.');

    // TipTap zengin metin editörüne içerik yaz
    const editor = page.locator('.ProseMirror');
    await editor.click();
    await page.keyboard.type('Bu, uctan uca test senaryosunun govde icerigidir.');

    // "Yayında" anahtarını aç (MUI Switch = checkbox)
    await page.getByRole('checkbox').check();

    // Kaydet
    await page.getByRole('button', { name: 'Kaydet' }).click();

    // Yazı listesine dönülür ve yeni yazı tabloda görünür
    await expect(page).toHaveURL(/\/admin\/posts$/);
    await expect(page.getByText(title)).toBeVisible();

    // Yayınlanan yazı anasayfada da görünmeli
    await page.goto('/');
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
  });

  test('panelden çıkış yapılabilir', async ({ page }) => {
    await login(page);
    // Sağ üstteki avatar menüsünü aç
    await page.locator('header button').last().click();
    await page.getByRole('menuitem', { name: /Çıkış/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
