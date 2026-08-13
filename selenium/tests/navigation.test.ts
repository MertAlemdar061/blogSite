import { WebDriver, By, until } from 'selenium-webdriver';
import { createDriver } from '../src/driver';
import { HomePage } from '../src/pages/HomePage';
import { config, waitVisible } from './support';

/**
 * Ziyaretçi arayüzü senaryoları (giriş gerektirmez).
 */
describe('Ziyaretçi arayüzü', () => {
  let driver: WebDriver;
  let home: HomePage;

  beforeAll(async () => {
    driver = await createDriver();
    home = new HomePage(driver);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('anasayfa yüklenir ve ana başlık görünür', async () => {
    await home.go();
    expect(await home.isLoaded()).toBe(true);
  });

  test('en az bir yazı kartı listelenir', async () => {
    await home.go();
    const cards = await home.getPostCards();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('bir yazıya tıklanınca detay sayfası açılır', async () => {
    await home.go();
    const cards = await home.getPostCards();
    await cards[0].click();
    await driver.wait(until.urlContains('/yazi/'), config.defaultTimeout);
    // Detayda yazı gövdesi (paragraf) görünmeli
    const paragraph = await waitVisible(driver, By.css('p'));
    expect(await paragraph.getText()).not.toEqual('');
  });

  test('arama kutusu çalışır ve sonuç gösterir', async () => {
    await home.go();
    await home.search('TypeScript');
    await driver.sleep(800); // debounce (400ms) için bekle
    const cards = await home.getPostCards();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('kategori etiketine tıklanınca kategori sayfası açılır', async () => {
    await home.go();
    const chip = await waitVisible(driver, By.css('a[href^="/kategori/"]'));
    await chip.click();
    await driver.wait(until.urlContains('/kategori/'), config.defaultTimeout);
    expect(await driver.getCurrentUrl()).toContain('/kategori/');
  });

  test('Giriş butonuna tıklanınca giriş sayfası açılır', async () => {
    await home.go();
    await home.clickLogin();
    await driver.wait(until.urlContains('/login'), config.defaultTimeout);
    expect(await driver.getCurrentUrl()).toContain('/login');
  });

  test('bilinmeyen bir adres 404 sayfasını gösterir', async () => {
    await driver.get(`${config.baseUrl}/olmayan-sayfa-123`);
    const heading = await waitVisible(driver, By.xpath("//*[contains(text(),'404')]"));
    expect(await heading.getText()).toContain('404');
  });
});
