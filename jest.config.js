/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // Use ts-jest to transpile TypeScript files during testing
  preset: 'ts-jest',
  
  // Set the target execution environment to Node.js
  testEnvironment: 'node',
  
  // Look for test files with .test.ts or .spec.ts extensions
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  
  // Clean up mock usage automatically between individual tests
  clearMocks: true,
  
  // Enable code coverage metrics gathering
  collectCoverage: true,
  
  // Define where Jest should export coverage reports
  coverageDirectory: 'coverage',
  
  // Specify which providers to use for coverage instrumentation
  coverageProvider: 'v8',
  
  // Tell Jest to ignore dependency folders
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
