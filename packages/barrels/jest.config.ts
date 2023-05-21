/* eslint-disable */
import { readFileSync } from 'fs';

// Reading the SWC compilation config and remove the "exclude"
// for the test files to be compiled by SWC
const { exclude: _, ...swcJestConfig } = JSON.parse(
    readFileSync(`${__dirname}/.swcrc`, 'utf-8')
);

// disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves.
// If we do not disable this, SWC Core will read .swcrc and won't transform our test files due to "exclude"
if (swcJestConfig.swcrc === undefined) {
  swcJestConfig.swcrc = false;
}

// jest needs EsModule Interop to find the default exported function
swcJestConfig.module.noInterop = false;

export default {
  displayName: 'barrels',
  preset: '../../jest.preset.js',

  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  "setupFilesAfterEnv": ["jest-expect-message"],

  // @NOTE: Use this for esm packages
  transformIgnorePatterns: [
    "node_modules/(?!is-unicode-supported|pkg-dir|find-up|locate-path|p-locate|.+)"
  ],

  // globalSetup: '<rootDir>/tests/bootstrap.ts',
  coverageDirectory: '../../coverage/packages/barrels',
  coverageReporters: ['text', 'lcov', 'cobertura']
};