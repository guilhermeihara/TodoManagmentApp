declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toBeChecked(): R;
            toBeDisabled(): R;
            toHaveTextContent(text: string | RegExp): R;
            toHaveAttribute(attr: string, value?: string): R;
        }
    }
}
