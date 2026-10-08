// design-system-kit 0.10.1 · Upgrade tool tests — node --test kit/tools/
import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs"
import { join, dirname } from "node:path"
import { tmpdir } from "node:os"
import { execFileSync } from "node:child_process"
import { reconcile, planMarkdown } from "./ds-upgrade.mjs"

const STOCK = "// design-system-kit V · profile shadcn · stock component (base-nova + baseline only)"
const EXT = "// design-system-kit V · profile shadcn · kit extension (replaces the stock file when chosen)"
const stamp = (header, v) => header.replace("V", v)
const lines = (...l) => l.join("\n") + "\n"

const put = (root, path, text) => {
  mkdirSync(dirname(join(root, path)), { recursive: true })
  writeFileSync(join(root, path), text)
}
const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8" })

// A kit with two releases. 1.1.0 changes button's variants (one line), the
// stock and extension Table differently, drops a file and adds Toggle.
const button = (v, variant) => lines(stamp(STOCK, v), "export function Button() {", "  const a = 1", "  const b = 2", "  const c = 3", "  const d = 4", `  return "${variant}"`, "}")
const stockTable = (v) => lines(stamp(STOCK, v), "export const Table = 'stock'")
const extTable = (v, extra = "") => lines(stamp(EXT, v), "export const Table = 'kit'", `export const density = 'comfortable'${extra}`, "export function TableSortButton() {}")

function kit() {
  const dir = mkdtempSync(join(tmpdir(), "kit-src-"))
  git(dir, "init", "-q")
  git(dir, "config", "user.email", "t@t")
  git(dir, "config", "user.name", "t")
  const release = (v, files) => {
    for (const [p, t] of Object.entries(files)) put(dir, `kit/code/shadcn/${p}`, t)
    git(dir, "add", "-A")
    git(dir, "commit", "-qm", v)
    git(dir, "tag", `v${v}`)
  }
  release("1.0.0", {
    "stock/ui/button.tsx": button("1.0.0", "solid"),
    "stock/ui/table.tsx": stockTable("1.0.0"),
    "kit/ui/table.tsx": extTable("1.0.0"),
    "stock/ui/card.tsx": lines(stamp(STOCK, "1.0.0"), "export const Card = 1"),
    "stock/ui/old.tsx": lines(stamp(STOCK, "1.0.0"), "export const Old = 1"),
    "wiring/locale.ts": lines("// design-system-kit 1.0.0 · profile shadcn · wiring: the app's locale defaults", "export const locale = 'en'"),
  })
  git(dir, "rm", "-q", "kit/code/shadcn/stock/ui/old.tsx")
  release("1.1.0", {
    "stock/ui/button.tsx": button("1.1.0", "filled"),
    "stock/ui/table.tsx": stockTable("1.1.0"),
    "kit/ui/table.tsx": extTable("1.1.0", " // compact too"),
    "stock/ui/card.tsx": lines(stamp(STOCK, "1.1.0"), "export const Card = 1"),
    "stock/ui/toggle.tsx": lines(stamp(STOCK, "1.1.0"), 'import { Toggle as P } from "@base-ui/react/toggle"', "export const Toggle = P", "export const toggleVariants = 1"),
    "stock/ui/toggle-group.tsx": lines(stamp(STOCK, "1.1.0"), 'import { toggleVariants } from "@/components/ui/toggle"', "export function ToggleGroup() { return toggleVariants }"),
    "kit/ui/data-table.tsx": lines(stamp(EXT, "1.1.0"), 'import { useReactTable } from "@tanstack/react-table"', 'import { Table, TableSortButton } from "@/components/ui/table"', "export function DataTable() { return [Table, TableSortButton, useReactTable] }"),
    "wiring/locale.ts": lines("// design-system-kit 1.1.0 · profile shadcn · wiring: the app's locale defaults", "export const locale = 'en-US'"),
  })
  return dir
}

function app(files) {
  const dir = mkdtempSync(join(tmpdir(), "app-"))
  for (const [p, t] of Object.entries(files)) put(dir, p, t)
  return dir
}

