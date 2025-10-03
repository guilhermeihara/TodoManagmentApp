import {
    Box,
    Card,
    CardContent,
    Container,
    Link,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC<{
    onLoginSuccess: () => void;
}> = ({ onLoginSuccess }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <Container
            maxWidth="sm"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f9fafb',
                py: 6,
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 448,
                    p: 2,
                }}
            >
                <CardContent>
                    <Box textAlign="center" mb={4}>
                        <Typography
                            variant="h4"
                            component="h2"
                            fontWeight={800}
                            color="#111827"
                            mb={1}
                        >
                            {isRegistering
                                ? 'Create your account'
                                : 'Sign in to your account'}
                        </Typography>
                        <Typography variant="body2" color="#6b7280">
                            {isRegistering
                                ? 'Already have an account? '
                                : "Don't have an account? "}
                            <Link
                                component="button"
                                type="button"
                                onClick={() => setIsRegistering(!isRegistering)}
                                sx={{
                                    fontWeight: 500,
                                    color: '#4f46e5',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: '#4338ca',
                                    },
                                }}
                            >
                                {isRegistering ? 'Sign in' : 'Sign up'}
                            </Link>
                        </Typography>
                    </Box>

                    {isRegistering ? (
                        <RegisterForm onRegistrationSuccess={onLoginSuccess} />
                    ) : (
                        <LoginForm onLoginSuccess={onLoginSuccess} />
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default AuthPage;
