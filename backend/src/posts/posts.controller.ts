import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ---- Public uç noktaları ----

  @Get()
  findPublished(@Query() query: QueryPostsDto) {
    return this.postsService.findPublished(query);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  // ---- Korumalı (yönetim) uç noktaları ----

  @UseGuards(JwtAuthGuard)
  @Get('admin/all')
  findAllForAdmin(@CurrentUser() user: AuthUser) {
    return this.postsService.findAllForAdmin(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  findOneForEdit(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.postsService.findOneForEdit(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.postsService.update(id, dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.postsService.remove(id, user);
  }
}
