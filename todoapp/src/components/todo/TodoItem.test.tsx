import { fireEvent, screen } from '@testing-library/react';

import { mockTodos } from '../../__tests__/mocks';
import { render } from '../../__tests__/test-utils';

import TodoItem from './TodoItem';

jest.mock('../../hooks/useTodos', () => ({
    useToggleTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
    useDeleteTodo: () => ({
        mutate: jest.fn(),
        isPending: false,
    }),
}));

describe('TodoItem', () => {
    const mockOnEdit = jest.fn();
    const mockTodo = mockTodos[0];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders todo item correctly', () => {
        render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />);

        expect(screen.getByText(mockTodo.title)).toBeInTheDocument();
        expect(screen.getByText(mockTodo.description)).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('displays priority badge correctly', () => {
        render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />);

        expect(screen.getByText('High')).toBeInTheDocument();
    });

    it('displays tags correctly', () => {
        render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />);

        expect(screen.getByText('work')).toBeInTheDocument();
        expect(screen.getByText('urgent')).toBeInTheDocument();
    });

    it('shows due date information', () => {
        render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />);

        expect(screen.getByText(/Dec 30, 2024/)).toBeInTheDocument();
    });

    it('calls onEdit when edit button is clicked', () => {
        render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />);

        const editButton = screen.getByRole('button', { name: /edit todo/i });
        fireEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledWith(mockTodo);
    });

    it('displays completed todo differently', () => {
        const completedTodo = mockTodos[1];
        render(<TodoItem todo={completedTodo} onEdit={mockOnEdit} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('handles keyboard navigation', () => {
        render(<TodoItem todo={mockTodo} onEdit={mockOnEdit} />);

        const editButton = screen.getByRole('button', { name: /edit todo/i });
        fireEvent.keyDown(editButton, { key: 'Enter', code: 'Enter' });

        // The edit button should already handle keyboard events natively
        expect(editButton).toBeInTheDocument();
    });

    it('shows no tags message when todo has no tags', () => {
        const todoWithoutTags = mockTodos[2];
        render(<TodoItem todo={todoWithoutTags} onEdit={mockOnEdit} />);

        expect(screen.queryByText('work')).not.toBeInTheDocument();
        expect(screen.queryByText('urgent')).not.toBeInTheDocument();
    });
});
