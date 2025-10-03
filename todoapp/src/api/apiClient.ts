import axios from 'axios';

import { getApiUrl } from '../lib/env';

import { secureTokenManager } from './secureTokenManager';

export const apiClient = axios.create({
    baseURL: getApiUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    config => {
        const token = secureTokenManager.getToken();
        if (token) {
            if (secureTokenManager.isTokenExpired()) {
                secureTokenManager.clearAll();
                window.location.href = '/login';
                return Promise.reject(new Error('Token expired'));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);
