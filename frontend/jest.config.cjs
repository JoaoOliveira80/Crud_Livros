/** Unit tests use ts-jest so they do not depend on platform-specific Next.js SWC binaries. */
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  transform: { "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx", module: "commonjs", moduleResolution: "node", esModuleInterop: true } }] },
};
