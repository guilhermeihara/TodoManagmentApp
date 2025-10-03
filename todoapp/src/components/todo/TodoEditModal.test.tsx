import { fireEvent, screen } from '@testing-library/react';

import { mockTodos } from '../../__tests__/mocks';
import { render } from '../../__tests__/test-utils';

import TodoEditModal from './TodoEditModal';

jest.mock('../../hooks/useTodos', () => ({
    useUpdateTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
}));

describe('TodoEditModal', () => {
    const mockOnClose = jest.fn();
    const mockOnSuccess = jest.fn();
    const mockTodo = mockTodos[0];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders modal when open', () => {
        render(
            <TodoEditModal
                todo={mockTodo}
                open={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Edit Todo')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <TodoEditModal
                todo={mockTodo}
                open={false}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('populates form with todo data', () => {
        render(
            <TodoEditModal
                todo={mockTodo}
                open={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument();
        expect(
            screen.getByDisplayValue(mockTodo.description)
        ).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('displays existing tags', () => {
        render(
            <TodoEditModal
                todo={mockTodo}
                open={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText('work')).toBeInTheDocument();
        expect(screen.getByText('urgent')).toBeInTheDocument();
    });

    it('calls onClose when cancel button is clicked', () => {
        render(
            <TodoEditModal
                todo={mockTodo}
                open={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });

    it('handles null todo', () => {
        render(
            <TodoEditModal
                todo={null}
                open={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays save button', () => {
        render(
            <TodoEditModal
                todo={mockTodo}
                open={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
            />
        );

        expect(
            screen.getByRole('button', { name: /save changes/i })
        ).toBeInTheDocument();
    });
});
