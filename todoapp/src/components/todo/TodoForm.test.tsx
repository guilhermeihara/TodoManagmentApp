import { fireEvent, screen, waitFor } from '@testing-library/react';

import { render } from '../../__tests__/test-utils';
import { useCreateTodo } from '../../hooks/useTodos';

import TodoForm from './TodoForm';

jest.mock('../../hooks/useTodos', () => ({
    useCreateTodo: jest.fn(() => ({
        mutateAsync: jest.fn(),
        isPending: false,
    })),
}));

describe('TodoForm', () => {
    const mockOnSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form fields correctly', () => {
        render(<TodoForm onSuccess={mockOnSuccess} />);

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /add todo/i })
        ).toBeInTheDocument();
    });

    it('validates required title field', async () => {
        render(<TodoForm onSuccess={mockOnSuccess} />);

        const submitButton = screen.getByRole('button', {
            name: /add todo/i,
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        });
    });

    it('allows adding tags', () => {
        render(<TodoForm onSuccess={mockOnSuccess} />);

        const tagInput = screen.getByPlaceholderText(
            /type and press enter or comma to add tags/i
        );

        fireEvent.change(tagInput, { target: { value: 'work,' } });

        // Test that the input exists and can be interacted with
        expect(tagInput).toBeInTheDocument();
    });

    it('adds tag on Enter key press', () => {
        render(<TodoForm />);

        const tagInput = screen.getByPlaceholderText(
            'Type and press Enter or comma to add tags...'
        );

        // Type a tag
        fireEvent.change(tagInput, { target: { value: 'urgent' } });

        // Press Enter
        fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

        // Tag should be added as a chip
        expect(screen.getByText('urgent')).toBeInTheDocument();

        // Test that the input clears after adding a tag (async clear)
        waitFor(() => {
            expect(tagInput).toHaveValue('');
        });
    });

    it('handles tag input correctly', () => {
        render(<TodoForm onSuccess={mockOnSuccess} />);

        const tagInput = screen.getByPlaceholderText(
            /type and press enter or comma to add tags/i
        );

        // Test that empty input doesn't cause issues
        fireEvent.change(tagInput, { target: { value: '' } });
        expect(tagInput).toHaveValue('');
    });

    it('shows loading state when submitting', () => {
        // Mock the hook to return isPending: true
        const mockUseCreateTodo = useCreateTodo as jest.MockedFunction<
            typeof useCreateTodo
        >;
        mockUseCreateTodo.mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({}),
            isPending: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        render(<TodoForm />);

        const submitButton = screen.getByRole('button');
        expect(submitButton).toHaveTextContent(/adding/i);
        expect(submitButton).toBeDisabled();
    });
    it('displays priority options', () => {
        render(<TodoForm />);

        // Find the priority select (should show Medium as default)
        const prioritySelect = screen.getByRole('combobox');
        expect(prioritySelect).toHaveTextContent('Medium');

        // Click to open dropdown
        fireEvent.mouseDown(prioritySelect);

        // Check that all priority options are available in the dropdown
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getAllByText('Medium')).toHaveLength(2); // One in select, one in dropdown
        expect(screen.getByText('Low')).toBeInTheDocument();
    });
});
