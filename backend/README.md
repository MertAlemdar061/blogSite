# Blog Backend (Nest.js + Prisma + PostgreSQL)

Teknoloji ve gündem blogu için kurumsal düzeyde, modüler REST API.

## Teknolojiler

- **Nest.js 10** — modüler backend framework
- **Prisma 5** — PostgreSQL ORM (tip güvenli)
- **JWT + Passport** — oturum doğrulama
- **bcryptjs** — şifre hashleme (tek yönlü)
- **class-validator** — DTO doğrulama
- **Guards** — `JwtAuthGuard` (kimlik) + `RolesGuard` (yetki)

## Kurulum

```bash
cd backend
npm install
cp .env.example .env      # değerleri doldurun (DATABASE_URL, JWT_SECRET ...)
npm run prisma:generate   # Prisma client üretir (internet gerekir)
npm run prisma:migrate    # şemayı veritabanına uygular
npm run prisma:seed       # admin + örnek içerik ekler
npm run start:dev         # http://localhost:3000/api
```

> Not: `prisma:generate` Prisma engine'lerini indirir; kısıtlı ağlarda
> internet erişimi olan bir ortamda çalıştırın.

## API Uç Noktaları

Tüm yollar `/api` ön ekiyle başlar.

### Auth
| Method | Yol | Açıklama | Koruma |
|---|---|---|---|
| POST | `/auth/register` | Yazar kaydı | Açık |
| POST | `/auth/login` | Giriş, JWT döner | Açık |
| GET | `/auth/me` | Mevcut kullanıcı | JWT |

### Posts
| Method | Yol | Açıklama | Koruma |
|---|---|---|---|
| GET | `/posts` | Yayınlanmış yazılar (sayfalama, filtre) | Açık |
| GET | `/posts/slug/:slug` | Tek yazı (görüntülenmeyi artırır) | Açık |
| GET | `/posts/admin/all` | Tüm yazılar (taslak dahil) | JWT |
| GET | `/posts/admin/:id` | Düzenleme için yazı | JWT |
| POST | `/posts` | Yeni yazı | JWT |
| PATCH | `/posts/:id` | Güncelle | JWT (sahip/admin) |
| DELETE | `/posts/:id` | Sil | JWT (sahip/admin) |

`GET /posts` sorgu parametreleri: `page`, `limit`, `category` (slug), `tag` (slug), `search`.

### Categories & Tags
| Method | Yol | Koruma |
|---|---|---|
| GET | `/categories` · `/tags` | Açık |
| POST/PATCH/DELETE | `/categories` | JWT + ADMIN |
| POST | `/tags` | JWT + ADMIN/AUTHOR |
| DELETE | `/tags/:id` | JWT + ADMIN |

### Users
| Method | Yol | Koruma |
|---|---|---|
| GET | `/users` | JWT + ADMIN |
| GET | `/users/:id` | Açık (genel profil) |

## Veri Modeli

`User` (Role: ADMIN/AUTHOR) · `Post` (Status: DRAFT/PUBLISHED) · `Category` · `Tag`
(Post ↔ Tag çoka-çok, Post → Category çoka-bir, Post → User çoka-bir).

## Dağıtım (Render)

1. PostgreSQL veritabanı oluşturun (Render / Neon / Supabase).
2. Web Service: Build `npm install && npm run prisma:generate && npm run build`,
   Start `npm run prisma:deploy && npm run start:prod`.
3. Ortam değişkenleri: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (Vercel URL'si).
