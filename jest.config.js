// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    testMatch: [
        '<rootDir>/tests/**/*.test.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};