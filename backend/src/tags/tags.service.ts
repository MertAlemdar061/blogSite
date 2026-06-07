import { Injectable, NotFoundException } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slugify';

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  name: string;
}

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  create(dto: CreateTagDto) {
    return this.prisma.tag.create({
      data: { name: dto.name, slug: slugify(dto.name) },
    });
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) throw new NotFoundException('Etiket bulunamadı.');
    await this.prisma.tag.delete({ where: { id } });
    return { success: true };
  }
}
