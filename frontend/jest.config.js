module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        outputPath: "./test-reports/frontend/test-report.html", // Output path for the report
        pageTitle: "Frontend Test Report",
        includeFailureMsg: true,
      },
    ],
  ],
};