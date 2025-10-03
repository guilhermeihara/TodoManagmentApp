import { renderHook } from '@testing-library/react';

import { mockTodos } from '../../__tests__/mocks';

import { useTodoStats } from './TodoStats';

describe('useTodoStats', () => {
    it('calculates stats correctly with mixed todos', () => {
        const { result } = renderHook(() => useTodoStats(mockTodos));

        expect(result.current.total).toBe(3);
        expect(result.current.active).toBe(2);
        expect(result.current.completed).toBe(1);
    });

    it('handles empty array', () => {
        const { result } = renderHook(() => useTodoStats([]));

        expect(result.current.total).toBe(0);
        expect(result.current.active).toBe(0);
        expect(result.current.completed).toBe(0);
    });

    it('handles all completed todos', () => {
        const completedTodos = mockTodos.map(todo => ({
            ...todo,
            isCompleted: true,
        }));

        const { result } = renderHook(() => useTodoStats(completedTodos));

        expect(result.current.total).toBe(3);
        expect(result.current.active).toBe(0);
        expect(result.current.completed).toBe(3);
    });

    it('handles all active todos', () => {
        const activeTodos = mockTodos.map(todo => ({
            ...todo,
            isCompleted: false,
        }));

        const { result } = renderHook(() => useTodoStats(activeTodos));

        expect(result.current.total).toBe(3);
        expect(result.current.active).toBe(3);
        expect(result.current.completed).toBe(0);
    });

    it('handles non-array input gracefully', () => {
        const { result } = renderHook(() => useTodoStats([]));

        expect(result.current.total).toBe(0);
        expect(result.current.active).toBe(0);
        expect(result.current.completed).toBe(0);
    });
});
