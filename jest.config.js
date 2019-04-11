export const globals = {
  'ts-jest': {
    tsConfig: 'tsconfig.json'
  }
};
export const moduleFileExtensions = [
  'ts', 'js'
];
export const transform = {
  '^.+\\.(ts|tsx)$': 'ts-jest'
};
export const testMatch = [
  '**/test/**/*.test.(ts)'
];
export const testEnvironment = 'node';
export const collectCoverageFrom = ['./src/**/*.ts'];
export const reporters = [
  "default", ["./node_modules/jest-html-reporter", {
    "pageTitle": "Test Report"
  }]
];