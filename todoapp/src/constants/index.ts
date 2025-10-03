import { TodoFilter, TodoSortField } from '../types/todo';

export const APP_CONFIG = {
    name: 'Todo Management App',
    version: '1.0.0',
    apiTimeout: 10000,
    debounceDelay: 300,
} as const;

export const FILTER_OPTIONS: {
    value: TodoFilter;
    label: string;
    description: string;
}[] = [
    { value: 'all', label: 'All', description: 'Show all todos' },
    { value: 'active', label: 'Active', description: 'Show incomplete todos' },
    {
        value: 'completed',
        label: 'Completed',
        description: 'Show completed todos',
    },
];

export const SORT_OPTIONS: { value: TodoSortField; label: string }[] = [
    { value: 'created', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'completed', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
];
