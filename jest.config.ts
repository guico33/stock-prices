module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(svg)(\\?react)?$': '<rootDir>/__mocks__/svgMock.tsx',
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
};
