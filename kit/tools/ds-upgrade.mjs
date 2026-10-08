#!/usr/bin/env node
// design-system-kit 0.10.2 · Upgrade tool — runs from the kit, never copied into a client repo
/**
 * ds-upgrade.mjs — the mechanical part of Upgrade: reconcile every kit file a
 * repo carries with a newer kit, keeping what the client changed.
 *
 *   node kit/tools/ds-upgrade.mjs --kit-src <git clone of the kit> --to <version>
 *        [--app <app folder>] [--out <dir>] [--write]
 *
 * Run in (or point --app at) the app's folder. --kit-src is a clone of the
 * kit repo with its release tags (`v<version>`): the installed plugin holds
 * only one version, and the reconcile needs two.
 *
 * For each file in the app whose first lines carry a kit stamp
 * ("design-system-kit <version> · … <kind>"), three copies are compared:
 *
 *   base    the kit's file at the version the repo file is stamped with — what
 *           the client received. The file's own stamp, not `kitVersion`: an
 *           upgrade restamps only the files it touched.
 *   ours    the repo's file.
 *   theirs  the kit's file at --to.
 *
 * The kind in the stamp picks the kit file ("stock component" → stock/,
 * "kit extension" → kit/ui/, "wiring" → wiring/, "kit file" → scripts/ or
 * wiring/), so a repo that kept stock Table reconciles against stock, not the
 * extension. Base and theirs go through the repo's own formatter (Prettier,
 * when the app has it and doesn't ignore the path) first, and stamps are
 * compared without their version — otherwise a format-on-commit hook makes
 * every file look customized.
 *
 *   ours = base, theirs = base   stamp     only the stamp changes
 *   ours = base, theirs ≠ base   replace   the kit's new file
 *   ours ≠ base, theirs = base   keep      the client's file, restamped
 *   ours ≠ base, theirs ≠ base   merge     a clean three-way merge, or
 *                                conflict  left as is (old stamp, so the next
 *                                          run still finds its base); the
 *                                          kit's file and the conflict go to
 *                                          --out for a dev
 *   no base at that tag          unknown   stamp when ours = theirs, else left
 *   gone from the kit at --to    removed   left; the changelog says why
 *
 * App-owned files (the locale module, Vite's fonts.css — seeds Setup fills
 * for the client) and test files the kit stopped
 * shipping are reported, never touched. Files and components the new kit has
 * that the repo lacks are listed as available — adding them is a choice, not
 * part of the reconcile. Sections merged into other files (the theme block
 * in the global CSS, the CLAUDE.md section, package.json) aren't whole files
 * and are left to the changelog's upgrade steps.
 *
 * --add <name,…> adds components the repo doesn't have (kit file names, e.g.
 * toggle-group,data-table), with what they import from the component folder:
 * a missing file comes too (stock, unless only the kit extension exports the
 * imported names); a stock file that lacks an imported name is swapped for
 * the kit extension when the repo's copy is unmodified, and blocks the
 * component when it's customized. npm packages the added files import and
 * the app doesn't declare are listed, not installed.
 *
 * Without --write nothing in the app changes. Always writes <out>/plan.json
 * and <out>/plan.md (default <out>: ./.ds-upgrade), with every customization
 * as a diff against its base, so the PR can show what the client changed.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync } from "node:fs"
import { join, resolve, relative, basename, dirname } from "node:path"
import { tmpdir } from "node:os"
import { execFileSync, spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import { fileURLToPath, pathToFileURL } from "node:url"

const STAMP = /design-system-kit (\d+\.\d+\.\d+)/
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".turbo", "coverage", ".ds-upgrade"])
const EXTS = /\.(tsx?|mjs|cjs|js|css|jsonc?)$/
// Seeds the app owns once copied: never reconciled.
const APP_OWNED = new Set(["kit/code/shadcn/wiring/locale.ts", "kit/code/shadcn/wiring/vite/fonts.css"])

// ---------------------------------------------------------------------------
// The kit at a version
// ---------------------------------------------------------------------------

function git(cwd, args, input) {
  return execFileSync("git", args, { cwd, encoding: "utf8", input, maxBuffer: 64 << 20, stdio: ["pipe", "pipe", "pipe"] })
}

/** Every path under kit/code/ at a tag, or null when the tag doesn't exist. */
function kitTree(kitSrc, version) {
  try {
    return git(kitSrc, ["ls-tree", "-r", "--name-only", `v${version}`, "--", "kit/code"]).split("\n").filter(Boolean)
  } catch {
    return null
  }
}

