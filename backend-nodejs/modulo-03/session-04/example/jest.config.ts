export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    coverageReporters: ['text', 'lcov', 'html'],
    reporters: [
        'default',
        [
        'jest-html-reporter',
        {
            pageTitle: 'Test Report',
            outputPath: 'coverage/report.html',
        },
        ],
    ],
};
