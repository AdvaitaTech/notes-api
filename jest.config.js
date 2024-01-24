/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.(test|spec).[jt]s"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
};
