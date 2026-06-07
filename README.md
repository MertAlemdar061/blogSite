# TeknoGündem — Teknoloji ve Gündem Blogu

Uçtan uca TypeScript tip güvenliği sağlayan, tam yığın (full-stack) modern blog
uygulaması. Ziyaretçi arayüzü + güvenli yönetim paneli.

```
blogSite/
├── backend/     Nest.js + Prisma + PostgreSQL REST API
└── frontend/    Vite + React + MUI + TipTap SPA
```

## Mimari

| Katman | Teknoloji |
|---|---|
| Frontend | Vite, React 18, TypeScript, Material-UI, React Query, React Router, TipTap |
| Backend | Nest.js 10, TypeScript, Prisma ORM, class-validator |
| Veritabanı | PostgreSQL (bulut tabanlı) |
| Kimlik/Yetki | JWT (Passport), bcryptjs, Nest.js Guards (rol bazlı) |
| Dağıtım | Backend → Render · Frontend → Vercel · Özel alan adı (DNS) |

```
[Ziyaretçi/Yazar] → Vercel (React SPA) → Render (Nest.js API) → PostgreSQL
                                              JWT + Guards ile korumalı
```

## Hızlı Başlangıç (Yerel)

İki terminal açın.

**1) Backend**
```bash
cd backend
npm install
cp .env.example .env          # DATABASE_URL, JWT_SECRET doldurun
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed           # admin + örnek içerik
npm run start:dev             # http://localhost:3000/api
```

**2) Frontend**
```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL=http://localhost:3000/api
npm run dev                   # http://localhost:5173
```

Seed sonrası varsayılan giriş: `.env`'de tanımladığınız `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(örnek: `admin@blog.com` / `Admin123!`). `/login` üzerinden panele girin.

## Özellikler

- Responsive ziyaretçi arayüzü: anasayfa, arama, kategori/etiket filtreleri, yazı detayı
- Güvenli yönetim paneli: dashboard, yazı CRUD, kategori yönetimi
- TipTap zengin metin editörü (başlık, liste, alıntı, kod bloğu, bağlantı, görsel)
- JWT oturum + rol bazlı yetkilendirme (ADMIN / AUTHOR)
- Otomatik Türkçe-uyumlu slug, taslak/yayın durumu, görüntülenme sayacı, sayfalama

## Dağıtım

### 1. Veritabanı
Render PostgreSQL, Neon veya Supabase'de bir PostgreSQL örneği oluşturup
bağlantı dizesini (`DATABASE_URL`) alın.

### 2. Backend → Render
`backend/render.yaml` hazır. Render'da "New → Blueprint" ile repoyu bağlayın veya
Web Service oluşturup ortam değişkenlerini girin: `DATABASE_URL`, `JWT_SECRET`,
`CORS_ORIGIN` (Vercel alan adınız), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

### 3. Frontend → Vercel
Vercel'de projeyi içe aktarın, kök dizin `frontend`. Ortam değişkeni:
`VITE_API_URL = https://<render-app>.onrender.com/api`. `frontend/vercel.json`
SPA yönlendirmesini sağlar.

### 4. Özel Alan Adı (DNS)
Vercel proje ayarlarından alan adınızı ekleyin ve alan adı sağlayıcınızda
Vercel'in verdiği A / CNAME kayıtlarını tanımlayın. Backend için isterseniz
`api.alanadi.com` alt alan adını Render servisine yönlendirip frontend'in
`VITE_API_URL` değerini güncelleyin.

## Doğrulama Notları

- Backend: `nest build` → 0 TypeScript hatası, `dist/main.js` üretildi.
- Frontend: `tsc -b` → 0 hata, `vite build` → başarılı (`dist/`).
- Şifreleme için native derleme gerektirmeyen `bcryptjs` kullanıldı.
- Prisma client'ı yerel/CI ortamında `npm run prisma:generate` ile üretin
  (internet erişimi gerekir).
