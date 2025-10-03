import { useMemo } from 'react';

import { Todo, TodoFilter, TodoSort } from '../types/todo';

export const useFilteredTodos = (
    todos: Todo[],
    filter: TodoFilter,
    sort: TodoSort,
    searchQuery: string
) =>
    useMemo(() => {
        const todoList: Todo[] = Array.isArray(todos) ? todos : [];
        let filtered: Todo[] = todoList;

        switch (filter) {
            case 'active':
                filtered = todoList.filter((todo: Todo) => !todo.isCompleted);
                break;
            case 'completed':
                filtered = todoList.filter((todo: Todo) => todo.isCompleted);
                break;
            default:
                filtered = todoList;
        }

        if (searchQuery) {
            filtered = filtered.filter(
                (todo: Todo) =>
                    todo.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    todo.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        filtered.sort((a: Todo, b: Todo) => {
            let comparison = 0;

            switch (sort.field) {
                case 'dueDate':
                    if (a.dueDate && b.dueDate) {
                        comparison =
                            new Date(a.dueDate).getTime() -
                            new Date(b.dueDate).getTime();
                    } else if (a.dueDate) {
                        comparison = -1;
                    } else if (b.dueDate) {
                        comparison = 1;
                    } else {
                        comparison = 0;
                    }
                    break;
                case 'priority':
                    comparison = b.priority - a.priority;
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'completed':
                    comparison = Number(a.isCompleted) - Number(b.isCompleted);
                    break;
                case 'created':
                default:
                    comparison =
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime();
                    break;
            }

            return sort.direction === 'desc' ? -comparison : comparison;
        });

        return filtered;
    }, [todos, filter, sort, searchQuery]);
