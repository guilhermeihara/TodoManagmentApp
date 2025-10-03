import { Box, Typography } from '@mui/material';
import { parseISO } from 'date-fns';
import { AlertTriangleIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import React from 'react';

import { formatDateTime, getRelativeTime } from '../../lib/utils';

interface TodoMetadataProps {
    createdAt: string;
    completedAt?: string | null;
    dueDate?: string | null;
    isCompleted: boolean;
}

const isOverdue = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    const utcDateString = dueDate.endsWith('Z') ? dueDate : dueDate + 'Z';
    const dueDateLocal = parseISO(utcDateString);
    return dueDateLocal < new Date();
};

const TodoMetadata: React.FC<TodoMetadataProps> = ({
    createdAt,
    completedAt,
    dueDate,
    isCompleted,
}) => {
    const isItemOverdue = dueDate ? isOverdue(dueDate) && !isCompleted : false;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: '0.75rem',
                color: '#6b7280',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                }}
            >
                <CalendarIcon size={12} />
                <Typography variant="caption">
                    Created {getRelativeTime(createdAt)}
                </Typography>
            </Box>

            {completedAt && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <ClockIcon size={12} />
                    <Typography variant="caption">
                        Completed {getRelativeTime(completedAt)}
                    </Typography>
                </Box>
            )}

            {dueDate && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        color: isItemOverdue ? '#ef4444' : '#6b7280',
                    }}
                >
                    {isItemOverdue ? (
                        <AlertTriangleIcon size={12} />
                    ) : (
                        <ClockIcon size={12} />
                    )}
                    <Typography
                        variant="caption"
                        sx={{
                            color: isItemOverdue ? '#ef4444' : 'inherit',
                            fontWeight: isItemOverdue ? 600 : 400,
                            lineHeight: 1.3,
                        }}
                    >
                        {isItemOverdue ? 'Overdue: ' : 'Due: '}
                        {getRelativeTime(dueDate)}
                        <br />
                        <span
                            style={{
                                fontSize: '0.65rem',
                                opacity: 0.8,
                            }}
                        >
                            {formatDateTime(dueDate)}
                        </span>
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default TodoMetadata;