function kitFile(kitSrc, version, path) {
  try {
    return git(kitSrc, ["show", `v${version}:${path}`])
  } catch {
    return null
  }
}

/** The stamp's kind decides which kit folders a file can come from. */
function folderFor(kind) {
  if (/stock component/.test(kind)) return /^kit\/code\/[^/]+\/stock\//
  if (/kit extension test/.test(kind)) return "test"
  if (/kit extension/.test(kind)) return /^kit\/code\/[^/]+\/kit\/ui\//
  if (/wiring/.test(kind)) return /^kit\/code\/[^/]+\/wiring\//
  if (/kit file/.test(kind)) return /^kit\/code\/[^/]+\/(scripts|wiring)\//
  return null
}

/** The kit path a repo file came from: same name, in the folder its kind names. */
function kitPathFor(tree, name, kind) {
  const folder = folderFor(kind)
  if (!folder || folder === "test" || !tree) return null
  const hits = tree.filter((p) => basename(p) === name && folder.test(p))
  return hits.length === 1 ? hits[0] : null
}

// ---------------------------------------------------------------------------
// The repo's files
// ---------------------------------------------------------------------------

/** { version, kind } from a kit stamp in the first lines, or null. */
function stampOf(text) {
  for (const line of text.split("\n", 4)) {
    const m = STAMP.exec(line)
    if (m) return { version: m[1], kind: line.slice(m.index + m[0].length) }
  }
  return null
}

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (EXTS.test(name)) out.push(p)
  }
  return out
}

// ---------------------------------------------------------------------------
// Formatting and comparing
// ---------------------------------------------------------------------------

/** The app's Prettier, if it has one; formatting a path it ignores is a no-op. */
async function formatterFor(app) {
  let prettier
  try {
    const req = createRequire(join(app, "package.json"))
    const mod = await import(pathToFileURL(req.resolve("prettier")).href)
    prettier = mod.default ?? mod
  } catch {
    return { name: "none", format: async (text) => text }
  }
  return {
    name: `prettier ${prettier.version}`,
    format: async (text, file) => {
      const info = await prettier.getFileInfo(file, { ignorePath: findUp(app, ".prettierignore") ?? undefined })
      if (info.ignored || !info.inferredParser) return text
      const options = (await prettier.resolveConfig(file)) ?? {}
      return prettier.format(text, { ...options, filepath: file })
    },
  }
}

function findUp(dir, name) {
  for (let d = resolve(dir); ; d = dirname(d)) {
    if (existsSync(join(d, name))) return join(d, name)
    if (dirname(d) === d) return null
  }
}

/** Stamps compared without their version: `design-system-kit X`. */
const unstamp = (text) => text.replace(STAMP, "design-system-kit X")
const restamp = (text, version) => text.replace("design-system-kit X", `design-system-kit ${version}`)

