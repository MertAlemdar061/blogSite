export type Role = 'ADMIN' | 'AUTHOR';
export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  bio?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { posts: number };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  viewCount: number;
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  category?: Pick<Category, 'id' | 'name' | 'slug'> | null;
  tags: Pick<Tag, 'id' | 'name' | 'slug'>[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedPosts {
  items: Post[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PostInput {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  categoryId?: string;
  tagIds?: string[];
}
