// design-system-kit 0.10.2 · the kit's own CI: the harness config, pointed at app/
import { defineConfig } from "vitest/config"
import { resolve } from "node:path"

export default defineConfig({
  root: resolve(import.meta.dirname, "app"),
  resolve: { alias: { "@": resolve(import.meta.dirname, "app/src") } },
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
    exclude: ["scripts/__fixtures__/**", "**/node_modules/**"],
  },
})
