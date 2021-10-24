module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/infrastructure/test', '<rootDir>/backend/test', '<rootDir>/backend/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
