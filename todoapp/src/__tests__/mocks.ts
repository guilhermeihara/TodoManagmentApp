import { Priority, Todo } from '../types/todo';

export const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
};

export const mockTodos: Todo[] = [
    {
        id: 1,
        title: 'Test Todo 1',
        description: 'This is a test todo',
        isCompleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        completedAt: null,
        userId: '1',
        priority: Priority.High,
        dueDate: '2024-12-31',
        tags: ['work', 'urgent'],
        isArchived: false,
        archivedAt: null,
    },
    {
        id: 2,
        title: 'Completed Todo',
        description: 'This todo is completed',
        isCompleted: true,
        createdAt: '2024-01-01T00:00:00Z',
        completedAt: '2024-01-02T00:00:00Z',
        userId: '1',
        priority: Priority.Medium,
        dueDate: null,
        tags: ['personal'],
        isArchived: false,
        archivedAt: null,
    },
    {
        id: 3,
        title: 'Low Priority Todo',
        description: 'This is a low priority todo',
        isCompleted: false,
        createdAt: '2024-01-01T00:00:00Z',
        completedAt: null,
        userId: '1',
        priority: Priority.Low,
        dueDate: null,
        tags: [],
        isArchived: false,
        archivedAt: null,
    },
];

export const mockApiResponse = {
    data: mockTodos,
    success: true,
    message: 'Todos retrieved successfully',
};

// Mock handlers for API calls
export const mockTodoApi = {
    getTodos: jest.fn().mockResolvedValue(mockApiResponse),
    createTodo: jest.fn().mockImplementation(todo =>
        Promise.resolve({
            data: { ...todo, id: Date.now() },
            success: true,
        })
    ),
    updateTodo: jest.fn().mockImplementation((id, todo) =>
        Promise.resolve({
            data: { ...todo, id },
            success: true,
        })
    ),
    deleteTodo: jest.fn().mockResolvedValue({
        success: true,
    }),
};

export const mockAuthApi = {
    login: jest.fn().mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
    }),
    register: jest.fn().mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
    }),
    logout: jest.fn(),
    isAuthenticated: jest.fn().mockReturnValue(true),
    getCurrentUser: jest.fn().mockReturnValue(mockUser),
};
