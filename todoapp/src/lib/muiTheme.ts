import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#3b82f6', // blue-500
            light: '#60a5fa', // blue-400
            dark: '#2563eb', // blue-600
        },
        secondary: {
            main: '#6b7280', // gray-500
            light: '#9ca3af', // gray-400
            dark: '#374151', // gray-700
        },
        error: {
            main: '#ef4444', // red-500
            light: '#f87171', // red-400
            dark: '#dc2626', // red-600
        },
        warning: {
            main: '#f59e0b', // amber-500
            light: '#fbbf24', // amber-400
            dark: '#d97706', // amber-600
        },
        success: {
            main: '#10b981', // emerald-500
            light: '#34d399', // emerald-400
            dark: '#059669', // emerald-600
        },
        background: {
            default: '#f9fafb', // gray-50
            paper: '#ffffff',
        },
        text: {
            primary: '#111827', // gray-900
            secondary: '#6b7280', // gray-500
        },
    },
    typography: {
        fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 500,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 8, // 0.5rem
    },
    spacing: 8, // Base spacing unit
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow:
                        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});
