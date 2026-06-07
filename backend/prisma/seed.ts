import { PrismaClient, Role, PostStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string): string {
  const map: Record<string, string> = {
    ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
    Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
  };
  return text
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@blog.com';
  const password = process.env.ADMIN_PASSWORD ?? 'Admin123!';
  const name = process.env.ADMIN_NAME ?? 'Site Yöneticisi';

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      name,
      role: Role.ADMIN,
      bio: 'Teknoloji ve gündem editörü.',
    },
  });
  console.log(`Admin hazır: ${admin.email}`);

  const categories = ['Teknoloji', 'Gündem', 'Yapay Zeka', 'Yazılım'];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(c) },
      update: {},
      create: { name: c, slug: slugify(c) },
    });
  }
  console.log(`Kategoriler hazır: ${categories.join(', ')}`);

  const tags = ['javascript', 'react', 'nestjs', 'haber', 'inceleme'];
  for (const t of tags) {
    await prisma.tag.upsert({
      where: { slug: slugify(t) },
      update: {},
      create: { name: t, slug: slugify(t) },
    });
  }
  console.log(`Etiketler hazır: ${tags.join(', ')}`);

  const tech = await prisma.category.findUnique({ where: { slug: slugify('Teknoloji') } });
  const reactTag = await prisma.tag.findUnique({ where: { slug: 'react' } });

  const sampleTitle = 'Modern Web Geliştirmede TypeScript Neden Önemli?';
  await prisma.post.upsert({
    where: { slug: slugify(sampleTitle) },
    update: {},
    create: {
      title: sampleTitle,
      slug: slugify(sampleTitle),
      excerpt: 'Uçtan uca tip güvenliğinin getirdiği avantajlara kısa bir bakış.',
      content:
        '<h2>Giriş</h2><p>TypeScript, büyük ölçekli projelerde hata oranını ciddi şekilde azaltır.</p><p>Bu yazıda tip güvenliğinin pratik faydalarını ele alıyoruz.</p>',
      status: PostStatus.PUBLISHED,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: tech?.id,
      tags: reactTag ? { connect: [{ id: reactTag.id }] } : undefined,
    },
  });
  console.log('Örnek yazı eklendi.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
