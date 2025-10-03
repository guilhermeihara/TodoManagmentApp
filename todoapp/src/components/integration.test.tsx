import { screen } from '@testing-library/react';

import { render } from '../__tests__/test-utils';
import App from '../App';

jest.mock('../hooks/useTodos', () => ({
    useTodos: () => ({
        data: { data: [] },
        isLoading: false,
        error: null,
    }),
    useCreateTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
    useUpdateTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
    useDeleteTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
    useToggleTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
}));

jest.mock('../hooks/useFilteredTodos', () => ({
    useFilteredTodos: () => ({
        filteredTodos: [],
        searchQuery: '',
        setSearchQuery: jest.fn(),
        filter: 'all',
        setFilter: jest.fn(),
    }),
}));

jest.mock('../api/authApi', () => ({
    authApi: {
        isAuthenticated: () => false,
        getCurrentUser: () => null,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn(),
    },
}));

describe('App Integration', () => {
    it('renders authentication page when not logged in', () => {
        render(<App />);

        expect(
            screen.getByText(/sign in to your account/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('displays login form elements', () => {
        render(<App />);

        expect(
            screen.getByRole('button', { name: /sign in/i })
        ).toBeInTheDocument();
        expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });
});
