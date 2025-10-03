import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useRegister } from '../../hooks/useAuth';
import { RegisterFormData, RegisterSchema } from '../../types/auth';

const RegisterForm: React.FC<{
    onRegistrationSuccess: () => void;
}> = ({ onRegistrationSuccess }) => {
    const { mutate: register, isPending: isLoading } = useRegister(
        onRegistrationSuccess
    );

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        register(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <TextField
                    {...registerField('firstName')}
                    id="firstName"
                    type="text"
                    fullWidth
                    label="First Name"
                    placeholder="Enter your first name"
                    variant="outlined"
                    size="small"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                />
                <TextField
                    {...registerField('lastName')}
                    id="lastName"
                    type="text"
                    fullWidth
                    label="Last Name"
                    placeholder="Enter your last name"
                    variant="outlined"
                    size="small"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                />
                <TextField
                    {...registerField('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    fullWidth
                    label="Email"
                    placeholder="Enter your email address"
                    variant="outlined"
                    size="small"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                />
                <TextField
                    {...registerField('password')}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    fullWidth
                    label="Password"
                    placeholder="Enter your password"
                    variant="outlined"
                    size="small"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                />
                <TextField
                    {...registerField('confirmPassword')}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    fullWidth
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    variant="outlined"
                    size="small"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                />
            </Box>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    backgroundColor: '#4f46e5',
                    '&:hover': {
                        backgroundColor: '#4338ca',
                    },
                    '&:disabled': {
                        opacity: 0.5,
                    },
                }}
            >
                {isLoading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <CircularProgress size={16} color="inherit" />
                        Creating account...
                    </Box>
                ) : (
                    'Create account'
                )}
            </Button>
        </Box>
    );
};

export default RegisterForm;
