import api from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  register: async (input: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', input);
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};
