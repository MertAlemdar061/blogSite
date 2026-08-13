import { By } from 'selenium-webdriver';
import { BasePage } from './BasePage';
import { config } from '../config';

/**
 * Giriş ekranının Page Object'i — kendi kimlik doğrulama testlerini
 * yazarken şablon olarak kullanabilirsin.
 */
export class LoginPage extends BasePage {
  private readonly emailInput = By.css('input[type="email"]');
  private readonly passwordInput = By.css('input[type="password"]');
  private readonly submitButton = By.css('button[type="submit"]');
  private readonly errorAlert = By.css('.MuiAlert-message');

  /** Giriş sayfasını açar. */
  async go(): Promise<void> {
    await this.open('/login');
  }

  /** Verilen (ya da varsayılan admin) bilgilerle giriş yapar. */
  async login(
    email = config.adminEmail,
    password = config.adminPassword,
  ): Promise<void> {
    await this.type(this.emailInput, email);
    await this.type(this.passwordInput, password);
    await this.click(this.submitButton);
  }

  /** Hata uyarısının metnini döndürür (hatalı giriş senaryoları için). */
  async getError(): Promise<string> {
    return this.getText(this.errorAlert);
  }
}
