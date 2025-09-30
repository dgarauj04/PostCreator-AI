import { api } from './api';
import type { User, AuthResponse } from '../types/types';

export const authService = {
    async login(login_identifier: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/auth/login', { login_identifier, password });
        return response.data;
    },

    async register(email: string, password: string, username: string): Promise<AuthResponse> {
        const response = await api.post('/auth/register', { email, password, username });
        return response.data;
    },

    async verifyToken(token: string): Promise<User> {
        const response = await api.get('/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data.user;
    },

    async getUserPosts(token: string): Promise<any[]> {
        const response = await api.get('/posts', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    },

    async saveUserPosts(posts: any[], token: string): Promise<void> {
        await api.post('/posts', { posts }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }
};