import { fireEvent, screen, waitFor } from '@testing-library/react';

import { render } from '../../__tests__/test-utils';

import LoginForm from './LoginForm';

const mockMutate = jest.fn();
const mockUseLogin = jest.fn();

jest.mock('../../hooks/useAuth', () => ({
    useLogin: () => mockUseLogin(),
}));

describe('LoginForm', () => {
    const mockOnLoginSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseLogin.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
        });
    });

    it('renders login form fields', () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /sign in/i })
        ).toBeInTheDocument();
    });

    it('validates required email field', async () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/please enter a valid email address/i)
            ).toBeInTheDocument();
        });
    });

    it('validates email format', async () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const emailInput = screen.getByPlaceholderText(
            'Enter your email address'
        );
        const passwordInput = screen.getByPlaceholderText(
            'Enter your password'
        );
        const submitButton = screen.getByRole('button', { name: 'Sign in' });

        // Fill in valid password and invalid email
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

        // Submit form
        fireEvent.click(submitButton);

        // Wait a bit to allow any async validation
        await new Promise(resolve => setTimeout(resolve, 100));

        // The mutation should not be called with invalid email
        expect(mockMutate).not.toHaveBeenCalled();
    });

    it('validates required password field', async () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        const submitButton = screen.getByRole('button', { name: /sign in/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(
                screen.getByText(/password is required/i)
            ).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                {
                    email: 'test@example.com',
                    password: 'password123',
                },
                expect.objectContaining({
                    onError: expect.any(Function),
                })
            );
        });
    });

    it('shows loading state when submitting', () => {
        mockUseLogin.mockReturnValue({
            mutate: mockMutate,
            isPending: true,
        });

        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const submitButton = screen.getByRole('button', {
            name: /signing in/i,
        });
        expect(submitButton).toBeDisabled();
    });

    it('displays demo credentials alert', () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    });
});
