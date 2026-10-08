// design-system-kit 0.5.0 · profile shadcn · harness: vitest
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
    // Component tests beside the components; kit-script tests in scripts/__tests__
    // (they set their own node environment).
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
  },
})
