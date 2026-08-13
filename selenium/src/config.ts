/** Test yapılandırması — değerler ortam değişkenleriyle değiştirilebilir. */
export const config = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:5173',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@blog.com',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin123!',
  headless: process.env.HEADLESS === 'true',
  defaultTimeout: 10000,
};
