import { useMemo } from 'react';

import { Todo } from '../../types/todo';

export interface TodoStats {
    total: number;
    completed: number;
    active: number;
}

export const useTodoStats = (todos: Todo[]): TodoStats =>
    useMemo(() => {
        const todoList: Todo[] = Array.isArray(todos) ? todos : [];
        const total = todoList.length;
        const completed = todoList.filter(
            (todo: Todo) => todo.isCompleted
        ).length;
        const active = total - completed;
        return { total, completed, active };
    }, [todos]);
