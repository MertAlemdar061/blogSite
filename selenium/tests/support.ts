import { WebDriver, WebElement, By, until } from 'selenium-webdriver';
import { config } from '../src/config';

export { config };

/** Eleman görünür olana kadar bekler ve döndürür. */
export async function waitVisible(
  driver: WebDriver,
  locator: By,
  timeout = config.defaultTimeout,
): Promise<WebElement> {
  const el = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(el), timeout);
  return el;
}

/** Eleman hazır olunca tıklar. */
export async function clickReady(driver: WebDriver, locator: By): Promise<void> {
  await (await waitVisible(driver, locator)).click();
}

/** Bir alana yazar (önce temizler). */
export async function typeInto(
  driver: WebDriver,
  locator: By,
  text: string,
): Promise<void> {
  const el = await waitVisible(driver, locator);
  await el.clear();
  await el.sendKeys(text);
}

/** MUI TextField'ı etiket metnine göre bulur (input). */
export function inputByLabel(label: string): By {
  return By.xpath(
    `//label[contains(normalize-space(.),'${label}')]/parent::div//input`,
  );
}

/** Arayüz üzerinden admin girişi yapar. */
export async function loginViaUI(driver: WebDriver): Promise<void> {
  await driver.get(`${config.baseUrl}/login`);
  await typeInto(driver, By.css("input[type='email']"), config.adminEmail);
  await typeInto(driver, By.css("input[type='password']"), config.adminPassword);
  await clickReady(driver, By.css("button[type='submit']"));
  await driver.wait(until.urlContains('/admin'), config.defaultTimeout);
}

/** localStorage'ı temizler (oturumu sıfırlamak için). */
export async function clearSession(driver: WebDriver): Promise<void> {
  await driver.get(`${config.baseUrl}/`);
  await driver.executeScript('window.localStorage.clear();');
}
