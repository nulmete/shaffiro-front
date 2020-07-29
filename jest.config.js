module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['<rootDir>/tests/unit/setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  testResultsProcessor: 'jest-sonar-reporter'
}
