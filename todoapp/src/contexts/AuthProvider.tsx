import React, { ReactNode, useEffect, useState } from 'react';

import { authApi, RegisterRequest } from '../api/authApi';
import secureTokenManager from '../api/secureTokenManager';
import { User } from '../api/todoApi';

import { AuthContext, AuthContextType } from './AuthContext';

const AuthProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = authApi.isAuthenticated() && user !== null;

    useEffect(() => {
        const initializeAuth = () => {
            try {
                if (authApi.isAuthenticated()) {
                    const userData = authApi.getCurrentUser();
                    setUser(userData);
                } else {
                    secureTokenManager.clearAll();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                secureTokenManager.clearAll();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });
        setUser(response.user);
    };

    const register = async (userData: RegisterRequest) => {
        const response = await authApi.register(userData);
        setUser(response.user);
    };

    const logout = () => {
        try {
            authApi.logout();
        } finally {
            setUser(null);
            window.location.href = '/';
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
