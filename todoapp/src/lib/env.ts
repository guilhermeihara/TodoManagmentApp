export const getApiUrl = (): string =>
    import.meta.env.VITE_API_URL || 'http://localhost:5001';
