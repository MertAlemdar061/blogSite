import api from './client';
import type { Post, PaginatedPosts, PostInput } from '../types';

export interface PostQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}

export const postsApi = {
  list: async (query: PostQuery = {}): Promise<PaginatedPosts> => {
    const { data } = await api.get<PaginatedPosts>('/posts', { params: query });
    return data;
  },

  getBySlug: async (slug: string): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/slug/${slug}`);
    return data;
  },

  adminList: async (): Promise<Post[]> => {
    const { data } = await api.get<Post[]>('/posts/admin/all');
    return data;
  },

  adminGet: async (id: string): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/admin/${id}`);
    return data;
  },

  create: async (input: PostInput): Promise<Post> => {
    const { data } = await api.post<Post>('/posts', input);
    return data;
  },

  update: async (id: string, input: Partial<PostInput>): Promise<Post> => {
    const { data } = await api.patch<Post>(`/posts/${id}`, input);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
