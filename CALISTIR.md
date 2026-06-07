# Yerelde Çalıştırma Rehberi

Bilgisayarında **Docker Desktop** ve **Node.js** (v18+) kurulu olmalı.
Kontrol: bir terminal aç ve `node -v` yaz. Sürüm görünüyorsa hazırsın.
(Görünmüyorsa https://nodejs.org adresinden "LTS" sürümünü kur.)

> Komutları PowerShell'de çalıştırabilirsin. Her bloğu sırayla, satır satır çalıştır.

---

## 1) Veritabanını başlat (Docker)

`blogSite` klasöründe bir terminal aç:

```powershell
cd C:\Users\orimr\Desktop\blogSite
docker compose up -d
```

`blog-postgres` konteyneri çalışmaya başlar (Docker Desktop'ta görünür).

## 2) Backend'i başlat

Aynı veya yeni terminalde:

```powershell
cd C:\Users\orimr\Desktop\blogSite\backend
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run start:dev
```

Son komut çalışınca şunu görmelisin:
`🚀 Backend çalışıyor: http://localhost:3000/api`
**Bu terminali açık bırak.**

## 3) Frontend'i başlat

**Yeni bir terminal** aç:

```powershell
cd C:\Users\orimr\Desktop\blogSite\frontend
npm install
npm run dev
```

`http://localhost:5173` adresi görünecek.

## 4) Siteyi aç

Tarayıcıda: **http://localhost:5173**

- Anasayfada seed ile eklenen örnek yazıyı görürsün.
- Yönetim paneli: **http://localhost:5173/login**
  - E-posta: `admin@blog.com`
  - Şifre: `Admin123!`
- Panelden yeni yazı oluştur, TipTap editörüyle yaz, "Yayında" yapıp kaydet —
  anasayfada anında görünür.

---

## Durdurma

- Backend/frontend terminallerinde `Ctrl + C`.
- Veritabanını durdur: `docker compose down` (verileri korur).
- Verileri de silmek için: `docker compose down -v`.

## Sık karşılaşılan sorunlar

- **`docker compose` bulunamadı**: Docker Desktop açık mı? Bir kez başlatıp tekrar dene.
- **Port 5432 dolu**: Bilgisayarında başka bir Postgres çalışıyor olabilir.
  `docker-compose.yml`'de `"5432:5432"` yerine `"5433:5432"` yap ve
  `backend/.env`'de portu `5433` olarak güncelle.
- **`npm install` çok yavaş**: İlk seferde normaldir; bitmesini bekle.
- **Backend "Can't reach database"**: 1. adımdaki Docker konteynerinin
  çalıştığından emin ol.
```
