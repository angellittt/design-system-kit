// design-system-kit 0.1.0 · profile shadcn · harness: vitest
import { defineConfig } from "vitest/config"
import { resolve } from "node:path"

/**
 * Interaction tests for the kit's extensions. The contract's verify-behaviour
 * rule asks for these wherever a kit component carries an event prop, so a
 * later refactor can't quietly stop calling the handler.
 *
 * `src` is the app's source directory (the target of tsconfig's "@/*").
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
