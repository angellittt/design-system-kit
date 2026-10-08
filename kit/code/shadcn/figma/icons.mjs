#!/usr/bin/env node
// design-system-kit 0.10.1 · profile shadcn · figma: icon geometry — fix it in the kit, not per client
/**
 * icons.mjs — the SVG bodies of the icons a Figma library needs, read from the
 * icon package the app actually installs (lucide-react by default), so Figma
 * draws the same geometry the code ships.
 *
 *   node <kit>/figma/icons.mjs --repo apps/web x check chevron-down …   > icons.json
 *
 * Prints { "<name>": "<path …/><circle …/>" }. Aliases (trash-2 → trash) are
 * followed. The Figma step wraps each body in a 24×24, 2px-stroke SVG and
 * creates one Icon/<name> component per entry (figma-library.md §2).
 */
import { readFileSync, existsSync } from "node:fs"
import { join, dirname, resolve } from "node:path"
import { createRequire } from "node:module"

/** The icons the kit's components and examples use; add what a client's screens need. */
export const DEFAULT_ICONS = ["x", "check", "chevron-down", "chevron-right", "chevron-left", "chevron-up", "chevrons-up-down", "search", "plus", "minus", "copy", "info", "circle-alert", "circle-check", "triangle-alert", "ellipsis", "calendar", "inbox", "house", "folder", "settings", "users", "loader-circle", "trash-2", "pencil", "bell", "file-text", "map-pin", "log-out", "circle"]

export function iconDir(repo) {
  const req = createRequire(join(resolve(repo), "package.json"))
  return join(dirname(req.resolve("lucide-react/package.json")), "dist/esm/icons")
}

export function iconBody(dir, name, seen = new Set()) {
  const file = join(dir, `${name}.mjs`)
  if (!existsSync(file)) throw new Error(`lucide-react has no icon "${name}"`)
  const src = readFileSync(file, "utf8")
  if (!src.includes("node:")) {
    const alias = /from '\.\/([\w-]+)\.mjs'/.exec(src)?.[1]
    if (!alias || seen.has(alias)) throw new Error(`can't read icon "${name}"`)
    return iconBody(dir, alias, seen.add(name))
  }
  const node = src.slice(src.indexOf("node:"), src.indexOf("};", src.indexOf("node:")))
  return [...node.matchAll(/\[\s*"(\w+)",\s*\{([^}]*)\}\s*\]/g)].map(([, tag, attrs]) => {
    const kv = [...attrs.matchAll(/(\w+):\s*"([^"]*)"/g)].filter(([, k]) => k !== "key")
    return `<${tag} ${kv.map(([, k, v]) => `${k}="${v}"`).join(" ")}/>`
  }).join("")
}

function main() {
  const args = process.argv.slice(2)
  const i = args.indexOf("--repo")
  const repo = i === -1 ? "." : args[i + 1]
  const names = args.filter((a, j) => a !== "--repo" && j !== i + 1)
  const dir = iconDir(repo)
  const out = {}
  for (const n of names.length ? names : DEFAULT_ICONS) out[n] = iconBody(dir, n)
  process.stdout.write(JSON.stringify(out) + "\n")
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) main()
