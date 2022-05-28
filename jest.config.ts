import { Config } from '@jest/types';

export default {
  bail: 0,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/modules/**/useCases/**/*.ts'],
  coverageReporters: ['text-summary', 'lcov'],
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
} as Config.InitialOptions;
