// design-system-kit 0.11.0 · profile shadcn · wiring: ESLint flat config
//
// Run unattended with `eslint .` (`next lint` is deprecated). Setup keeps the
// repo's own config and adds the accessibility block below if the repo
// already has a flat config; otherwise it writes this file.
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { FlatCompat } from "@eslint/eslintrc"
import jsxA11y from "eslint-plugin-jsx-a11y"

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const config = [
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
    // Vendored stock components are wrappers: the label's control, a link's
    // content and the focusing click arrive through props or children, which
    // these rules can't see. App code keeps them on.
    files: ["**/components/ui/**"],
    rules: {
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
    },
  },
  {
    ignores: [".next/**", ".next-build/**", "node_modules/**", "dist/**", "next-env.d.ts"],
  },
]

export default config
