import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  bail: true,
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testEnvironment: "jsdom",
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  transformIgnorePatterns: ["/node_modules/"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "\\.(less|css)$": "jest-less-loader" // 支持less
  }
};

module.exports = config;

// transform: {
//   "^.+\\.(ts|tsx)$": "ts-jest",
// },
// modulePathIgnorePatterns: ["./dist/", "./test/mocks.ts"],
// coveragePathIgnorePatterns: ["./test/mocks.ts"],
