import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import React from 'react';

import { TodoStats } from './TodoStats';

const TodoListHeader: React.FC<{
    stats: TodoStats;
    filteredCount: number;
}> = ({ stats, filteredCount }) => (
    <Card>
        <CardContent sx={{ p: 3 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                        }}
                    >
                        My Todos
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {stats.total} total, {stats.active} active,{' '}
                        {stats.completed} completed
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Chip
                        label={`${filteredCount} shown`}
                        color="primary"
                        variant="outlined"
                        size="small"
                    />
                </Box>
            </Box>
        </CardContent>
    </Card>
);

export default TodoListHeader;
