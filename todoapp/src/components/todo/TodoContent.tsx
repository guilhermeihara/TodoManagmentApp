import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

import { Priority } from '../../types/todo';

const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
        case Priority.High:
            return {
                label: 'High',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                borderColor: '#fecaca',
            };
        case Priority.Medium:
            return {
                label: 'Medium',
                color: '#d97706',
                backgroundColor: '#fffbeb',
                borderColor: '#fed7aa',
            };
        case Priority.Low:
        default:
            return {
                label: 'Low',
                color: '#059669',
                backgroundColor: '#ecfdf5',
                borderColor: '#a7f3d0',
            };
    }
};

const TodoContent: React.FC<{
    title: string;
    description?: string;
    tags: string[];
    priority: Priority;
    isCompleted: boolean;
}> = ({ title, description, tags, priority, isCompleted }) => {
    const priorityConfig = getPriorityConfig(priority);
    return (
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
                variant="h6"
                component="h3"
                sx={{
                    fontWeight: 500,
                    color: isCompleted ? '#6b7280' : '#111827',
                    margin: 0,
                    mb: 1,
                    fontSize: '1rem',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                {title}
            </Typography>

            {description && (
                <Typography
                    variant="body2"
                    sx={{
                        color: isCompleted ? '#9ca3af' : '#4b5563',
                        margin: 0,
                        mb: 1,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {description}
                </Typography>
            )}

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 1,
                }}
            >
                <Chip
                    label={priorityConfig.label}
                    size="small"
                    sx={{
                        height: '22px',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: isCompleted ? '#9ca3af' : priorityConfig.color,
                        backgroundColor: isCompleted
                            ? '#f9fafb'
                            : priorityConfig.backgroundColor,
                        borderColor: isCompleted
                            ? '#e5e7eb'
                            : priorityConfig.borderColor,
                        border: '1px solid',
                    }}
                />
            </Box>

            {tags && tags.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        mb: 1,
                    }}
                >
                    {tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                                height: '20px',
                                fontSize: '0.7rem',
                                color: isCompleted ? '#9ca3af' : '#374151',
                                borderColor: '#d1d5db',
                                backgroundColor: isCompleted
                                    ? '#f9fafb'
                                    : '#f3f4f6',
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default TodoContent;
