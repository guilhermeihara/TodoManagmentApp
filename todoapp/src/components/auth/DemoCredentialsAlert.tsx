import { Alert, Typography } from '@mui/material';
import React from 'react';

const DemoCredentialsAlert: React.FC = () => (
    <Alert
        severity="info"
        sx={{
            mt: 2,
            backgroundColor: '#dbeafe',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            '& .MuiAlert-icon': {
                color: '#1e40af',
            },
        }}
    >
        <Typography variant="body2" fontWeight={500}>
            Demo Credentials:
        </Typography>
        <Typography variant="body2">
            <strong>Email:</strong> admin@todoapp.com
            <br />
            <strong>Password:</strong> Admin123!
        </Typography>
    </Alert>
);

export default DemoCredentialsAlert;
