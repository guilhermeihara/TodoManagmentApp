import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useLogin } from '../../hooks/useAuth';
import { LoginFormData, LoginSchema } from '../../types/auth';

import DemoCredentialsAlert from './DemoCredentialsAlert';

const LoginForm: React.FC<{
    onLoginSuccess: () => void;
}> = ({ onLoginSuccess }) => {
    const [apiError, setApiError] = useState<string>('');

    const { mutate: login, isPending: isLoading } = useLogin(onLoginSuccess);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: LoginFormData) => {
        setApiError('');

        login(data, {
            onError: (error: AxiosError<{ message: string }>) => {
                if (error?.response?.data?.message) {
                    setApiError(error.response.data.message);
                } else {
                    setApiError(
                        'An error occurred during login. Please try again.'
                    );
                }
            },
        });
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {apiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {apiError}
                </Alert>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <TextField
                    {...register('email', {
                        onChange: () => {
                            if (apiError) setApiError('');
                        },
                    })}
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
                    {...register('password', {
                        onChange: () => {
                            if (apiError) setApiError('');
                        },
                    })}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    fullWidth
                    label="Password"
                    placeholder="Enter your password"
                    variant="outlined"
                    size="small"
                    error={!!errors.password}
                    helperText={errors.password?.message}
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
                        Signing in...
                    </Box>
                ) : (
                    'Sign in'
                )}
            </Button>
            <DemoCredentialsAlert />
        </Box>
    );
};

export default LoginForm;
