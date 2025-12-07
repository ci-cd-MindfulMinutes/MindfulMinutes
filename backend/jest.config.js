module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true
};