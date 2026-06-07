# Blog Frontend (Vite + React + MUI + TipTap)

Teknoloji ve gündem blogunun ziyaretçi arayüzü ve yönetim paneli.

## Teknolojiler

- **Vite 5 + React 18 + TypeScript** — hızlı, tip güvenli SPA
- **Material-UI (MUI) 5** — responsive, temiz tipografili tasarım
- **TanStack React Query** — sunucu durumu / önbellek yönetimi
- **React Router 6** — yönlendirme (public + korumalı admin)
- **TipTap** — zengin metin editörü (başlık, liste, bağlantı, görsel, kod bloğu)
- **Axios** — JWT'yi otomatik ekleyen API istemcisi

## Kurulum

```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL değerini ayarlayın
npm run dev                # http://localhost:5173
npm run build              # üretim derlemesi (dist/)
```

## Yapı

```
src/
  api/          API istemcisi + uç nokta sarmalayıcıları (auth, posts, taxonomy)
  components/   PublicLayout, AdminLayout, PostCard, RichTextEditor, ProtectedRoute
  context/      AuthContext (JWT oturumu)
  pages/
    public/     HomePage, PostDetailPage, CategoryPage, NotFoundPage
    auth/       LoginPage
    admin/      DashboardPage, PostListPage, PostEditorPage, CategoriesPage
  types/        Paylaşılan TypeScript tipleri
  theme.ts      MUI teması
```

## Rotalar

| Rota | Açıklama | Erişim |
|---|---|---|
| `/` | Anasayfa (yazı listesi, arama, kategoriler) | Açık |
| `/yazi/:slug` | Yazı detayı | Açık |
| `/kategori/:slug` · `/etiket/:slug` | Filtrelenmiş liste | Açık |
| `/login` | Giriş | Açık |
| `/admin/*` | Yönetim paneli | JWT korumalı |

## Dağıtım (Vercel)

1. Vercel'de projeyi içe aktarın, kök dizin: `frontend`.
2. Ortam değişkeni: `VITE_API_URL` = Render backend URL'si (`https://.../api`).
3. Build: `npm run build`, Output: `dist`.
4. SPA yönlendirmesi için `vercel.json` ile tüm yolları `index.html`'e yönlendirin.
