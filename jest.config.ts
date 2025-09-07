import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js'
  },

  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }]
  },

  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ]
};

export default config;
