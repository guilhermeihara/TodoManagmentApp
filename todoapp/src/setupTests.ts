import '@testing-library/jest-dom';

// Mock import.meta
Object.defineProperty(globalThis, 'import', {
    value: {
        meta: {
            env: {
                VITE_API_URL: 'http://localhost:5000',
            },
        },
    },
});

// Mock IntersectionObserver
(
    globalThis as unknown as { IntersectionObserver: unknown }
).IntersectionObserver = class IntersectionObserver {
    constructor() {
        // Empty constructor
    }
    disconnect() {
        // Empty method
    }
    observe() {
        // Empty method
    }
    unobserve() {
        // Empty method
    }
};

// Mock ResizeObserver
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver =
    class ResizeObserver {
        constructor() {
            // Empty constructor
        }
        disconnect() {
            // Empty method
        }
        observe() {
            // Empty method
        }
        unobserve() {
            // Empty method
        }
    };

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock scrollTo
(globalThis as unknown as { scrollTo: unknown }).scrollTo = jest.fn();
