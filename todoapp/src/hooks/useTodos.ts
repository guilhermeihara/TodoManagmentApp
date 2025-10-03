import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { todoApi } from '../api/todoApi';
import { CreateTodo, Todo, UpdateTodo } from '../types/todo';

export const todoKeys = {
    all: ['todos'] as const,
    lists: () => [...todoKeys.all, 'list'] as const,
    list: (filters: string) => [...todoKeys.lists(), filters] as const,
    details: () => [...todoKeys.all, 'detail'] as const,
    detail: (id: number) => [...todoKeys.details(), id] as const,
};

export const useTodos = () =>
    useQuery({
        queryKey: todoKeys.lists(),
        queryFn: () => todoApi.getTodos(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });

export const useTodo = (id: number) =>
    useQuery({
        queryKey: todoKeys.detail(id),
        queryFn: () => todoApi.getTodo(id),
        enabled: !!id,
    });

export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todo: CreateTodo) => {
            console.log('Creating todo:', todo);
            return todoApi.createTodo(todo);
        },
        onSuccess: newTodo => {
            queryClient.setQueryData<Todo[]>(todoKeys.lists(), oldTodos =>
                oldTodos ? [...oldTodos, newTodo] : [newTodo]
            );
            toast.success('Todo created successfully!');
        },
        onError: error => {
            console.error('Error creating todo:', error);
            toast.error('Failed to create todo. Please try again.');
        },
    });
};

export const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, todo }: { id: number; todo: UpdateTodo }) =>
            todoApi.updateTodo(id, todo),
        onSuccess: (updatedTodo, variables) => {
            queryClient.setQueryData<Todo[]>(todoKeys.lists(), oldTodos => {
                if (!oldTodos) return [updatedTodo];

                return oldTodos.map(todo =>
                    todo.id === variables.id ? updatedTodo : todo
                );
            });

            queryClient.setQueryData(
                todoKeys.detail(variables.id),
                updatedTodo
            );

            toast.success('Todo updated successfully!');
        },
        onError: error => {
            console.error('Error updating todo:', error);
            toast.error('Failed to update todo. Please try again.');
        },
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => todoApi.deleteTodo(id),
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({
                queryKey: todoKeys.lists(),
            });

            const previousTodos = queryClient.getQueryData<Todo[]>(
                todoKeys.lists()
            );

            queryClient.setQueryData<Todo[]>(todoKeys.lists(), oldTodos =>
                oldTodos ? oldTodos.filter(todo => todo.id !== id) : []
            );

            return { previousTodos };
        },
        onError: (error, _, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    todoKeys.lists(),
                    context.previousTodos
                );
            }
            console.error('Error deleting todo:', error);
            toast.error('Failed to delete todo. Please try again.');
        },
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
            toast.success('Todo deleted successfully!');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
};

export const useToggleTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todo: Todo) => todoApi.toggleTodo(todo),
        onMutate: async (todo: Todo) => {
            await queryClient.cancelQueries({
                queryKey: todoKeys.lists(),
            });

            const previousTodos = queryClient.getQueryData<Todo[]>(
                todoKeys.lists()
            );

            queryClient.setQueryData<Todo[]>(todoKeys.lists(), oldTodos => {
                if (!oldTodos) return [];

                return oldTodos.map(t =>
                    t.id === todo.id
                        ? {
                              ...t,
                              isCompleted: !t.isCompleted,
                              completedAt: !t.isCompleted
                                  ? new Date().toISOString()
                                  : null,
                          }
                        : t
                );
            });

            return { previousTodos };
        },
        onError: (error, _, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(
                    todoKeys.lists(),
                    context.previousTodos
                );
            }
            console.error('Error toggling todo:', error);
            toast.error('Failed to update todo. Please try again.');
        },
        onSuccess: updatedTodo => {
            toast.success(
                `Todo marked as ${updatedTodo.isCompleted ? 'completed' : 'active'}!`
            );
        },
    });
};

export const useBulkDeleteTodos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (todoIds: number[]) => {
            await Promise.all(todoIds.map(id => todoApi.deleteTodo(id)));
        },
        onSuccess: (_, deletedIds) => {
            queryClient.setQueryData<Todo[]>(todoKeys.lists(), oldTodos =>
                oldTodos
                    ? oldTodos.filter(todo => !deletedIds.includes(todo.id))
                    : []
            );

            deletedIds.forEach(id => {
                queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
            });

            toast.success(`${deletedIds.length} todos deleted successfully!`);
        },
        onError: error => {
            console.error('Error bulk deleting todos:', error);
            toast.error('Failed to delete todos. Please try again.');
        },
    });
};
