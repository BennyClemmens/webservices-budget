/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  preset: 'ts-jest', // tell jest we work with typescript

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    // '**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  testSequencer: '<rootDir>/src/core/custom-sequencer.js',
};

export default config;