function merge3(ours, base, theirs) {
  const dir = mkdtempSync(join(tmpdir(), "ds-upgrade-"))
  try {
    const [o, b, t] = ["ours", "base", "theirs"].map((n, i) => {
      const p = join(dir, n)
      writeFileSync(p, [ours, base, theirs][i])
      return p
    })
    const r = spawnSync("git", ["merge-file", "-p", "-L", "client", "-L", "base", "-L", "kit", o, b, t], { encoding: "utf8" })
    if (r.status < 0 || r.error) throw r.error ?? new Error(r.stderr)
    return { text: r.stdout, conflicts: r.status }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function unifiedDiff(a, b, label) {
  const dir = mkdtempSync(join(tmpdir(), "ds-upgrade-"))
  try {
    writeFileSync(join(dir, "a"), a)
    writeFileSync(join(dir, "b"), b)
    const r = spawnSync("git", ["diff", "--no-index", "--no-color", "-U2", "a", "b"], { cwd: dir, encoding: "utf8" })
    return r.stdout.split("\n").slice(4).join("\n").replace(/^/, `--- kit (base)\n+++ ${label}\n`)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

const byVersion = (a, b) => {
  const [x, y] = [a, b].map((v) => v.split(".").map(Number))
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
}

// ---------------------------------------------------------------------------
// Reconcile
// ---------------------------------------------------------------------------

export async function reconcile({ app, kitSrc, to, add = [], write = false }) {
  app = resolve(app)
  const target = kitTree(kitSrc, to)
  if (!target) throw new Error(`no tag v${to} in ${kitSrc} — fetch the kit's tags (git fetch --tags)`)
  const fmt = await formatterFor(app)
  const trees = new Map([[to, target]])
  const treeAt = (v) => (trees.has(v) ? trees.get(v) : trees.set(v, kitTree(kitSrc, v)).get(v))

  const files = []
  const seen = new Set()
  for (const file of walk(app)) {
    const raw = readFileSync(file, "utf8")
    const stamp = stampOf(raw)
    if (!stamp) continue
    const rel = relative(app, file)
    const entry = { file: rel, from: stamp.version, kind: stamp.kind.trim() }
    files.push(entry)

    if (folderFor(stamp.kind) === "test") {
      entry.outcome = "obsolete"
      entry.note = "a kit test; the kit's tests stay in the kit (since 0.8.0) — delete it"
      continue
    }
    const kitPath = kitPathFor(treeAt(stamp.version), basename(file), stamp.kind) ?? kitPathFor(target, basename(file), stamp.kind)
    entry.kitPath = kitPath
    if (!kitPath) {
      entry.outcome = "unknown"
      entry.note = "no single kit file of this name and kind"
      continue
    }
    seen.add(kitPath)
    if (APP_OWNED.has(kitPath)) {
      entry.outcome = "app-owned"
      continue
    }
    const theirsRaw = kitFile(kitSrc, to, kitPath)
    if (theirsRaw == null) {
      entry.outcome = "removed"
      entry.note = `not in kit ${to}; see the changelog`
      continue
    }
    const baseRaw = kitFile(kitSrc, stamp.version, kitPath)
    const ours = unstamp(raw)
    const theirs = unstamp(await fmt.format(theirsRaw, file))
    const base = baseRaw == null ? null : unstamp(await fmt.format(baseRaw, file))

    let result = null
    if (base == null) {
      entry.outcome = ours === theirs ? "stamp" : "unknown"
      entry.note = ours === theirs ? undefined : `no base: v${stamp.version} doesn't have ${kitPath}`
      if (ours === theirs) result = theirs
    } else if (ours === base) {
      entry.outcome = theirs === base ? "stamp" : "replace"
      result = theirs
    } else {
      entry.customization = unifiedDiff(base, ours, `client (${rel})`)
      if (theirs === base) {
        entry.outcome = "keep"
        result = ours
      } else {
        const m = merge3(ours, base, theirs)
        if (m.conflicts === 0) {
          entry.outcome = "merge"
          result = await fmt.format(m.text, file)
        } else {
          entry.outcome = "conflict"
          entry.conflicts = m.conflicts
          entry.conflicted = restamp(m.text, stamp.version)
          entry.theirs = restamp(theirs, to)
        }
      }
    }
    if (result != null) {
      entry.to = to
      entry.result = restamp(result, to)
      entry.changed = entry.result !== raw
    }
  }

  // What the new kit has that the repo doesn't: components and stock files to choose from.
  const available = target
    .filter((p) => /\/(stock\/ui|kit\/ui)\/[^/]+\.tsx$/.test(p) && !p.endsWith(".test.tsx") && !seen.has(p))
    .filter((p) => !files.some((f) => basename(f.file) === basename(p)))

  const adding = add.length ? await plan_add({ app, kitSrc, to, target, files, fmt, names: add }) : { added: [], blocked: [], packages: [] }

  if (write) {
    for (const f of files) if (f.changed) writeFileSync(join(app, f.file), f.result)
    for (const a of adding.added) writeFileSync(join(app, a.file), a.result)
  }
  return { app, from: [...new Set(files.map((f) => f.from))].sort(byVersion), to, formatter: fmt.name, files, available, ...adding }
}

// ---------------------------------------------------------------------------
// Adding components the repo doesn't have
// ---------------------------------------------------------------------------

/** Every name a module exports (functions, consts, types, and `export { … }` lists). */
function exportsOf(text) {
  const names = new Set()
  for (const m of text.matchAll(/export\s+(?:declare\s+)?(?:async\s+)?(?:function|const|let|class|type|interface)\s+(\w+)/g)) names.add(m[1])
  for (const m of text.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g))
    for (const part of m[1].split(",")) {
      const name = part.replace(/^\s*type\s+/, "").split(/\s+as\s+/).pop().trim()
      if (name) names.add(name)
    }
  return names
}

/** `{ file, names }` for each `import { … } from "@/components/ui/<file>"`. */
function uiImportsOf(text) {
  return [...text.matchAll(/import\s+(?:type\s+)?\{([^}]*)\}\s*from\s*["']@\/components\/ui\/([\w-]+)["']/g)].map((m) => ({
    file: m[2],
    names: m[1].split(",").map((n) => n.replace(/^\s*type\s+/, "").split(/\s+as\s+/)[0].trim()).filter(Boolean),
  }))
}

/** npm packages a module imports (bare specifiers, scoped ones by scope/name). */
function packagesOf(text) {
  const pkgs = new Set()
  for (const m of text.matchAll(/(?:from|import)\s*["']([^"'.\/@][^"']*|@[^"'\/]+\/[^"']+)["']/g)) {
    const spec = m[1]
    if (spec.startsWith("@/")) continue
    pkgs.add(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0])
  }
  return pkgs
}

/**
 * Plan adding `names` (kit file names: "toggle-group", "data-table"). Each
 * brings what it imports from the component folder: a missing file is added
 * (stock, unless only the kit extension exports what's imported); a stock
 * file the repo has that lacks an imported name is swapped for the kit
 * extension — only when the repo's copy is the kit's, unmodified. A
 * customized one blocks the component rather than being overwritten. Each
 * requested name is all-or-nothing.
 */
async function plan_add({ app, kitSrc, to, target, files, fmt, names }) {
  const stockFile = files.find((f) => /\/stock\/ui\//.test(f.kitPath ?? ""))
  if (!stockFile) throw new Error("no stock component found in the app — can't tell where its component folder is")
  const uiDir = dirname(stockFile.file)
  const root = stockFile.kitPath.replace(/\/stock\/ui\/.*$/, "")
  const inRepo = new Map(files.filter((f) => dirname(f.file) === uiDir).map((f) => [basename(f.file, ".tsx"), f]))
  const kitText = (variant, name) => (target.includes(`${root}/${variant}/${name}.tsx`) ? kitFile(kitSrc, to, `${root}/${variant}/${name}.tsx`) : null)

  const added = [], blocked = []
  const planned = new Map()
  for (const asked of names) {
    const actions = new Map()
    let why = null
    const visit = (name, by, need) => {
      if (why) return
      const have = actions.get(name) ?? planned.get(name)
      const current = have?.text ?? (inRepo.has(name) ? readFileSync(join(app, inRepo.get(name).file), "utf8") : null)
      const missing = (text) => need.filter((n) => !exportsOf(text).has(n))
      if (current != null && missing(current).length === 0) return
      const stock = kitText("stock/ui", name), ext = kitText("kit/ui", name)
      const pick = [stock, ext].find((t) => t != null && missing(t).length === 0)
      if (pick == null) {
        why = `${by} imports ${need.join(", ")} from ${name}, and no kit file of ${name} exports ${need.length > 1 ? "them" : "it"}`
        return
      }
      const variant = pick === stock ? "stock/ui" : "kit/ui"
      if (current != null && !have) {
        const entry = inRepo.get(name)
        if (!["stamp", "replace"].includes(entry.outcome)) {
          why = `${by} needs ${name}'s kit extension (${missing(current).join(", ")}); the repo's ${name}.tsx is customized (${entry.outcome}), so it isn't replaced`
          return
        }
      }
      actions.set(name, { name, variant, text: pick, reason: by === asked && name === asked ? "asked" : `needed by ${by}`, replaces: current != null })
      for (const dep of uiImportsOf(pick)) visit(dep.file, name, dep.names)
    }
    visit(asked, asked, [])
    if (!actions.size && !why && inRepo.has(asked)) why = `${asked} is already in the repo`
    if (why) blocked.push({ name: asked, why })
    else for (const [n, a] of actions) planned.set(n, a)
  }

  for (const a of planned.values()) {
    const file = join(uiDir, `${a.name}.tsx`)
    added.push({
      name: a.name,
      file,
      kitPath: `${root}/${a.variant}/${a.name}.tsx`,
      reason: a.reason,
      replaces: a.replaces,
      result: await fmt.format(a.text, join(app, file)),
    })
  }

  const pkg = JSON.parse(readFileSync(join(app, "package.json"), "utf8"))
  const declared = new Set(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies }))
  const packages = [...new Set(added.flatMap((a) => [...packagesOf(a.result)]))].filter((p) => !declared.has(p)).sort()
  return { added, blocked, packages }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const ORDER = ["conflict", "merge", "keep", "replace", "unknown", "removed", "obsolete", "app-owned", "stamp"]

export function planMarkdown(plan) {
  const count = (o) => plan.files.filter((f) => f.outcome === o).length
  const lines = [
    `# Upgrade plan — kit ${plan.from.join(", ")} → ${plan.to}`,
    "",
    `Formatter: ${plan.formatter}. ${plan.files.length} kit files: ` +
      ORDER.filter(count).map((o) => `${count(o)} ${o}`).join(", ") + ".",
    "",
    "| File | From | Outcome | Note |",
    "|---|---|---|---|",
    ...[...plan.files]
      .sort((a, b) => ORDER.indexOf(a.outcome) - ORDER.indexOf(b.outcome) || a.file.localeCompare(b.file))
      .map((f) => `| \`${f.file}\` | ${f.from} | ${f.outcome}${f.conflicts ? ` (${f.conflicts})` : ""} | ${f.note ?? ""} |`),
  ]
  if (plan.available.length) {
    lines.push("", "**Available in the kit, not in this repo** (adding one is a choice, not part of the upgrade):", "")
    for (const p of plan.available) lines.push(`- \`${p.replace(/^kit\/code\/[^/]+\//, "")}\``)
  }
  if (plan.added?.length || plan.blocked?.length) {
    lines.push("", "## Components added", "")
    for (const a of plan.added)
      lines.push(`- \`${a.file}\` — ${a.kitPath.replace(/^kit\/code\/[^/]+\//, "")}, ${a.reason}${a.replaces ? " (replaces the repo's unmodified stock file)" : ""}`)
    for (const b of plan.blocked) lines.push(`- **${b.name} not added**: ${b.why}`)
    if (plan.packages.length) lines.push("", `Packages to add: ${plan.packages.map((p) => `\`${p}\``).join(", ")}`)
  }
  const custom = plan.files.filter((f) => f.customization)
  if (custom.length) {
    lines.push("", "## What the client changed", "", "Each customized file against the kit file it started from.", "")
    for (const f of custom) lines.push(`### \`${f.file}\` — ${f.outcome}`, "", "```diff", f.customization.trimEnd(), "```", "")
  }
  return lines.join("\n") + "\n"
}

