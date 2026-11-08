import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globalSetup: "./tests/setup/globalSetup.js",
    setupFiles: ["./tests/setup/env.js"],
    testTimeout: 15000,
    hookTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: [
        "controllers/**",
        "middleware/**",
        "models/**",
        "utils/**",
        "app.js",
      ],
      exclude: ["**/*.test.js"],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 60,
      },
    },
  },
});
