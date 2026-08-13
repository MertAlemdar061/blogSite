# Selenium Testleri (TypeScript + Jest + Page Object Model)

Tech Gündem blogu için Selenium WebDriver tabanlı test iskeleti. Sayfa nesnesi
(Page Object Model) mimarisiyle kurulu; testleri bu temel üzerine sen yazarsın.

## Yapı

```
selenium/
├── src/
│   ├── config.ts          Adres ve kimlik bilgileri (ortam değişkeniyle değişir)
│   ├── driver.ts          Chrome WebDriver fabrikası
│   └── pages/
│       ├── BasePage.ts    Ortak eylemler (open, waitFor, click, type, isVisible)
│       ├── HomePage.ts    Anasayfa Page Object'i (örnekte kullanılır)
│       └── LoginPage.ts   Giriş Page Object'i (kendi auth testlerin için şablon)
├── tests/
│   └── home.test.ts       ÖRNEK test — yeni testler için kalıp
├── jest.config.js
└── tsconfig.json
```

## Ön koşullar

- Bilgisayarında **Google Chrome** kurulu olmalı. (Selenium 4 sürücüyü otomatik indirir.)
- Testler **yerelde çalışan uygulamaya** koşar — önce yığını ayağa kaldır:
  ```bash
  # 1) Veritabanı
  cd C:\Users\orimr\Desktop\blogSite && docker compose up -d
  # 2) Backend (ayrı terminal)
  cd backend && npm run start:dev          # http://localhost:3000
  # 3) Frontend (ayrı terminal)
  cd frontend && npm run dev               # http://localhost:5173
  ```
- Veritabanı seed'li olmalı (`cd backend && npm run prisma:seed`) — örnek yazı + admin.

## Kurulum ve çalıştırma

```bash
cd selenium
npm install
npm test                 # testleri çalıştır (tarayıcı görünür)
npm run test:headless    # tarayıcı görünmeden
npm run typecheck        # sadece TypeScript tip kontrolü
```

## Yapılandırma (ortam değişkenleri)

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `BASE_URL` | `http://localhost:5173` | Test edilecek frontend adresi |
| `ADMIN_EMAIL` | `admin@blog.com` | Giriş için e-posta |
| `ADMIN_PASSWORD` | `Admin123!` | Giriş için şifre |
| `HEADLESS` | `false` | `true` ise tarayıcı görünmez çalışır |

## Yeni test nasıl yazılır?

1. Gerekirse `src/pages/` altında yeni bir Page Object oluştur (`BasePage`'ten türet,
   locator'ları ve eylemleri tanımla). Örnek için `HomePage.ts` ve `LoginPage.ts`'e bak.
2. `tests/` altında `*.test.ts` dosyası aç; `home.test.ts`'i kalıp olarak kullan.
3. `beforeAll`'da `createDriver()` ile sürücüyü kur, `afterAll`'da `driver.quit()` ile kapat.

Örnek — giriş testi (LoginPage zaten hazır):

```ts
import { WebDriver } from 'selenium-webdriver';
import { createDriver } from '../src/driver';
import { LoginPage } from '../src/pages/LoginPage';

describe('Giriş', () => {
  let driver: WebDriver;
  let login: LoginPage;

  beforeAll(async () => { driver = await createDriver(); login = new LoginPage(driver); });
  afterAll(async () => { if (driver) await driver.quit(); });

  test('hatalı bilgiyle giriş hata gösterir', async () => {
    await login.go();
    await login.login('yanlis@ornek.com', 'yanlissifre');
    expect(await login.getError()).toMatch(/hatalı/i);
  });
});
```

## İpuçları

- Locator'ları Page Object içinde tut; testlerde ham CSS/XPath kullanma — arayüz
  değişince tek yerden güncellersin.
- Görünürlük/yükleme için `BasePage.waitFor` gibi açık beklemeler kullan; sabit
  `sleep` kullanma (kırılgan olur).
- Testler veritabanını değiştirebilir (yazı oluşturma vb.); seri çalışacak şekilde
  ayarlandı (`maxWorkers: 1`).
