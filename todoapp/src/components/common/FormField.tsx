import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

interface FormFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
    error?: string;
    label?: string;
}

const FormField: React.FC<FormFieldProps> = ({
    error,
    label,
    placeholder,
    ...textFieldProps
}) => (
    <TextField
        {...textFieldProps}
        label={label}
        placeholder={placeholder || label}
        error={!!error}
        helperText={error}
        variant="outlined"
        size="small"
        fullWidth
        sx={{
            '& .MuiFormHelperText-root': {
                marginLeft: 0,
                marginTop: 0.5,
            },
            ...textFieldProps.sx,
        }}
    />
);

export default FormField;
