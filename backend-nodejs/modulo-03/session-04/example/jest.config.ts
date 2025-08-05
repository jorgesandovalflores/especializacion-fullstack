export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    rootDir: 'src',
    testRegex: '.*\.spec\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
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