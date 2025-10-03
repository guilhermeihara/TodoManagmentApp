import { Box, IconButton } from '@mui/material';
import { EditIcon, TrashIcon } from 'lucide-react';
import React from 'react';

interface TodoActionsProps {
    onEdit: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
    isVisible?: boolean;
}

const TodoActions: React.FC<TodoActionsProps> = ({
    onEdit,
    onDelete,
    isDeleting = false,
    isVisible = true,
}) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
        }}
    >
        <IconButton
            onClick={onEdit}
            size="small"
            title="Edit todo"
            sx={{
                width: 32,
                height: 32,
                color: '#6b7280',
                '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                },
            }}
        >
            <EditIcon size={16} />
        </IconButton>

        <IconButton
            onClick={onDelete}
            disabled={isDeleting}
            size="small"
            title="Delete todo"
            sx={{
                width: 32,
                height: 32,
                color: '#dc2626',
                opacity: isDeleting ? 0.5 : 1,
                '&:hover:not(:disabled)': {
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                },
                '&:disabled': {
                    cursor: 'not-allowed',
                },
            }}
        >
            <TrashIcon size={16} />
        </IconButton>
    </Box>
);

export default TodoActions;