const ui = "src/components/ui"
const byFile = (plan) => Object.fromEntries(plan.files.map((f) => [f.file, f]))

test("an unchanged copy is replaced when the kit changed it, and only restamped when it didn't", async () => {
  const dir = app({ [`${ui}/button.tsx`]: button("1.0.0", "solid"), [`${ui}/card.tsx`]: lines(stamp(STOCK, "1.0.0"), "export const Card = 1") })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", write: true })
  const f = byFile(plan)
  assert.equal(f[`${ui}/button.tsx`].outcome, "replace")
  assert.equal(f[`${ui}/card.tsx`].outcome, "stamp")
  assert.equal(readFileSync(join(dir, ui, "button.tsx"), "utf8"), button("1.1.0", "filled"))
  assert.match(readFileSync(join(dir, ui, "card.tsx"), "utf8"), /design-system-kit 1\.1\.0/)
})

test("a customization the kit didn't touch is kept and restamped", async () => {
  const custom = lines(stamp(STOCK, "1.0.0"), "export const Card = 2 // brand")
  const dir = app({ [`${ui}/card.tsx`]: custom })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", write: true })
  assert.equal(plan.files[0].outcome, "keep")
  assert.match(plan.files[0].customization, /\+export const Card = 2 \/\/ brand/)
  assert.equal(readFileSync(join(dir, ui, "card.tsx"), "utf8"), custom.replace("1.0.0", "1.1.0"))
})

test("a customization away from the kit's change merges; on the same line it conflicts and is left alone", async () => {
  const separate = button("1.0.0", "solid").replace("const a = 1", "const a = 100 // client")
  const same = button("1.0.0", "solid").replace('"solid"', '"brand"')
  const dir = app({ [`${ui}/button.tsx`]: separate, [`other/${ui}/button.tsx`]: same })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", write: true })
  const f = byFile(plan)
  assert.equal(f[`${ui}/button.tsx`].outcome, "merge")
  const merged = readFileSync(join(dir, ui, "button.tsx"), "utf8")
  assert.match(merged, /const a = 100 \/\/ client/)
  assert.match(merged, /return "filled"/)
  assert.match(merged, /design-system-kit 1\.1\.0/)

  assert.equal(f[`other/${ui}/button.tsx`].outcome, "conflict")
  assert.equal(readFileSync(join(dir, "other", ui, "button.tsx"), "utf8"), same, "a conflicted file keeps its old stamp and content")
  assert.match(f[`other/${ui}/button.tsx`].conflicted, /<<<<<<< client[\s\S]*"brand"[\s\S]*>>>>>>> kit/)
})

test("the stamp's kind picks stock or kit extension", async () => {
  const dir = app({ [`${ui}/table.tsx`]: stockTable("1.0.0"), [`b/${ui}/table.tsx`]: extTable("1.0.0") })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0" })
  const f = byFile(plan)
  assert.equal(f[`${ui}/table.tsx`].kitPath, "kit/code/shadcn/stock/ui/table.tsx")
  assert.equal(f[`${ui}/table.tsx`].outcome, "stamp")
  assert.equal(f[`b/${ui}/table.tsx`].kitPath, "kit/code/shadcn/kit/ui/table.tsx")
  assert.equal(f[`b/${ui}/table.tsx`].outcome, "replace")
  assert.ok(!plan.available.some((p) => p.endsWith("/table.tsx")), "a component the repo has, in either variant, isn't offered")
})

