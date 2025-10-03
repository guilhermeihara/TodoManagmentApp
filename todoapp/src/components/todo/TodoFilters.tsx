import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@mui/material';
import { ArrowDown, ArrowUp, SearchIcon } from 'lucide-react';
import React, { useMemo } from 'react';

import { FILTER_OPTIONS, SORT_OPTIONS } from '../../constants';
import { debounce } from '../../lib/utils';
import { TodoFilter, TodoSort, TodoSortField } from '../../types/todo';

const TodoFilters: React.FC<{
    filter: TodoFilter;
    sort: TodoSort;
    onFilterChange: (filter: TodoFilter) => void;
    onSortChange: (sort: TodoSort) => void;
    onSearchChange: (searchQuery: string) => void;
}> = ({ filter, sort, onFilterChange, onSortChange, onSearchChange }) => {
    const debouncedSearch = useMemo(
        () =>
            debounce(
                (...args: unknown[]) => onSearchChange(args[0] as string),
                300
            ),
        [onSearchChange]
    );

    const handleSortFieldChange = (field: TodoSortField) => {
        onSortChange({ ...sort, field });
    };

    const handleSortDirectionToggle = () => {
        onSortChange({
            ...sort,
            direction: sort.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
            }}
        >
            <TextField
                placeholder="Search todos..."
                variant="outlined"
                size="small"
                sx={{ flex: 1 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon size={16} />
                            </InputAdornment>
                        ),
                    },
                }}
                onChange={e => debouncedSearch(e.target.value)}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Filter</InputLabel>
                <Select
                    value={filter}
                    label="Filter"
                    onChange={e => onFilterChange(e.target.value as TodoFilter)}
                >
                    {FILTER_OPTIONS.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        value={sort.field}
                        label="Sort by"
                        onChange={e =>
                            handleSortFieldChange(
                                e.target.value as TodoSortField
                            )
                        }
                    >
                        {SORT_OPTIONS.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Tooltip
                    title={`Sort ${sort.direction === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                    <IconButton
                        onClick={handleSortDirectionToggle}
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            height: 40,
                            width: 40,
                        }}
                    >
                        {sort.direction === 'asc' ? (
                            <ArrowUp size={16} />
                        ) : (
                            <ArrowDown size={16} />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default TodoFilters;
