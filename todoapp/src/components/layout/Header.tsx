import {
    AppBar,
    Box,
    Button,
    Container,
    Toolbar,
    Typography,
} from '@mui/material';
import React from 'react';
import { toast } from 'react-hot-toast';

import { APP_CONFIG } from '../../constants';
import { useAuth } from '../../hooks/useAuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
        } catch {
            toast.error('Error logging out');
        }
    };

    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                backgroundColor: 'white',
                color: 'text.primary',
                borderBottom: '1px solid #e5e7eb',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: '64px !important',
                        px: { xs: 2, sm: 3, lg: 4 },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            variant="h6"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                color: '#111827',
                                margin: 0,
                            }}
                        >
                            {APP_CONFIG.name}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#6b7280',
                                fontSize: '0.875rem',
                            }}
                        >
                            v{APP_CONFIG.version}
                        </Typography>

                        {user && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: '#6b7280',
                                            fontSize: 'inherit',
                                        }}
                                    >
                                        Welcome,{' '}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#111827',
                                            fontSize: 'inherit',
                                        }}
                                    >
                                        {user.firstName} {user.lastName}
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    onClick={handleLogout}
                                    sx={{
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        px: 2,
                                        py: 1,
                                        '&:hover': {
                                            backgroundColor: '#4338ca',
                                        },
                                        '&:focus': {
                                            outline: 'none',
                                            boxShadow:
                                                '0 0 0 2px #e5e7eb, 0 0 0 4px #4f46e5',
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
