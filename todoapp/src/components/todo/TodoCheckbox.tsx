import { Box, Checkbox } from '@mui/material';
import { CheckIcon } from 'lucide-react';
import React from 'react';

interface TodoCheckboxProps {
    isCompleted: boolean;
    onChange: () => void;
    disabled?: boolean;
}

const TodoCheckbox: React.FC<TodoCheckboxProps> = ({
    isCompleted,
    onChange,
    disabled = false,
}) => (
    <Checkbox
        checked={isCompleted}
        onChange={onChange}
        disabled={disabled}
        icon={
            <Box
                sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid #d1d5db',
                    borderRadius: 1,
                    '&:hover': {
                        borderColor: '#10b981',
                    },
                }}
            />
        }
        checkedIcon={
            <Box
                sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: '#10b981',
                    border: '2px solid #10b981',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <CheckIcon size={12} />
            </Box>
        }
        sx={{
            p: 0,
            mt: 0.125,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
        }}
    />
);

export default TodoCheckbox;
