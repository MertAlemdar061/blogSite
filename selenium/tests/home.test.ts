import { By, until, WebDriver } from 'selenium-webdriver';
import { createDriver } from '../src/driver';
import { HomePage } from '../src/pages/HomePage';

/**
 * ÖRNEK TEST — anasayfa.
 * Diğer testlerini bunu şablon alarak yazabilirsin:
 *  1) İlgili Page Object'i içe aktar (ya da yeni bir tane oluştur).
 *  2) beforeAll'da driver'ı kur, afterAll'da kapat.
 *  3) test() içinde sayfa nesnesinin metotlarını kullan ve expect ile doğrula.
 */
describe('Anasayfa (Home Page)', () => {
  let driver: WebDriver;
  let home: HomePage;

  beforeAll(async () => {
    driver = await createDriver();
    home = new HomePage(driver);
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
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

  test('Giriş tuşuna tıklanıldığında giriş sayfası açılır', async () => {
    await home.go();
    await home.clickLogin();
    await driver.wait(until.urlContains('/login'), 10000);
    expect(await driver.getCurrentUrl()).toContain('/login');
  });
});
