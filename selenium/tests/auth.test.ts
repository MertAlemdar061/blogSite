import { WebDriver, By, until } from 'selenium-webdriver';
import { createDriver } from '../src/driver';
import {
  config,
  waitVisible,
  clickReady,
  typeInto,
  clearSession,
} from './support';

/**
 * Kimlik doğrulama senaryoları.
 */
describe('Kimlik doğrulama', () => {
  let driver: WebDriver;

  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) await driver.quit();
  });

  test('oturum yokken korumalı panel girişe yönlendirir', async () => {
    await clearSession(driver);
    await driver.get(`${config.baseUrl}/admin/dashboard`);
    await driver.wait(until.urlContains('/login'), config.defaultTimeout);
    expect(await driver.getCurrentUrl()).toContain('/login');
  });

  test('giriş sayfası form alanlarıyla yüklenir', async () => {
    await driver.get(`${config.baseUrl}/login`);
    expect(await waitVisible(driver, By.css("input[type='email']"))).toBeTruthy();
    expect(await waitVisible(driver, By.css("input[type='password']"))).toBeTruthy();
  });

  test('hatalı bilgiyle giriş hata mesajı gösterir', async () => {
    await driver.get(`${config.baseUrl}/login`);
    await typeInto(driver, By.css("input[type='email']"), 'yanlis@ornek.com');
    await typeInto(driver, By.css("input[type='password']"), 'yanlissifre');
    await clickReady(driver, By.css("button[type='submit']"));
    const alert = await waitVisible(driver, By.css('.MuiAlert-message'));
    expect((await alert.getText()).toLowerCase()).toContain('hatalı');
    expect(await driver.getCurrentUrl()).toContain('/login');
  });

  test('doğru bilgiyle giriş panele götürür', async () => {
    await driver.get(`${config.baseUrl}/login`);
    await typeInto(driver, By.css("input[type='email']"), config.adminEmail);
    await typeInto(driver, By.css("input[type='password']"), config.adminPassword);
    await clickReady(driver, By.css("button[type='submit']"));
    await driver.wait(until.urlContains('/admin'), config.defaultTimeout);
    const greeting = await waitVisible(driver, By.xpath("//*[contains(text(),'Hoş geldin')]"));
    expect(await greeting.getText()).toContain('Hoş geldin');
  });

  test('panelden çıkış yapılınca giriş sayfasına dönülür', async () => {
    // Bir önceki testten oturum açık; avatar menüsünden çıkış yap
    await clickReady(driver, By.css('header .MuiAvatar-root'));
    await clickReady(driver, By.xpath("//li[contains(.,'Çıkış')]"));
    await driver.wait(until.urlContains('/login'), config.defaultTimeout);
    expect(await driver.getCurrentUrl()).toContain('/login');
  });
});
