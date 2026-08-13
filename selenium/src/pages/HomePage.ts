import { By, WebElement } from 'selenium-webdriver';
import { BasePage } from './BasePage';

/**
 * Anasayfanın Page Object'i.
 * Arayüz değişirse yalnızca aşağıdaki locator'ları güncellemen yeterli;
 * testler aynı kalır.
 */
export class HomePage extends BasePage {
  private readonly heading = By.xpath(
    "//h2[contains(., 'Teknoloji ve Gündem')]",
  );
  private readonly postCards = By.css('a[href^="/yazi/"]');
  private readonly searchInput = By.css('input[placeholder="Yazılarda ara..."]');
  private readonly loginButton = By.xpath("//button[normalize-space()='Giriş']");

  /** Anasayfayı açar. */
  async go(): Promise<void> {
    await this.open('/');
  }

  /** Ana başlık görünür mü? */
  async isLoaded(): Promise<boolean> {
    return this.isVisible(this.heading);
  }

  /** Listelenen yazı kartlarını döndürür. */
  async getPostCards(): Promise<WebElement[]> {
    await this.waitFor(this.postCards);
    return this.driver.findElements(this.postCards);
  }

  /** Arama kutusuna bir terim yazar. */
  async search(term: string): Promise<void> {
    await this.type(this.searchInput, term);
  }

  async clickLogin(): Promise<void> {
  await this.click(this.loginButton);
  }
}
