import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import { config } from './config';

/**
 * Bir Chrome WebDriver örneği oluşturur.
 * Selenium 4, sürücüyü (chromedriver) otomatik indirir — ekstra kuruluma gerek yok.
 * Sadece bilgisayarında Chrome tarayıcısının kurulu olması yeterli.
 */
export async function createDriver(): Promise<WebDriver> {
  const options = new Options();
  if (config.headless) {
    options.addArguments('--headless=new');
  }
  options.addArguments(
    '--window-size=1366,900',
    '--disable-gpu',
    '--no-sandbox',
  );

  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}
