/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.[jt]s"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
