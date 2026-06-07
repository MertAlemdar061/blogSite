/**
 * Yeni admin oluşturur VEYA var olan kullanıcının şifresini/rolünü günceller.
 *
 * Kullanım:
 *   npm run admin:create -- "email@ornek.com" "Sifre123" "Ad Soyad"
 *
 * E-posta zaten varsa: şifre + isim güncellenir ve rol ADMIN yapılır
 * (yani şifre sıfırlamak için de kullanılabilir).
 */
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password) {
    console.error(
      '❌ Eksik bilgi.\n   Kullanım: npm run admin:create -- "email@ornek.com" "Sifre123" "Ad Soyad"',
    );
    process.exit(1);
  }
  if (password.length < 6) {
    console.error('❌ Şifre en az 6 karakter olmalı.');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role: Role.ADMIN, ...(name ? { name } : {}) },
    create: {
      email,
      password: hashed,
      name: name || 'Yönetici',
      role: Role.ADMIN,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log('✅ Admin hazır:');
  console.log(`   E-posta: ${user.email}`);
  console.log(`   İsim:    ${user.name}`);
  console.log(`   Rol:     ${user.role}`);
  console.log('\nArtık /login üzerinden bu bilgilerle giriş yapabilirsin.');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e.message ?? e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
