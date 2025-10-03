import { z } from 'zod';

export enum Priority {
    Low = 0,
    Medium = 1,
    High = 2,
}

export const TodoSchema = z.object({
    id: z.number(),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(1000, 'Description too long'),
    isCompleted: z.boolean(),
    createdAt: z.string(),
    completedAt: z.string().nullable(),
    userId: z.string(),
    priority: z.enum(Priority),
    dueDate: z.string().nullable(),
    tags: z.array(z.string()),
    isArchived: z.boolean(),
    archivedAt: z.string().nullable(),
});

export const CreateTodoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(1000, 'Description too long'),
    priority: z.enum(Priority),
    dueDate: z.string().nullable().optional(),
    tags: z.array(z.string()),
});

export const UpdateTodoSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(1000, 'Description too long'),
    isCompleted: z.boolean(),
    priority: z.enum(Priority),
    dueDate: z.string().nullable(),
    tags: z.array(z.string()),
});

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodo = z.infer<typeof CreateTodoSchema>;
export type UpdateTodo = z.infer<typeof UpdateTodoSchema>;

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodoSortField =
    | 'created'
    | 'title'
    | 'completed'
    | 'priority'
    | 'dueDate';

export type TodoSortDirection = 'asc' | 'desc';

export type TodoSort = {
    field: TodoSortField;
    direction: TodoSortDirection;
};

export interface TodoStats {
    total: number;
    completed: number;
    active: number;
    highPriority: number;
    overdue: number;
    completedToday: number;
}
