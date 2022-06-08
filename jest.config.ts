export default {
  roots: ['<rootDir>/test'],
  bail: 0,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  transform: {
    '.*\\.ts$': 'ts-jest'
  },
  testMatch: ['**/?(*.)+(spec|test).[t]s?(x)'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    }
  }
}