import {
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
  IsArray,
  IsUUID,
} from 'class-validator';
import { PostStatus } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  @MinLength(3, { message: 'Başlık en az 3 karakter olmalıdır.' })
  title: string;

  @IsString()
  @MinLength(1, { message: 'İçerik boş olamaz.' })
  content: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagIds?: string[];
}
