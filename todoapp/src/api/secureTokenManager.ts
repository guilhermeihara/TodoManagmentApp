import { User } from './todoApi';

const SESSION_TIMEOUT = 30 * 60 * 1000;

export const secureTokenManager = {
    getToken: (): string | null => {
        const token = localStorage.getItem('authToken');
        const lastActivity = localStorage.getItem('lastActivity');

        if (!token || !lastActivity) return null;

        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
            secureTokenManager.clearAll();
            return null;
        }

        secureTokenManager.updateActivity();
        return token;
    },

    setToken: (token: string): void => {
        localStorage.setItem('authToken', token);
        secureTokenManager.updateActivity();
    },

    removeToken: (): void => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('lastActivity');
    },

    // Refresh token management
    getRefreshToken: (): string | null => localStorage.getItem('refreshToken'),

    setRefreshToken: (token: string): void => {
        localStorage.setItem('refreshToken', token);
    },

    removeRefreshToken: (): void => {
        localStorage.removeItem('refreshToken');
    },

    getUser: (): User | null => {
        const user = localStorage.getItem('user');
        try {
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
            return null;
        }
    },

    setUser: (user: User): void => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    removeUser: (): void => {
        localStorage.removeItem('user');
    },

    clearAll: (): void => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
    },

    isTokenExpired: (): boolean => {
        const token = secureTokenManager.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isExpired = Date.now() >= payload.exp * 1000;

            if (isExpired) {
                secureTokenManager.clearAll();
            }

            return isExpired;
        } catch (error) {
            console.error('Error validating token:', error);
            secureTokenManager.clearAll();
            return true;
        }
    },

    updateActivity: (): void =>
        localStorage.setItem('lastActivity', Date.now().toString()),

    isSessionValid: (): boolean => {
        const token = localStorage.getItem('authToken');
        const lastActivity = localStorage.getItem('lastActivity');

        if (!token || !lastActivity) return false;

        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        return timeSinceLastActivity <= SESSION_TIMEOUT;
    },

    getSessionTimeRemaining: (): number => {
        const lastActivity = localStorage.getItem('lastActivity');
        if (!lastActivity) return 0;

        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        return Math.max(0, SESSION_TIMEOUT - timeSinceLastActivity);
    },
};

export default secureTokenManager;
