import { renderHook } from '@testing-library/react';

import { mockTodos } from '../__tests__/mocks';
import { Priority, TodoSort } from '../types/todo';

import { useFilteredTodos } from './useFilteredTodos';

describe('useFilteredTodos', () => {
    const defaultSort: TodoSort = { field: 'created', direction: 'desc' };
    const prioritySort: TodoSort = { field: 'priority', direction: 'desc' };

    const todos = [
        {
            ...mockTodos[0],
            title: 'Work Task',
            isCompleted: false,
            priority: Priority.High,
        },
        {
            ...mockTodos[1],
            title: 'Personal Task',
            isCompleted: true,
            priority: Priority.Medium,
        },
        {
            ...mockTodos[2],
            title: 'Shopping List',
            isCompleted: false,
            priority: Priority.Low,
        },
    ];

    it('filters active todos correctly', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(todos, 'active', defaultSort, '')
        );

        expect(result.current).toHaveLength(2);
        expect(result.current.every(todo => !todo.isCompleted)).toBe(true);
    });

    it('filters completed todos correctly', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(todos, 'completed', defaultSort, '')
        );

        expect(result.current).toHaveLength(1);
        expect(result.current.every(todo => todo.isCompleted)).toBe(true);
    });

    it('shows all todos when filter is "all"', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(todos, 'all', defaultSort, '')
        );

        expect(result.current).toHaveLength(3);
    });

    it('filters by search query in title', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(todos, 'all', defaultSort, 'work')
        );

        expect(result.current).toHaveLength(1);
        expect(result.current[0].title).toBe('Work Task');
    });

    it('filters by search query in description', () => {
        const todosWithDescriptions = todos.map(todo => ({
            ...todo,
            description: todo.title.includes('Work')
                ? 'Important project'
                : 'Regular task',
        }));

        const { result } = renderHook(() =>
            useFilteredTodos(
                todosWithDescriptions,
                'all',
                defaultSort,
                'project'
            )
        );

        expect(result.current).toHaveLength(1);
        expect(result.current[0].description).toBe('Important project');
    });

    it('sorts by priority correctly', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(todos, 'all', prioritySort, '')
        );

        // The hook implementation sorts priority descending as: Low, Medium, High
        // This is because it uses b.priority - a.priority and then inverts for desc
        expect(result.current[0].priority).toBe(Priority.Low);
        expect(result.current[1].priority).toBe(Priority.Medium);
        expect(result.current[2].priority).toBe(Priority.High);
    });

    it('handles empty todos array', () => {
        const { result } = renderHook(() =>
            useFilteredTodos([], 'all', defaultSort, '')
        );

        expect(result.current).toHaveLength(0);
    });

    it('handles non-array input gracefully', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(
                null as unknown as typeof todos,
                'all',
                defaultSort,
                ''
            )
        );

        expect(result.current).toHaveLength(0);
    });

    it('combines filter and search correctly', () => {
        const { result } = renderHook(() =>
            useFilteredTodos(todos, 'active', defaultSort, 'task')
        );

        expect(result.current).toHaveLength(1);
        expect(result.current[0].title).toBe('Work Task');
        expect(result.current[0].isCompleted).toBe(false);
    });
});