function writeOut(out, plan) {
  mkdirSync(out, { recursive: true })
  for (const f of plan.files) {
    if (f.outcome !== "conflict") continue
    const dest = join(out, "conflicts", f.file)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(`${dest}.conflict`, f.conflicted)
    writeFileSync(`${dest}.kit`, f.theirs)
  }
  const slim = { ...plan, files: plan.files.map(({ result, conflicted, theirs, ...f }) => f), added: plan.added.map(({ result, ...a }) => a) }
  writeFileSync(join(out, "plan.json"), JSON.stringify(slim, null, 2) + "\n")
  writeFileSync(join(out, "plan.md"), planMarkdown(plan))
}

async function main() {
  const args = process.argv.slice(2)
  const opt = (name) => {
    const i = args.indexOf(`--${name}`)
    return i >= 0 ? args[i + 1] : undefined
  }
  const kitSrc = opt("kit-src"), to = opt("to")
  if (!kitSrc || !to) {
    console.error("usage: ds-upgrade.mjs --kit-src <kit clone> --to <version> [--add <name,…>] [--app <dir>] [--out <dir>] [--write]")
    process.exit(2)
  }
  const app = resolve(opt("app") ?? ".")
  const out = resolve(opt("out") ?? join(app, ".ds-upgrade"))
  const add = (opt("add") ?? "").split(",").map((n) => n.trim()).filter(Boolean)
  const plan = await reconcile({ app, kitSrc: resolve(kitSrc), to, add, write: args.includes("--write") })
  writeOut(out, plan)
  process.stdout.write(planMarkdown(plan).split("\n## What the client changed")[0])
  if (plan.blocked.length) process.exitCode = 1
  console.log(`\n${args.includes("--write") ? "wrote the app's files" : "dry run — nothing in the app changed"}; plan in ${relative(process.cwd(), out) || "."}/plan.md`)
  if (plan.files.some((f) => f.outcome === "conflict")) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
