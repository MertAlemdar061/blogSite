import { WebDriver, By, until } from 'selenium-webdriver';
import { createDriver } from '../src/driver';
import {
  config,
  waitVisible,
  clickReady,
  typeInto,
  inputByLabel,
  loginViaUI,
} from './support';

/**
 * Yönetim paneli senaryoları (giriş gerektirir).
 * beforeAll'da bir kez giriş yapılır; oturum tüm testler boyunca açık kalır.
 */
describe('Yönetim paneli', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await createDriver();
    await loginViaUI(driver);
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('gösterge paneli istatistik kartlarını gösterir', async () => {
    await driver.get(`${config.baseUrl}/admin/dashboard`);
    const card = await waitVisible(
      driver,
      By.xpath("//*[contains(text(),'Yayınlanan yazı')]"),
    );
    expect(await card.getText()).toContain('Yayınlanan yazı');
  });

  test('kenar menüsünden Yazılar sayfasına gidilir', async () => {
    await driver.get(`${config.baseUrl}/admin/dashboard`);
    await clickReady(driver, By.xpath("//a[contains(.,'Yazılar')]"));
    await driver.wait(until.urlMatches(/\/admin\/posts$/), config.defaultTimeout);
    // Tablo başlığı görünmeli
    const header = await waitVisible(driver, By.xpath("//th[contains(.,'Başlık')]"));
    expect(await header.getText()).toContain('Başlık');
  });

  test('yeni yazı oluşturulur, yayınlanır ve listede görünür', async () => {
  const title = `Selenium Test Yazisi ${Date.now()}`;
  await driver.get(`${config.baseUrl}/admin/posts/new`);

  await typeInto(driver, inputByLabel('Başlık'), title);
  await typeInto(
    driver,
    By.xpath("//label[contains(normalize-space(.),'Özet')]/parent::div//textarea[not(@aria-hidden='true')]"),
    'Selenium ile olusturulan ornek yazi.',
  );

  // TipTap içeriği
  const editor = await waitVisible(driver, By.css('.ProseMirror'));
  await editor.click();
  await editor.sendKeys('Bu yazi Selenium test senaryosu tarafindan yazildi.');

  // "Yayında" anahtarı — gizli MUI input'u JavaScript ile tıkla (en sağlamı)
  const toggle = await driver.findElement(By.css("input[type='checkbox']"));
  if (!(await toggle.isSelected())) {
    await driver.executeScript('arguments[0].click();', toggle);
  }

  // Kaydet — görünür alana getirip tıkla
  const saveBtn = await waitVisible(
    driver,
    By.xpath("//button[contains(normalize-space(.),'Kaydet')]"),
  );
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', saveBtn);
  await saveBtn.click();

  // Yazı listesine dönülmeli
  await driver.wait(until.urlMatches(/\/admin\/posts$/), config.defaultTimeout);
  const row = await waitVisible(driver, By.xpath(`//*[contains(text(),'${title}')]`));
  expect(await row.getText()).toContain(title);

  await driver.get(`${config.baseUrl}/`);
  const onHome = await waitVisible(driver, By.xpath(`//*[contains(text(),'${title}')]`));
  expect(await onHome.getText()).toContain(title);
});

  test('yeni kategori oluşturulur ve listede görünür', async () => {
    const name = `Kategori ${Date.now()}`;
    await driver.get(`${config.baseUrl}/admin/categories`);

    await typeInto(driver, inputByLabel('Ad'), name);
    await clickReady(driver, By.xpath("//button[contains(normalize-space(.),'Ekle')]"));

    const item = await waitVisible(driver, By.xpath(`//*[contains(text(),'${name}')]`));
    expect(await item.getText()).toContain(name);
  });
});
