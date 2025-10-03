import { Box, Card, CardContent } from '@mui/material';
import { parseISO } from 'date-fns';
import React, { useState } from 'react';

import { useDeleteTodo, useToggleTodo } from '../../hooks/useTodos';
import { Todo } from '../../types/todo';

import TodoActions from './TodoActions';
import TodoCheckbox from './TodoCheckbox';
import TodoContent from './TodoContent';
import TodoMetadata from './TodoMetadata';

const isOverdue = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    // Ensure the date string is treated as UTC
    const utcDateString = dueDate.endsWith('Z') ? dueDate : dueDate + 'Z';
    const dueDateLocal = parseISO(utcDateString);
    return dueDateLocal < new Date();
};

const TodoItem: React.FC<{
    todo: Todo;
    onEdit?: (todo: Todo) => void;
}> = ({ todo, onEdit }) => {
    const [isHovered, setIsHovered] = useState(false);

    const toggleTodoMutation = useToggleTodo();
    const deleteTodoMutation = useDeleteTodo();

    const handleToggle = () => {
        toggleTodoMutation.mutate(todo);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            deleteTodoMutation.mutate(todo.id);
        }
    };

    const handleEdit = () => {
        onEdit?.(todo);
    };

    const isItemOverdue = isOverdue(todo.dueDate) && !todo.isCompleted;

    return (
        <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                position: 'relative',
                backgroundColor: todo.isCompleted ? '#f9fafb' : 'white',
                border: isItemOverdue
                    ? '1px solid #ef4444'
                    : '1px solid #e5e7eb',
                borderRadius: 2,
                opacity: todo.isCompleted ? 0.75 : 1,
                transition: 'all 0.2s ease-in-out',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered ? 3 : 1,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    borderRadius: '8px 0 0 8px',
                    background: isItemOverdue
                        ? 'linear-gradient(to bottom, #ef4444, #dc2626)'
                        : 'linear-gradient(to bottom, #6366f1, #a855f7)',
                },
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            flex: 1,
                            minWidth: 0,
                        }}
                    >
                        <TodoCheckbox
                            isCompleted={todo.isCompleted}
                            onChange={handleToggle}
                            disabled={toggleTodoMutation.isPending}
                        />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TodoContent
                                title={todo.title}
                                description={todo.description}
                                tags={todo.tags}
                                isCompleted={todo.isCompleted}
                                priority={todo.priority}
                            />

                            <TodoMetadata
                                createdAt={todo.createdAt}
                                completedAt={todo.completedAt}
                                dueDate={todo.dueDate}
                                isCompleted={todo.isCompleted}
                            />
                        </Box>
                    </Box>
                    <TodoActions
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isDeleting={deleteTodoMutation.isPending}
                        isVisible={isHovered}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default React.memo(TodoItem);
