import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

import { useFilteredTodos } from '../../hooks/useFilteredTodos';
import { useTodos } from '../../hooks/useTodos';
import { Todo, TodoFilter, TodoSort } from '../../types/todo';

import TodoFilters from './TodoFilters';
import TodoListContent from './TodoListContent';
import TodoListHeader from './TodoListHeader';
import { useTodoStats } from './TodoStats';

const TodoList: React.FC<{
    onEditTodo?: (todo: Todo) => void;
}> = ({ onEditTodo }) => {
    const { data: todos = [], isLoading, error, refetch } = useTodos();
    const [filter, setFilter] = useState<TodoFilter>('all');
    const [sort, setSort] = useState<TodoSort>({
        field: 'created',
        direction: 'desc',
    });
    const [searchQuery, setSearchQuery] = useState('');

    const stats = useTodoStats(todos);
    const filteredAndSortedTodos = useFilteredTodos(
        todos,
        filter,
        sort,
        searchQuery
    );

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 6 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="h6" component="p" sx={{ mb: 1 }}>
                        Error loading todos
                    </Typography>
                    <Typography variant="body2">
                        {(error as Error).message}
                    </Typography>
                </Alert>
                <Button onClick={() => refetch()} variant="contained">
                    Try Again
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TodoListHeader
                stats={stats}
                filteredCount={filteredAndSortedTodos.length}
            />

            <Card>
                <CardContent sx={{ p: 3 }}>
                    <TodoFilters
                        filter={filter}
                        sort={sort}
                        onFilterChange={setFilter}
                        onSortChange={setSort}
                        onSearchChange={setSearchQuery}
                    />
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TodoListContent
                    todos={todos}
                    filteredTodos={filteredAndSortedTodos}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    filter={filter}
                    onEditTodo={onEditTodo}
                />
            </Box>
        </Box>
    );
};

export default TodoList;
