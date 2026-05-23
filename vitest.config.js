import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Unit tests use the default Node environment.
    // Integration tests opt into jsdom via the per-file
    // `// @vitest-environment jsdom` pragma at the top
    // of tests/integration/*.test.js.
    environmentMatchGlobs: [
      ["tests/integration/**", "jsdom"],
    ],
    globals: false,
    include: ["tests/**/*.test.js"],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
});
