import React from 'react';

import { useAuth } from '../../hooks/useAuthContext';

import AuthPage from './AuthPage';

const ProtectedRoute: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <AuthPage onLoginSuccess={() => window.location.reload()} />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
