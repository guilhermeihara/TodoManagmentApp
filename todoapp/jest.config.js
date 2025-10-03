/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@mui/(.*)$': '<rootDir>/node_modules/@mui/$1',
    '^lucide-react$': '<rootDir>/node_modules/lucide-react',
    '^@testing-library/react$': '<rootDir>/node_modules/@testing-library/react',
    '^../lib/env$': '<rootDir>/src/__tests__/mocks/env.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'commonjs',
        moduleResolution: 'node',
        target: 'es2020',
        types: ['jest', '@testing-library/jest-dom', 'node'],
        skipLibCheck: true,
      },
    }],
  },
  testMatch: [
    '<rootDir>/src/**/*.test.(ts|tsx)',
  ],
};

export default config;
