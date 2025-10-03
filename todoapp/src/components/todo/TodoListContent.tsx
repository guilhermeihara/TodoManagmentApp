import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { Todo } from '../../types/todo';

import TodoEditModal from './TodoEditModal';
import TodoItem from './TodoItem';

const TodoListContent: React.FC<{
    todos: Todo[];
    filteredTodos: Todo[];
    isLoading: boolean;
    searchQuery: string;
    filter: string;
    onEditTodo?: (todo: Todo) => void;
}> = ({ todos, filteredTodos, isLoading, searchQuery, filter, onEditTodo }) => {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditTodo = useCallback(
        (todo: Todo) => {
            setEditingTodo(todo);
            setIsEditModalOpen(true);
            onEditTodo?.(todo);
        },
        [onEditTodo]
    );

    const handleCloseEditModal = useCallback(() => {
        setIsEditModalOpen(false);
        setEditingTodo(null);
    }, []);

    const renderTodoItem = useCallback(
        (_: number, todo: Todo) => (
            <Box key={todo.id} sx={{ mb: 1.5 }}>
                <TodoItem todo={todo} onEdit={handleEditTodo} />
            </Box>
        ),
        [handleEditTodo]
    );

    if (isLoading) {
        return (
            <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography color="text.secondary">
                        Loading todos...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (filteredTodos.length === 0) {
        return (
            <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary" variant="h6">
                        {searchQuery
                            ? 'No todos match your search.'
                            : filter === 'completed'
                              ? 'No completed todos yet.'
                              : filter === 'active'
                                ? 'No active todos. Great job!'
                                : 'No todos yet. Create your first one!'}
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing {filteredTodos.length} of{' '}
                {Array.isArray(todos) ? todos.length : 0} todos
            </Typography>
            <Box sx={{ height: '60vh', width: '100%' }}>
                <Virtuoso
                    data={filteredTodos}
                    itemContent={(index, todo) => renderTodoItem(index, todo)}
                    style={{ height: '100%' }}
                    components={{
                        List: React.forwardRef<
                            HTMLDivElement,
                            {
                                style?: React.CSSProperties;
                                children?: React.ReactNode;
                            }
                        >(({ style, children }, ref) => (
                            <div
                                ref={ref}
                                style={{
                                    ...style,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    paddingLeft: '4px',
                                    paddingRight: '4px',
                                }}
                            >
                                {children}
                            </div>
                        )),
                    }}
                />
            </Box>

            <TodoEditModal
                todo={editingTodo}
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
            />
        </>
    );
};

export default TodoListContent;
