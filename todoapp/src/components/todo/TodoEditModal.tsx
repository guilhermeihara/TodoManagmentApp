import { zodResolver } from '@hookform/resolvers/zod';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { PlusIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUpdateTodo } from '../../hooks/useTodos';
import { Priority, Todo, UpdateTodo, UpdateTodoSchema } from '../../types/todo';

interface TodoEditModalProps {
    todo: Todo | null;
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const TodoEditModal: React.FC<TodoEditModalProps> = ({
    todo,
    open,
    onClose,
    onSuccess,
}) => {
    const updateTodoMutation = useUpdateTodo();
    const [currentTag, setCurrentTag] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UpdateTodo>({
        resolver: zodResolver(UpdateTodoSchema),
        defaultValues: {
            title: '',
            description: '',
            isCompleted: false,
            priority: Priority.Medium,
            dueDate: null,
            tags: [],
        },
    });

    const tags = watch('tags');
    const priority = watch('priority');

    useEffect(() => {
        if (todo && open) {
            console.log('Priority', todo.priority);
            reset({
                title: todo.title,
                description: todo.description,
                isCompleted: todo.isCompleted,
                priority: todo.priority,
                dueDate: todo.dueDate,
                tags: todo.tags,
            });
        }
    }, [todo, open, reset]);

    const handleAddTag = (tagToAdd: string) => {
        const trimmedTag = tagToAdd.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setValue('tags', [...tags, trimmedTag]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setValue(
            'tags',
            tags.filter(tag => tag !== tagToRemove)
        );
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(currentTag);
        }
    };

    const onSubmit = (data: UpdateTodo) => {
        if (!todo) return;

        updateTodoMutation.mutate(
            { id: todo.id, todo: data },
            {
                onSuccess: () => {
                    onSuccess?.();
                    onClose();
                },
            }
        );
    };

    const handleClose = () => {
        setCurrentTag('');
        onClose();
    };

    if (!todo) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Todo</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        pt: 1,
                    }}
                >
                    <TextField
                        {...register('title')}
                        label="Title"
                        variant="outlined"
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />

                    <TextField
                        {...register('description')}
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />

                    <FormControl fullWidth error={!!errors.priority}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priority}
                            onChange={e =>
                                setValue('priority', e.target.value as Priority)
                            }
                            label="Priority"
                        >
                            <MenuItem value={Priority.Low}>Low</MenuItem>
                            <MenuItem value={Priority.Medium}>Medium</MenuItem>
                            <MenuItem value={Priority.High}>High</MenuItem>
                        </Select>
                        {errors.priority && (
                            <FormHelperText>
                                {errors.priority.message}
                            </FormHelperText>
                        )}
                    </FormControl>

                    <TextField
                        {...register('dueDate')}
                        label="Due Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.dueDate}
                        helperText={errors.dueDate?.message}
                    />

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Tags
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <TextField
                                placeholder="Add a tag"
                                variant="outlined"
                                size="small"
                                value={currentTag}
                                onChange={e => setCurrentTag(e.target.value)}
                                onKeyPress={handleTagKeyPress}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="outlined"
                                onClick={() => handleAddTag(currentTag)}
                                disabled={!currentTag.trim()}
                                sx={{ minWidth: 'auto', px: 2 }}
                            >
                                <PlusIcon size={16} />
                            </Button>
                        </Box>
                        {tags.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                }}
                            >
                                {tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        size="small"
                                        onDelete={() => handleRemoveTag(tag)}
                                        deleteIcon={<XIcon size={14} />}
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TodoEditModal;
