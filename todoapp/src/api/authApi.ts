import { apiClient } from './apiClient';
import { secureTokenManager } from './secureTokenManager';
import { AuthResponse, User } from './todoApi';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const { data: authData } = await apiClient.post<AuthResponse>(
            '/api/auth/login',
            credentials
        );

        secureTokenManager.setToken(authData.token);
        secureTokenManager.setRefreshToken(authData.refreshToken);
        secureTokenManager.setUser(authData.user);

        return authData;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            '/api/auth/register',
            userData
        );
        const authData = response.data;

        secureTokenManager.setToken(authData.token);
        secureTokenManager.setRefreshToken(authData.refreshToken);
        secureTokenManager.setUser(authData.user);

        return authData;
    },

    logout: () => secureTokenManager.clearAll(),

    getCurrentUser: (): User | null => secureTokenManager.getUser(),

    isAuthenticated: (): boolean => {
        const token = secureTokenManager.getToken();
        return token !== null && !secureTokenManager.isTokenExpired();
    },
};
