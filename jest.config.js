module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
