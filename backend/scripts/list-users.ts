/**
 * Tüm kullanıcıları listeler.
 *   npm run admin:list
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  if (users.length === 0) {
    console.log('Henüz kullanıcı yok.');
    return;
  }

  console.log(`\n${users.length} kullanıcı:\n`);
  for (const u of users) {
    console.log(`  [${u.role}]  ${u.email}  —  ${u.name}`);
  }
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e.message ?? e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
