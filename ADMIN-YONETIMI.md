# Admin Kullanıcı Yönetimi

Admin eklemek, silmek, şifre sıfırlamak için iki yöntem var.
Her ikisi için de **Docker veritabanının çalışıyor olması** yeterli
(backend sunucusunun açık olması gerekmez).

Komutları **yeni bir terminalde**, backend klasöründe çalıştır:

```powershell
cd C:\Users\orimr\Desktop\blogSite\backend
```

---

## Yöntem 1 — Komutlar (önerilen)

### Kullanıcıları listele
```powershell
npm run admin:list
```

### Yeni admin ekle
```powershell
npm run admin:create -- "yeni@ornek.com" "Sifre123" "Ad Soyad"
```
> Baştaki `--` zorunludur. Şifre en az 6 karakter olmalı.

### Var olan admin'in şifresini değiştir (sıfırla)
Aynı e-postayla `admin:create` çalıştır — şifre güncellenir:
```powershell
npm run admin:create -- "admin@blog.com" "YeniSifre123" "Site Yöneticisi"
```

### Kullanıcı sil
```powershell
npm run admin:delete -- "eski@ornek.com"
```
> Güvenlik: son admin silinemez (önce yeni admin oluştur). Bir kullanıcı
> silinince o kişinin yazıları da silinir.

---

## Yöntem 2 — Görsel editör (Prisma Studio)

```powershell
npm run prisma:studio
```
Tarayıcıda `http://localhost:5555` açılır. `User` tablosundan satırları
görüntüleyeb, düzenleyebilir, silebilirsin.

> Not: Şifreler veritabanında şifrelenmiş (hash) tutulur. Studio'dan düz
> metin şifre yazmak işe yaramaz — **şifre belirlemek/değiştirmek için
> mutlaka `admin:create` komutunu kullan.**

---

## Roller

- **ADMIN**: her şeyi yönetir (yazılar, kategoriler, kullanıcılar).
- **AUTHOR**: yalnızca kendi yazılarını yönetir.

Sitedeki kayıt ekranı (`/register` API'si) güvenlik gereği yalnızca AUTHOR
oluşturur. Admin yetkisi vermek için yukarıdaki `admin:create` komutunu kullan.
