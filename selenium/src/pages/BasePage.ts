import { WebDriver, WebElement, By, until } from 'selenium-webdriver';
import { config } from '../config';

/**
 * Tüm sayfa nesnelerinin (Page Object) temel sınıfı.
 * Ortak eylemleri (açma, bekleme, tıklama, yazma) burada toplar;
 * yeni sayfalar bu sınıftan türeyip kendi locator'larını tanımlar.
 */
export abstract class BasePage {
  constructor(protected driver: WebDriver) {}

  /** Verilen yolu (örn. '/login') temel adrese ekleyerek açar. */
  async open(path = ''): Promise<void> {
    await this.driver.get(`${config.baseUrl}${path}`);
  }

  /** Bir elemanın DOM'da bulunup görünür olmasını bekler ve döndürür. */
  protected async waitFor(
    locator: By,
    timeout = config.defaultTimeout,
  ): Promise<WebElement> {
    const el = await this.driver.wait(until.elementLocated(locator), timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  protected async click(locator: By): Promise<void> {
    await (await this.waitFor(locator)).click();
  }

  protected async type(locator: By, text: string): Promise<void> {
    const el = await this.waitFor(locator);
    await el.clear();
    await el.sendKeys(text);
  }

  protected async getText(locator: By): Promise<string> {
    return (await this.waitFor(locator)).getText();
  }

  /** Eleman verilen süre içinde görünür olursa true, olmazsa false döner. */
  protected async isVisible(
    locator: By,
    timeout = config.defaultTimeout,
  ): Promise<boolean> {
    try {
      await this.waitFor(locator, timeout);
      return true;
    } catch {
      return false;
    }
  }
}
