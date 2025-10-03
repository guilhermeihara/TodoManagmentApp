import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

import { authApi, LoginRequest } from '../api/authApi';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const useLogin = (onSuccess: () => void) =>
    useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),
        onSuccess: () => {
            toast.success('Login successful!');
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });

export const useRegister = (onSuccess: () => void) =>
    useMutation({
        mutationFn: (data: RegisterData) => authApi.register(data),
        onSuccess: () => {
            toast.success('Registration successful!');
            onSuccess();
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || 'Registration failed');
        },
    });
