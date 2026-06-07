/**
 * Bir kullanıcıyı e-posta ile siler. (O kullanıcının yazıları da silinir.)
 *
 * Kullanım:
 *   npm run admin:delete -- "email@ornek.com"
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [email] = process.argv.slice(2);

  if (!email) {
    console.error('❌ E-posta gerekli.\n   Kullanım: npm run admin:delete -- "email@ornek.com"');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`❌ "${email}" adresli kullanıcı bulunamadı.`);
    process.exit(1);
  }

  const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
  if (user.role === 'ADMIN' && adminCount <= 1) {
    console.error(
      '⚠️  Bu son admin. Silmeden önce başka bir admin oluştur:\n   npm run admin:create -- "yeni@ornek.com" "Sifre123" "Ad"',
    );
    process.exit(1);
  }

  await prisma.user.delete({ where: { email } });
  console.log(`✅ "${email}" silindi.`);
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e.message ?? e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
