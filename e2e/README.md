# E2E Testleri (Playwright)

Tech Gündem blogunun uçtan uca (end-to-end) testleri. Gerçek bir tarayıcı
açar, kullanıcı gibi davranır ve kritik akışların çalıştığını doğrular.

## Neyi test eder?

- **home.spec.ts** — Anasayfa yüklenir, yazı kartları listelenir, yazı detayı
  açılır, arama kutusu çalışır.
- **auth.spec.ts** — Korumalı panel girişe yönlendirir, hatalı giriş hata verir,
  doğru giriş panele götürür.
- **admin-posts.spec.ts** — Giriş → yeni yazı oluştur (TipTap editörü) → yayınla →
  hem panelde hem anasayfada görünür; çıkış yapılır.

## Ön koşullar

Testler **yerelde çalışan uygulamaya** karşı koşar. Önce tüm yığını ayağa kaldır:

```bash
# 1) Veritabanı
cd C:\Users\orimr\Desktop\blogSite
docker compose up -d

# 2) Backend (ayrı terminal)
cd backend
npm run start:dev          # http://localhost:3000

# 3) Frontend (ayrı terminal)
cd frontend
npm run dev                # http://localhost:5173
```

Veritabanı seed'lenmiş olmalı (admin kullanıcı + örnek yazı). Daha önce
`npm run prisma:seed` çalıştırdıysan hazırsın.

## Kurulum ve çalıştırma

```bash
cd e2e
npm install
npx playwright install chromium   # tarayıcıyı indirir (ilk seferde)

npm test            # tüm testleri çalıştır
npm run test:ui     # görsel arayüzle (adım adım izlemek için)
npm run test:headed # tarayıcıyı görünür şekilde
npm run report      # son raporu aç
```

## Yapılandırma (ortam değişkenleri)

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `BASE_URL` | `http://localhost:5173` | Test edilecek frontend adresi |
| `ADMIN_EMAIL` | `admin@blog.com` | Giriş için e-posta |
| `ADMIN_PASSWORD` | `Admin123!` | Giriş için şifre |

Örnek (canlı siteye karşı smoke test — dikkat: test verisi canlıya yazılır):

```bash
BASE_URL=https://tech-gundem.com ADMIN_EMAIL=... ADMIN_PASSWORD=... npm test
```

## Notlar

- Testler veritabanını değiştirdiği için **seri** (workers: 1) çalışır.
- `admin-posts` testi her koşuda yeni bir yazı oluşturur (başlıkta zaman damgası
  vardır). Zamanla biriken test yazılarını panelden silebilirsin.
- Hata olursa ekran görüntüsü, video ve trace `test-results/` altında tutulur;
  `npm run report` ile incelenebilir.
