import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma, PostStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { slugify } from '../common/utils/slugify';

const postInclude = {
  author: { select: { id: true, name: true, avatarUrl: true } },
  category: { select: { id: true, name: true, slug: true } },
  tags: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.PostInclude;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  private async generateUniqueSlug(title: string, ignoreId?: string) {
    const base = slugify(title) || 'yazi';
    let slug = base;
    let i = 1;
    while (true) {
      const existing = await this.prisma.post.findUnique({ where: { slug } });
      if (!existing || existing.id === ignoreId) break;
      slug = `${base}-${i++}`;
    }
    return slug;
  }

  async create(authorId: string, dto: CreatePostDto) {
    const slug = await this.generateUniqueSlug(dto.title);
    const isPublished = dto.status === PostStatus.PUBLISHED;

    return this.prisma.post.create({
      data: {
        title: dto.title,
        slug,
        content: dto.content,
        excerpt: dto.excerpt,
        coverImage: dto.coverImage,
        status: dto.status ?? PostStatus.DRAFT,
        publishedAt: isPublished ? new Date() : null,
        authorId,
        categoryId: dto.categoryId,
        tags: dto.tagIds?.length
          ? { connect: dto.tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: postInclude,
    });
  }

  /** Public listeleme - yalnızca yayınlanmış yazılar. */
  async findPublished(query: QueryPostsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {
      status: PostStatus.PUBLISHED,
      ...(query.category && { category: { slug: query.category } }),
      ...(query.tag && { tags: { some: { slug: query.tag } } }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' } },
          { excerpt: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Admin/yazar listesi - tüm yazılar (taslaklar dahil). */
  async findAllForAdmin(user: { id: string; role: string }) {
    const where: Prisma.PostWhereInput =
      user.role === Role.ADMIN ? {} : { authorId: user.id };
    return this.prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: postInclude,
    });
    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new NotFoundException('Yazı bulunamadı.');
    }
    await this.prisma.post.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });
    return post;
  }

  async findOneForEdit(id: string, user: { id: string; role: string }) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!post) throw new NotFoundException('Yazı bulunamadı.');
    this.assertOwnership(post.authorId, user);
    return post;
  }

  async update(id: string, dto: UpdatePostDto, user: { id: string; role: string }) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Yazı bulunamadı.');
    this.assertOwnership(post.authorId, user);

    const data: Prisma.PostUpdateInput = {
      title: dto.title,
      content: dto.content,
      excerpt: dto.excerpt,
      coverImage: dto.coverImage,
    };

    if (dto.title && dto.title !== post.title) {
      data.slug = await this.generateUniqueSlug(dto.title, id);
    }

    if (dto.status && dto.status !== post.status) {
      data.status = dto.status;
      data.publishedAt =
        dto.status === PostStatus.PUBLISHED
          ? (post.publishedAt ?? new Date())
          : null;
    }

    if (dto.categoryId !== undefined) {
      data.category = dto.categoryId
        ? { connect: { id: dto.categoryId } }
        : { disconnect: true };
    }

    if (dto.tagIds) {
      data.tags = { set: dto.tagIds.map((tid) => ({ id: tid })) };
    }

    return this.prisma.post.update({
      where: { id },
      data,
      include: postInclude,
    });
  }

  async remove(id: string, user: { id: string; role: string }) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Yazı bulunamadı.');
    this.assertOwnership(post.authorId, user);
    await this.prisma.post.delete({ where: { id } });
    return { success: true };
  }

  private assertOwnership(authorId: string, user: { id: string; role: string }) {
    if (user.role !== Role.ADMIN && authorId !== user.id) {
      throw new ForbiddenException('Bu yazı üzerinde yetkiniz yok.');
    }
  }
}
