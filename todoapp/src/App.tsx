import {
    Box,
    Card,
    CardContent,
    Container,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AxiosError } from 'axios';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import TodoForm from './components/todo/TodoForm';
import TodoList from './components/todo/TodoList';
import AuthProvider from './contexts/AuthProvider';
import { muiTheme } from './lib/muiTheme';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error: Error) => {
                if (
                    error instanceof AxiosError &&
                    error?.response &&
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    return false;
                }
                return failureCount < 3;
            },
        },
        mutations: {
            retry: 1,
        },
    },
});

const AppContent: React.FC = () => (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                    gap: 4,
                }}
            >
                <Box>
                    <TodoList />
                </Box>
                <Box>
                    <Box sx={{ position: 'sticky', top: 32 }}>
                        <Card>
                            <CardContent>
                                <TodoForm />
                            </CardContent>
                        </Card>
                        <Card sx={{ mt: 3 }}>
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="h3"
                                    gutterBottom
                                >
                                    Quick Tips
                                </Typography>
                                <List dense>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary="• Click the checkbox to mark todos as complete"
                                            slotProps={{
                                                primary: {
                                                    variant: 'body2',
                                                    color: 'text.secondary',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary="• Use the search bar to find specific todos"
                                            slotProps={{
                                                primary: {
                                                    variant: 'body2',
                                                    color: 'text.secondary',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary="• Filter by status to focus on what matters"
                                            slotProps={{
                                                primary: {
                                                    variant: 'body2',
                                                    color: 'text.secondary',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemText
                                            primary="• Hover over todos to see action buttons"
                                            slotProps={{
                                                primary: {
                                                    variant: 'body2',
                                                    color: 'text.secondary',
                                                },
                                            }}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </Container>
        <Box
            component="footer"
            sx={{
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider',
                mt: 8,
            }}
        />
    </Box>
);

const App: React.FC = () => (
    <AuthProvider>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                <ProtectedRoute>
                    <AppContent />
                </ProtectedRoute>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            iconTheme: {
                                primary: '#4ade80',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            duration: 5000,
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </QueryClientProvider>
    </AuthProvider>
);

export default App;
