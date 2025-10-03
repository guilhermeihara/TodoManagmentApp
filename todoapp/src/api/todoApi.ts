import { CreateTodo, Todo, UpdateTodo } from '../types/todo';

import { apiClient } from './apiClient';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    lastLoginAt?: string;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    expiresAt: string;
    user: User;
}

export const todoApi = {
    getTodos: async (params?: {
        isCompleted?: boolean;
        priority?: string;
        dueBefore?: string;
        createdAfter?: string;
        tags?: string;
        includeArchived?: boolean;
    }): Promise<Todo[]> => {
        const { data } = await apiClient.get<Todo[]>('/api/todos', { params });
        return data;
    },

    getTodo: async (id: number): Promise<Todo> => {
        const { data } = await apiClient.get<Todo>(`/api/todos/${id}`);
        return data;
    },

    createTodo: async (todo: CreateTodo): Promise<Todo> => {
        const { data } = await apiClient.post<Todo>('/api/todos', todo);
        return data;
    },

    updateTodo: async (id: number, todo: UpdateTodo): Promise<Todo> => {
        const { data } = await apiClient.put<Todo>(`/api/todos/${id}`, todo);
        return data;
    },

    toggleTodo: async (todo: Todo): Promise<Todo> => {
        const updatedTodo: UpdateTodo = {
            title: todo.title,
            description: todo.description,
            isCompleted: !todo.isCompleted,
            priority: todo.priority,
            dueDate: todo.dueDate,
            tags: todo.tags,
        };
        return todoApi.updateTodo(todo.id, updatedTodo);
    },

    deleteTodo: async (id: number): Promise<void> =>
        apiClient.delete(`/api/todos/${id}`),

    archiveTodo: async (id: number): Promise<void> =>
        apiClient.post(`/api/todos/${id}/archive`),

    restoreTodo: async (id: number): Promise<void> =>
        apiClient.post(`/api/todos/${id}/restore`),

    getStats: async (): Promise<{
        total: number;
        completed: number;
        active: number;
        highPriority: number;
        overdue: number;
        completedToday: number;
    }> => {
        const { data } = await apiClient.get('/api/todos/stats');
        return data;
    },
};
