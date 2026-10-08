// design-system-kit 0.7.0 · profile shadcn · wiring (Vite): ESLint blocks
//
// Setup wraps the app's own flat config entries with `withDesignSystem(…)`
// and never edits the repo's rules:
//
//   export default defineConfig(withDesignSystem([...repoEntries]))
//
// If the app has no flat config, Setup writes one that is just
// `export default withDesignSystem([])`. The default export (the fixed blocks
// alone) stays for configs set up before kit 0.7.0.
//
// Accessibility: if the repo already runs jsx-a11y rules (oxlint's jsx-a11y
// plugin, or eslint-plugin-jsx-a11y), nothing more is needed; otherwise
// Setup also adds the jsx-a11y block from ../next/eslint.config.mjs and the
// eslint-plugin-jsx-a11y dev dependency.
import { builtinRules } from "eslint/use-at-your-own-risk"

/**
 * Files the kit vendors: stock shadcn components (kept as shadcn ships them,
 * so they compare cleanly with stock and with later stock updates) and the
 * two stock helpers outside the component folder. App-owned files the kit
 * only seeds (`src/lib/locale.ts`) are not here — the app's style applies.
 */
export const VENDORED = ["src/components/ui/**", "src/components/theme-provider.tsx", "src/hooks/use-mobile.ts"]

/** Plugins whose rules stay on everywhere, whatever their type: correctness and accessibility. */
const ALWAYS_ON = new Set(["jsx-a11y", "react-hooks"])

const designSystem = [
  {
    // Vendored components carry disable comments for other configs' rules
    // (react-hooks/exhaustive-deps); a repo that doesn't enable them would
    // report the comments as unused.
    files: ["src/components/ui/**"],
    linterOptions: { reportUnusedDisableDirectives: "off" },
  },
  // Kit scripts, and this file, are linted in the kit, not per client.
  { ignores: ["scripts/**", "eslint.design-system.mjs"] },
]

/**
 * The repo's style rules, switched off for the vendored files only.
 *
 * A rule counts as style when its own metadata says so — ESLint's
 * `meta.type` is "layout" or "suggestion" (`prefer-arrow-functions`,
 * `import-x/order`, `func-style`) rather than "problem" (a likely bug).
 * Rules from jsx-a11y and react-hooks stay on regardless. Only rules the repo
 * actually turns on are listed, so a plugin the repo doesn't load is never
 * named.
 */
export function styleRulesOff(entries) {
  const plugins = {}
  for (const e of entries) Object.assign(plugins, e?.plugins ?? {})
  const metaType = (id) => {
    const slash = id.lastIndexOf("/")
    if (slash === -1) return builtinRules.get(id)?.meta?.type
    const plugin = plugins[id.slice(0, slash)]
    return plugin?.rules?.[id.slice(slash + 1)]?.meta?.type
  }
  const on = new Set()
  for (const e of entries) {
    for (const [id, setting] of Object.entries(e?.rules ?? {})) {
      const level = Array.isArray(setting) ? setting[0] : setting
      if (level === "off" || level === 0) on.delete(id)
      else on.add(id)
    }
  }
  const off = {}
  for (const id of on) {
    const plugin = id.includes("/") ? id.slice(0, id.lastIndexOf("/")) : null
    if (plugin && ALWAYS_ON.has(plugin)) continue
    const type = metaType(id)
    if (type === "layout" || type === "suggestion") off[id] = "off"
  }
  return { files: VENDORED, rules: off }
}

/** The repo's entries, then the kit's blocks, then its style rules off for vendored files. */
export function withDesignSystem(entries) {
  return [...entries, ...designSystem, styleRulesOff(entries)]
}

export default designSystem