test("app-owned, removed and obsolete files are reported, never touched; dry run writes nothing", async () => {
  const locale = lines("// design-system-kit 1.0.0 · profile shadcn · wiring: the app's locale defaults", "export const locale = 'fr'")
  const old = lines(stamp(STOCK, "1.0.0"), "export const Old = 1")
  const test_ = lines("// design-system-kit 1.0.0 · profile shadcn · kit extension test", "test()")
  const dir = app({ "src/lib/locale.ts": locale, [`${ui}/old.tsx`]: old, [`${ui}/table.test.tsx`]: test_, [`${ui}/button.tsx`]: button("1.0.0", "solid") })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0" })
  const f = byFile(plan)
  assert.equal(f["src/lib/locale.ts"].outcome, "app-owned")
  assert.equal(f[`${ui}/old.tsx`].outcome, "removed")
  assert.equal(f[`${ui}/table.test.tsx`].outcome, "obsolete")
  assert.equal(readFileSync(join(dir, ui, "button.tsx"), "utf8"), button("1.0.0", "solid"))
  assert.ok(plan.available.includes("kit/code/shadcn/stock/ui/toggle.tsx"))
  assert.ok(!plan.available.includes("kit/code/shadcn/stock/ui/button.tsx"), "a component the repo has isn't offered")
  assert.ok(!plan.available.includes("kit/code/shadcn/stock/ui/locale.ts"))
  assert.match(planMarkdown(plan), /\| `src\/lib\/locale.ts` \| 1\.0\.0 \| app-owned \|/)
})

test("a missing target tag stops with how to fix it", async () => {
  await assert.rejects(reconcile({ app: app({}), kitSrc: kit(), to: "9.9.9" }), /no tag v9\.9\.9.*git fetch --tags/)
})

test("files without a kit stamp are ignored", async () => {
  const dir = app({ [`${ui}/mine.tsx`]: "export const Mine = 1\n", "node_modules/x/button.tsx": button("1.0.0", "solid") })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0" })
  assert.equal(plan.files.length, 0)
  assert.ok(!existsSync(join(dir, ".ds-upgrade")), "reconcile itself writes no plan; the CLI does")
})

// --add
const pkg = JSON.stringify({ dependencies: { "@base-ui/react": "1.8.0" } })
const base = () => ({ "package.json": pkg, [`${ui}/table.tsx`]: stockTable("1.0.0"), [`${ui}/button.tsx`]: button("1.0.0", "solid") })

test("adding a component brings what it imports from the component folder", async () => {
  const dir = app(base())
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", add: ["toggle-group"], write: true })
  assert.deepEqual(plan.added.map((a) => [a.name, a.reason]), [["toggle-group", "asked"], ["toggle", "needed by toggle-group"]])
  assert.ok(existsSync(join(dir, ui, "toggle.tsx")) && existsSync(join(dir, ui, "toggle-group.tsx")))
  assert.deepEqual(plan.packages, [], "@base-ui/react is declared")
})

test("an unmodified stock file is swapped for the kit extension the new component needs", async () => {
  const dir = app(base())
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", add: ["data-table"], write: true })
  const table = plan.added.find((a) => a.name === "table")
  assert.equal(table.kitPath, "kit/code/shadcn/kit/ui/table.tsx")
  assert.equal(table.replaces, true)
  assert.equal(table.reason, "needed by data-table")
  assert.match(readFileSync(join(dir, ui, "table.tsx"), "utf8"), /TableSortButton/)
  assert.deepEqual(plan.packages, ["@tanstack/react-table"])
})

test("a customized stock file blocks the component instead of being overwritten", async () => {
  const custom = lines(stamp(STOCK, "1.0.0"), "export const Table = 'brand'")
  const dir = app({ ...base(), [`${ui}/table.tsx`]: custom })
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", add: ["data-table", "toggle"], write: true })
  assert.equal(plan.blocked.length, 1)
  assert.match(plan.blocked[0].why, /table.tsx is customized \(keep\)/)
  assert.deepEqual(plan.added.map((a) => a.name), ["toggle"], "the other request still goes ahead")
  assert.ok(!existsSync(join(dir, ui, "data-table.tsx")))
  assert.equal(readFileSync(join(dir, ui, "table.tsx"), "utf8"), custom.replace("1.0.0", "1.1.0"), "only the reconcile's restamp")
})

test("a component the repo has is reported, and a dry run writes nothing", async () => {
  const dir = app(base())
  const plan = await reconcile({ app: dir, kitSrc: kit(), to: "1.1.0", add: ["button", "toggle"] })
  assert.match(plan.blocked[0].why, /already in the repo/)
  assert.ok(!existsSync(join(dir, ui, "toggle.tsx")))
  assert.match(planMarkdown(plan), /## Components added[\s\S]*toggle\.tsx[\s\S]*\*\*button not added\*\*/)
})
