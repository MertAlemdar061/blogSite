import api from './client';
import type { Category, Tag } from '../types';

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },
  create: async (input: { name: string; description?: string }): Promise<Category> => {
    const { data } = await api.post<Category>('/categories', input);
    return data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export const tagsApi = {
  list: async (): Promise<Tag[]> => {
    const { data } = await api.get<Tag[]>('/tags');
    return data;
  },
  create: async (input: { name: string }): Promise<Tag> => {
    const { data } = await api.post<Tag>('/tags', input);
    return data;
  },
};
