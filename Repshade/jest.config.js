module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          strict: true,
          types: ['jest'],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^react-native$': '<rootDir>/tests/__mocks__/react-native.js',
    '^expo-sqlite$': '<rootDir>/tests/__mocks__/expo-sqlite.js',
    '^firebase/(.*)$': '<rootDir>/tests/__mocks__/firebase.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/tests/__mocks__/async-storage.js',
  },
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
};
