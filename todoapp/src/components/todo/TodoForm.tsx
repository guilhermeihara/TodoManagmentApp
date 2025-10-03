import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Chip,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useCreateTodo } from '../../hooks/useTodos';
import { CreateTodo, CreateTodoSchema, Priority } from '../../types/todo';

const TodoForm: React.FC<{
    onSuccess?: () => void;
}> = ({ onSuccess }) => {
    const createTodoMutation = useCreateTodo();
    const [currentTag, setCurrentTag] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CreateTodo>({
        resolver: zodResolver(CreateTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            priority: Priority.Medium,
            dueDate: null,
            tags: [],
        },
    });

    const priority = watch('priority');
    const tags = watch('tags');

    const handleAddTag = (tagToAdd: string) => {
        const trimmedTag = tagToAdd.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setValue('tags', [...tags, trimmedTag]);
        }
        setCurrentTag('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setValue(
            'tags',
            tags.filter(tag => tag !== tagToRemove)
        );
    };

    const handleTagInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddTag(currentTag);
        }
    };

    const handleTagInputBlur = () => {
        if (currentTag.trim()) {
            handleAddTag(currentTag);
        }
    };

    const onSubmit = async (data: CreateTodo) => {
        try {
            await createTodoMutation.mutateAsync(data);
            reset();
            setCurrentTag('');
            onSuccess?.();
        } catch (error) {
            console.error('Failed to create todo:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PlusIcon size={20} color="#2563eb" />
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: '#111827' }}
                >
                    Add New Todo
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    {...register('title')}
                    label="Title"
                    placeholder="Enter todo title..."
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isSubmitting}
                    fullWidth
                    variant="outlined"
                />

                <TextField
                    {...register('description')}
                    label="Description"
                    placeholder="Enter todo description (optional)..."
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    disabled={isSubmitting}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                />

                <FormControl fullWidth error={!!errors.priority}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priority}
                        label="Priority"
                        onChange={e => {
                            setValue('priority', e.target.value as Priority);
                            console.log('priority', e.target.value as Priority);
                        }}
                        disabled={isSubmitting}
                    >
                        <MenuItem value={Priority.Low}>Low</MenuItem>
                        <MenuItem value={Priority.Medium}>Medium</MenuItem>
                        <MenuItem value={Priority.High}>High</MenuItem>
                    </Select>
                    {errors.priority && (
                        <FormHelperText>
                            {String(errors.priority?.message || '')}
                        </FormHelperText>
                    )}
                </FormControl>

                <TextField
                    {...register('dueDate', {
                        setValueAs: value =>
                            value ? new Date(value).toISOString() : null,
                    })}
                    type="datetime-local"
                    label="Due Date (Optional)"
                    error={!!errors.dueDate}
                    helperText={errors.dueDate?.message}
                    disabled={isSubmitting}
                    fullWidth
                    variant="outlined"
                    slotProps={{
                        inputLabel: {
                            shrink: true,
                        },
                    }}
                />

                <Box>
                    <TextField
                        label="Tags"
                        placeholder="Type and press Enter or comma to add tags..."
                        value={currentTag}
                        onChange={e => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        onBlur={handleTagInputBlur}
                        disabled={isSubmitting}
                        fullWidth
                        variant="outlined"
                        error={!!errors.tags}
                        helperText={
                            errors.tags?.message ||
                            'Press Enter or comma to add tags'
                        }
                    />
                    {tags.length > 0 && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                mt: 2,
                            }}
                        >
                            {tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleRemoveTag(tag)}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        '& .MuiChip-deleteIcon': {
                                            fontSize: '16px',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting || createTodoMutation.isPending}
                    fullWidth
                    sx={{
                        py: 1.5,
                        backgroundColor: '#4f46e5',
                        '&:hover': {
                            backgroundColor: '#4338ca',
                        },
                        '&:disabled': {
                            opacity: 0.6,
                        },
                    }}
                >
                    {isSubmitting || createTodoMutation.isPending
                        ? 'Adding...'
                        : 'Add Todo'}
                </Button>
            </Box>
        </Box>
    );
};

export default TodoForm;
