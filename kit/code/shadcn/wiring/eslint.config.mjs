// design-system-kit 0.1.0 · profile shadcn · wiring: ESLint flat config
//
// Run unattended with `eslint .` (`next lint` is deprecated). Setup keeps the
// repo's own config and adds the accessibility block below if the repo
// already has a flat config; otherwise it writes this file.
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { FlatCompat } from "@eslint/eslintrc"
import jsxA11y from "eslint-plugin-jsx-a11y"

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Accessibility rules. eslint-config-next already registers the jsx-a11y
    // plugin (with a handful of its rules), so only the rules are added here —
    // registering the plugin twice is an error in flat config.
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Base UI composes through the `render` prop; the element that ends up
      // focusable isn't visible to the linter.
      "jsx-a11y/no-autofocus": ["error", { ignoreNonDOM: true }],
    },
  },
  {
    ignores: [".next/**", ".next-build/**", "node_modules/**", "dist/**", "next-env.d.ts"],
  },
]
