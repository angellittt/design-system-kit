#!/usr/bin/env node
// design-system-kit 0.1.0 · profile shadcn · kit file — fix it in the kit, not per client
/**
 * ds-styling-maps.mjs — the styling map in every implemented component's
 * README, generated from that component's code.
 *
 * KIT FILE. Generic across repos on profile `shadcn` 1.1: the token names, the
 * UI directory and the component-to-file mapping all come from the consuming
 * repo's own config, never from anything hardcoded here.
 *
 *   node scripts/ds-styling-maps.mjs Button          # one component's table
 *   node scripts/ds-styling-maps.mjs --all           # every component
 *
 * The contract fixes one format for every component:
 *
 *   | Part | State or variant | Attribute | Token |
 *
 * A value that cannot be traced to a token is listed as "fixed in code", so
 * the table stays a complete account of the component's styling rather than
 * only its tokenised half.
 */

import { readFileSync, existsSync } from "node:fs"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const REPO = process.cwd()
const TOOL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const require_ = createRequire(join(TOOL_ROOT, "package.json"))
const ts = require_("typescript")

// ---------------------------------------------------------------------------
// Repo configuration
// ---------------------------------------------------------------------------

/** tsconfig/components.json allow comments; strip them without eating strings. */
function readJsonc(path) {
  const src = readFileSync(path, "utf8")
  let out = "", inStr = false, quote = "", i = 0
  while (i < src.length) {
    const c = src[i], next = src[i + 1]
    if (inStr) {
      out += c
      if (c === "\\") { out += next ?? ""; i += 2; continue }
      if (c === quote) inStr = false
      i++
      continue
    }
    if (c === '"' || c === "'") { inStr = true; quote = c; out += c; i++; continue }
    if (c === "/" && next === "/") { while (i < src.length && src[i] !== "\n") i++; continue }
    if (c === "/" && next === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i += 2; continue }
    out += c
    i++
  }
  return JSON.parse(out)
}

const dsConfig = JSON.parse(
  readFileSync(join(REPO, ".ttt/design-system.json"), "utf8")
)
const componentsJson = JSON.parse(
  readFileSync(join(REPO, "components.json"), "utf8")
)
const tsconfig = readJsonc(join(REPO, "tsconfig.json"))

/** Resolve the `aliases.ui` path (e.g. "@/components/ui") through tsconfig paths. */
function uiDir() {
  const alias = componentsJson.aliases?.ui ?? "@/components/ui"
  const paths = tsconfig.compilerOptions?.paths ?? {}
  for (const [pattern, targets] of Object.entries(paths)) {
    const prefix = pattern.replace(/\*$/, "")
    if (alias.startsWith(prefix)) {
      const target = targets[0].replace(/\*$/, "")
      return join(REPO, target + alias.slice(prefix.length))
    }
  }
  return join(REPO, alias.replace(/^@\//, "src/"))
}

const UI = uiDir()
const tokens = JSON.parse(readFileSync(join(REPO, dsConfig.tokensIn), "utf8"))

/**
 * Components whose code spans more than one file, or whose file name is not
 * the kebab-case of the component name. Everything else is inferred.
 */
const EXTRA_FILES = dsConfig.componentFiles ?? {}

// ---------------------------------------------------------------------------
// Tokens: which names are semantic, and what each Tailwind utility resolves to
// ---------------------------------------------------------------------------

/** Semantic tokens only — primitives are never referenced by components. */
const SEMANTIC = new Set()
for (const [family, group] of Object.entries(tokens)) {
  if (!group?.tokens) continue
  for (const t of group.tokens) {
    // The tier is a naming convention; the usage text carries it.
    if (family === "color" && /^Primitive/.test(t.usage ?? "")) continue
    SEMANTIC.add(t.name)
  }
}

/**
 * The CSS variable graph from the generated token file, so `bg-primary`
 * resolves through `--color-primary` → `--primary` → `--primary-normal`
 * without this script having to restate the profile's mapping table.
 */
const cssVarAlias = new Map()
{
  const css = readFileSync(join(REPO, dsConfig.tokensOut), "utf8")
  // The light theme and @theme block are enough: an alias chain is the same in
  // both themes, only its leaf value differs.
  for (const m of css.matchAll(/--([a-z0-9-]+):\s*var\(--([a-z0-9-]+)\)/gi)) {
    if (!cssVarAlias.has(m[1])) cssVarAlias.set(m[1], m[2])
  }
}

/** Follow an alias chain to the first semantic token name, if any. */
function resolveVar(name, seen = new Set()) {
  let cur = name
  while (cur && !seen.has(cur)) {
    seen.add(cur)
    if (SEMANTIC.has(cur)) return cur
    cur = cssVarAlias.get(cur) ?? cssVarAlias.get(`color-${cur}`)
  }
  return null
}

/** A Tailwind colour name (`card`, `label-alternative`) → its semantic token. */
function colorToken(name) {
  if (!name) return null
  // Strip an opacity modifier: `input/30` is still the `input` colour.
  const bare = name.split("/")[0]
  return resolveVar(bare) ?? resolveVar(`color-${bare}`)
}

/**
 * An arbitrary value like `[0_0_0_3px_var(--focus-ring)]` → its token.
 * A component-local custom property (Badge's `--t-solid`) is not a design
 * token, but it is the value the part actually uses, so it is reported under
 * its own name; the `sets --t-solid` rows say which token feeds it.
 */
function tokenInArbitrary(value) {
  const m = /var\(--([a-z0-9-]+)\)/i.exec(value)
  if (!m) return null
  return resolveVar(m[1]) ?? m[1]
}

// ---------------------------------------------------------------------------
// Classifying one utility class into Attribute + Token
// ---------------------------------------------------------------------------

/** Attribute order within a (part, state) group, matching the contract's tables. */
const ATTR_ORDER = [
  "background",
  "text",
  "border colour",
  "border width",
  "radius",
  "ring",
  "shadow",
  "size",
  "padding",
  "gap",
  "type",
  "easing",
]

const SIZE_PREFIXES = [
  "size",
  "h",
  "w",
  "min-w",
  "min-h",
  "max-w",
  "max-h",
  "basis",
]
const PADDING_PREFIXES = ["p", "px", "py", "pt", "pb", "pl", "pr", "ps", "pe"]
/**
 * Keyword typography the map reports. Purely presentational keywords with no
 * measurable value (`uppercase`, `italic`, `whitespace-nowrap`) are left out,
 * so the type rows stay the ones a designer can check against a type style.
 */
const TYPE_WORDS = new Set([
  "text-balance",
  "text-center",
  "text-left",
  "text-right",
  "text-current",
])

/**
 * Classify a bare utility (variants already stripped).
 * Returns {attribute, token} where `token` is a semantic name, or
 * {attribute, fixed} for a value that is not traced to a token, or null to
 * drop the class (layout, transitions, transforms and the like are not
 * styling the map is about).
 */
function classify(raw) {
  // An importance marker says how hard the rule pushes, not what it sets.
  // (Sonner's stylesheet outranks plain utilities, so its classes carry `!`.)
  const cls = raw.replace(/!$/, "").replace(/^!/, "")

  // A custom property set inline: `[--t-solid:var(--primary-normal)]`.
  const prop = /^\[--([a-z0-9-]+):(.+)\]$/i.exec(cls)
  if (prop) {
    const token = tokenInArbitrary(prop[2]) ?? resolveVar(prop[2])
    return token ? { attribute: `sets --${prop[1]}`, token } : null
  }

  if (TYPE_WORDS.has(cls)) return { attribute: "type", fixed: raw }

  const dash = cls.indexOf("-")
  const head = dash === -1 ? cls : cls.slice(0, dash)
  const tail = dash === -1 ? "" : cls.slice(dash + 1)

  const arbitrary = (v) => /^[[(].*[\])]$/.test(v)
  const valueToken = (v) =>
    arbitrary(v) ? tokenInArbitrary(v.slice(1, -1)) : colorToken(v)

  switch (head) {
    case "bg": {
      const token = valueToken(tail)
      return token ? { attribute: "background", token } : null
    }
    case "text": {
      // `text-sm`, `text-[15px]`, `text-sm/relaxed` are type; a colour is text.
      const token = valueToken(tail)
      if (token) return { attribute: "text", token }
      return { attribute: "type", fixed: raw }
    }
    case "border": {
      if (tail === "") return null // bare `border` is a 1px default, not a value
      const token = valueToken(tail)
      if (token) return { attribute: "border colour", token }
      // A width: `border-2`, `border-0`, `border-[1.5px]`.
      if (/^(\d+|\[[^\]]+\])$/.test(tail))
        return { attribute: "border width", fixed: raw }
      return null // `border-solid`, `border-t` and friends are not values
    }
    case "rounded": {
      const token = resolveVar(`radius-${tail || "DEFAULT"}`)
      if (token) return { attribute: "radius", token }
      const inner = arbitrary(tail) ? tokenInArbitrary(tail.slice(1, -1)) : null
      return inner
        ? { attribute: "radius", token: inner }
        : { attribute: "radius", fixed: raw }
    }
    case "ring":
    case "outline": {
      const token = valueToken(tail)
      return token ? { attribute: "ring", token } : null
    }
    case "shadow": {
      const token = resolveVar(`shadow-${tail}`) ?? valueToken(tail)
      return token ? { attribute: "shadow", token } : null
    }
    case "ease": {
      const token = resolveVar(`ease-${tail}`)
      return token ? { attribute: "easing", token } : null
    }
    case "font":
    case "leading":
    case "tracking":
      return { attribute: "type", fixed: raw }
    case "gap":
    case "gap-x":
    case "gap-y":
      return { attribute: "gap", fixed: raw }
  }

  // Multi-segment heads (`min-w-0`, `max-h-[…]`, `px-3`).
  for (const p of SIZE_PREFIXES) {
    if (cls === p || cls.startsWith(`${p}-`))
      return { attribute: "size", fixed: raw }
  }
  for (const p of PADDING_PREFIXES) {
    if (cls.startsWith(`${p}-`)) return { attribute: "padding", fixed: raw }
  }
  if (cls.startsWith("gap-")) return { attribute: "gap", fixed: raw }

  return null
}

// ---------------------------------------------------------------------------
// Variant prefixes → the State or variant column
// ---------------------------------------------------------------------------

/** Prefixes that qualify *when* a rule applies without being a design state. */
const IGNORED_PREFIXES = new Set([
  "motion-safe",
  "motion-reduce",
  "rtl",
  "ltr",
  "print",
  "supports-[backdrop-filter]",
])

/** Split `a:b-[x:y]:c` on top-level colons only. */
function splitVariants(cls) {
  const parts = []
  let depth = 0
  let start = 0
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i]
    if (c === "[" || c === "(") depth++
    else if (c === "]" || c === ")") depth--
    else if (c === ":" && depth === 0) {
      parts.push(cls.slice(start, i))
      start = i + 1
    }
  }
  parts.push(cls.slice(start))
  return parts
}

/**
 * `data-[panel-open]` → `panel-open`; `group-data-[size=sm]/switch` →
 * `size=sm`; `*` stays `*`. A `group-*` prefix names where the state lives,
 * not the state, so it is dropped — except `group-has-*`, which is a
 * different condition and stays as written.
 */
function prettyPrefix(p) {
  let s = p.replace(/\/[A-Za-z0-9_-]+$/, "")
  if (/^group-(data-|aria-|active|hover|focus|disabled|open|checked)/.test(s))
    s = s.slice(6)
  const arb = /^data-\[(.+)\]$/.exec(s)
  if (arb) return arb[1]
  if (s.startsWith("data-")) return s.slice(5)
  if (s.startsWith("aria-")) return s.slice(5)
  return s
}

// ---------------------------------------------------------------------------
// Walking the component's TSX for (part, state, class string)
// ---------------------------------------------------------------------------

/** `dropdown-menu-sub-trigger` under component DropdownMenu → `sub-trigger`. */
function partName(slot, componentKebab) {
  if (slot === componentKebab) return "base"
  if (slot.startsWith(`${componentKebab}-`))
    return slot.slice(componentKebab.length + 1)
  return slot
}

function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase()
}

/**
 * Collect {part, state, classes} triples from one source file.
 * `state` is the cva variant selector; Tailwind variant prefixes are added
 * later, per class.
 */
function collectFromFile(file, componentKebab, out) {
  const fileKebab = file.replace(/^.*\//, "").replace(/\.tsx?$/, "")
  const src = readFileSync(file, "utf8")
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  // Icon components are not parts: an icon sized inside an item is that
  // item's styling. Everything imported from the icon library is skipped
  // when naming a part.
  const iconLibrary = componentsJson.iconLibrary ?? "lucide"
  const icons = new Set()
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    const from = stmt.moduleSpecifier.getText(sf).replace(/['"]/g, "")
    if (!from.includes(iconLibrary)) continue
    const bindings = stmt.importClause?.namedBindings
    if (bindings && ts.isNamedImports(bindings))
      for (const el of bindings.elements) icons.add(el.name.text)
  }

  // Module-level consts, so a shared class string resolves to the element that
  // uses it rather than to whatever happened to be declared above it.
  const consts = new Map()
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const d of stmt.declarationList.declarations) {
      if (ts.isIdentifier(d.name) && d.initializer)
        consts.set(d.name.text, d.initializer)
    }
  }

  /** Flatten an expression into [{state, text}] class strings. */
  function classStrings(node, state, seen = new Set()) {
    if (!node) return []
    if (ts.isParenthesizedExpression(node))
      return classStrings(node.expression, state, seen)

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      return [{ state, text: node.text }]

    if (ts.isTemplateExpression(node)) {
      const out = [{ state, text: node.head.text }]
      for (const span of node.templateSpans) {
        out.push(...classStrings(span.expression, state, seen))
        out.push({ state, text: span.literal.text })
      }
      return out
    }

    if (ts.isArrayLiteralExpression(node))
      return node.elements.flatMap((e) => classStrings(e, state, seen))

    if (ts.isConditionalExpression(node))
      return [
        ...classStrings(node.whenTrue, state, seen),
        ...classStrings(node.whenFalse, state, seen),
      ]

    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
        node.operatorToken.kind === ts.SyntaxKind.BarBarToken)
    )
      return [
        ...classStrings(node.left, state, seen),
        ...classStrings(node.right, state, seen),
      ]

    if (ts.isIdentifier(node)) {
      if (seen.has(node.text)) return []
      const init = consts.get(node.text)
      if (!init) return []
      return classStrings(init, state, new Set([...seen, node.text]))
    }

    if (ts.isCallExpression(node)) {
      const callee = node.expression
      const name = ts.isIdentifier(callee) ? callee.text : ""
      if (name === "cn" || name === "clsx" || name === "cx")
        return node.arguments.flatMap((a) => classStrings(a, state, seen))
      // `[...].join(" ")` — a long class list broken over lines.
      if (
        ts.isPropertyAccessExpression(callee) &&
        callee.name.text === "join"
      )
        return classStrings(callee.expression, state, seen)
      if (name === "cva") return cvaStrings(node, state)
      // `buttonVariants({…})` or another component's cva — resolve it, but only
      // when it is declared in this file, so Button's own rows stay Button's.
      const init = ts.isIdentifier(callee) ? consts.get(callee.text) : null
      if (init && ts.isCallExpression(init) && isCva(init) && !seen.has(name))
        return cvaStrings(init, state)
      return []
    }

    return []
  }

  const isCva = (n) =>
    ts.isCallExpression(n) &&
    ts.isIdentifier(n.expression) &&
    n.expression.text === "cva"

  /** Expand a cva() call into base, per-variant and compound class strings. */
  function cvaStrings(call, outerState) {
    const res = []
    const join = (s) => (outerState && outerState !== "—" ? `${outerState} · ${s}` : s)
    const [base, config] = call.arguments
    res.push(...classStrings(base, outerState ?? "—"))
    if (!config || !ts.isObjectLiteralExpression(config)) return res

    for (const prop of config.properties) {
      if (!ts.isPropertyAssignment(prop)) continue
      const key = prop.name.getText(sf).replace(/['"]/g, "")

      if (key === "variants" && ts.isObjectLiteralExpression(prop.initializer)) {
        for (const group of prop.initializer.properties) {
          if (!ts.isPropertyAssignment(group)) continue
          const axis = group.name.getText(sf).replace(/['"]/g, "")
          if (!ts.isObjectLiteralExpression(group.initializer)) continue
          for (const entry of group.initializer.properties) {
            if (!ts.isPropertyAssignment(entry)) continue
            const value = entry.name.getText(sf).replace(/['"]/g, "")
            res.push(...classStrings(entry.initializer, join(`${axis}=${value}`)))
          }
        }
      }

      if (key === "compoundVariants" && ts.isArrayLiteralExpression(prop.initializer)) {
        for (const entry of prop.initializer.elements) {
          if (!ts.isObjectLiteralExpression(entry)) continue
          for (const p of entry.properties) {
            if (!ts.isPropertyAssignment(p)) continue
            const k = p.name.getText(sf).replace(/['"]/g, "")
            if (k === "class" || k === "className")
              res.push(...classStrings(p.initializer, join("compound")))
          }
        }
      }
    }
    return res
  }

  /**
   * Classes reach an element two ways: as JSX attributes, and as a props
   * object (Base UI's `useRender`, Sonner's `toastOptions`). Both are read
   * the same way, so a component that composes rather than renders JSX is
   * not silently skipped.
   */
  function propReader(node) {
    if (ts.isJsxOpeningLikeElement(node)) {
      const attrs = node.attributes.properties
      return (name) => {
        const a = attrs.find(
          (x) => ts.isJsxAttribute(x) && x.name.getText(sf) === name
        )
        if (!a?.initializer) return null
        return ts.isJsxExpression(a.initializer)
          ? a.initializer.expression
          : a.initializer
      }
    }
    if (ts.isObjectLiteralExpression(node)) {
      const has = node.properties.some(
        (p) =>
          ts.isPropertyAssignment(p) &&
          ["className", "classNames", "data-slot"].includes(
            p.name.getText(sf).replace(/['"]/g, "")
          )
      )
      if (!has) return null
      return (name) => {
        const p = node.properties.find(
          (x) =>
            ts.isPropertyAssignment(x) &&
            x.name.getText(sf).replace(/['"]/g, "") === name
        )
        return p && ts.isPropertyAssignment(p) ? p.initializer : null
      }
    }
    return null
  }

  // Walk, carrying the nearest enclosing data-slot and, failing that, the
  // enclosing function's name.
  function walk(node, slot, fnName) {
    if (
      (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)) &&
      node.name
    )
      fnName = node.name.text
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer &&
      (ts.isArrowFunction(node.initializer) ||
        ts.isFunctionExpression(node.initializer))
    )
      fnName = node.name.text

    let localSlot = slot
    const get = propReader(node)
    if (get) {
      const slotNode = get("data-slot")
      if (slotNode && ts.isStringLiteral(slotNode)) localSlot = slotNode.text

      // A library primitive nested inside a slotted element is its own part
      // (Popover's Arrow inside the Popup), not more styling for the parent.
      // Only PascalCase tags count: a bare <div> is a wrapper, not a part.
      let tagPart = null
      if (!slotNode && ts.isJsxOpeningLikeElement(node)) {
        const full = node.tagName.getText(sf)
        const tag = full.split(".").pop() ?? ""
        if (/^[A-Z]/.test(tag) && !icons.has(full)) tagPart = kebab(tag)
      }

      const part = tagPart
        ? partName(tagPart, componentKebab)
        : localSlot
          ? partName(localSlot, componentKebab)
          : partName(kebab(fnName ?? "base"), componentKebab)

      const cn = get("className")
      if (cn)
        for (const { state, text } of classStrings(cn, "—"))
          out.push({ part, state, text })

      // react-day-picker and Sonner take a map of part → classes. The keys
      // are part names already, qualified by the file they come from so a
      // multi-file component says which piece a row belongs to
      // (DatePicker: `calendar-today`; Sonner: plain `title`).
      const cns = get("classNames")
      if (cns && ts.isObjectLiteralExpression(cns)) {
        for (const p of cns.properties) {
          if (!ts.isPropertyAssignment(p)) continue
          const key = kebab(p.name.getText(sf).replace(/['"]/g, "")).replace(
            /_/g,
            "-"
          )
          const sub = fileKebab === componentKebab ? key : `${fileKebab}-${key}`
          for (const { state, text } of classStrings(p.initializer, "—"))
            out.push({ part: sub, state, text })
        }
      }
    }

    ts.forEachChild(node, (c) => walk(c, localSlot, fnName))
  }

  walk(sf, null, null)
}

// ---------------------------------------------------------------------------
// Rows
// ---------------------------------------------------------------------------

function rowsFor(component, files) {
  const componentKebab = kebab(component)
  const raw = []
  for (const f of files) collectFromFile(f, componentKebab, raw)

  const rows = new Map() // key → row, so a class repeated across files lands once
  for (const { part, state, text } of raw) {
    for (const cls of text.split(/\s+/).filter(Boolean)) {
      const segments = splitVariants(cls)
      const bare = segments.pop()
      const prefixes = segments
        .filter((p) => !IGNORED_PREFIXES.has(p))
        .map(prettyPrefix)

      const result = classify(bare)
      if (!result) continue

      const stateParts = []
      if (state && state !== "—") stateParts.push(state)
      stateParts.push(...prefixes)
      const stateText = stateParts.length ? stateParts.join(" · ") : "—"

      const value = result.token
        ? `\`${result.token}\``
        : `${result.fixed} — fixed in code`
      const key = `${part}\u0000${stateText}\u0000${result.attribute}\u0000${value}`
      if (!rows.has(key))
        rows.set(key, { part, state: stateText, attribute: result.attribute, value })
    }
  }

  const list = [...rows.values()]
  const partRank = (p) => (p === "base" ? "" : p)
  const stateRank = (s) => (s === "—" ? "" : s)
  list.sort(
    (a, b) =>
      partRank(a.part).localeCompare(partRank(b.part)) ||
      stateRank(a.state).localeCompare(stateRank(b.state)) ||
      ATTR_ORDER.indexOf(a.attribute) - ATTR_ORDER.indexOf(b.attribute) ||
      a.attribute.localeCompare(b.attribute) ||
      a.value.localeCompare(b.value)
  )
  return list
}

/** The files a component is built from. */
function filesFor(component) {
  const listed = EXTRA_FILES[component]
  const names = listed ?? [`${kebab(component)}.tsx`]
  const paths = names.map((n) => join(UI, n))
  for (const p of paths)
    if (!existsSync(p)) throw new Error(`no such component file: ${p}`)
  return paths
}

function tableFor(component) {
  const files = filesFor(component)
  const rows = rowsFor(component, files)
  const rel = files.map((f) => `\`${f.slice(REPO.length + 1)}\``).join(", ")
  const date = new Date().toISOString().slice(0, 10)
  const lines = [
    `**Styling map** — generated from ${rel} on ${date}. Values come from the code; a token change regenerates the token file, not this table.`,
    "",
    "| Part | State or variant | Attribute | Token |",
    "|---|---|---|---|",
    ...rows.map((r) => `| ${r.part} | ${r.state} | ${r.attribute} | ${r.value} |`),
  ]
  return lines.join("\n")
}

// ---------------------------------------------------------------------------

const args = process.argv.slice(2)
if (args[0] === "--all") {
  const names = Object.keys(EXTRA_FILES).length
    ? Object.keys(EXTRA_FILES)
    : []
  if (!names.length) {
    console.error("--all needs `componentFiles` in .ttt/design-system.json")
    process.exit(1)
  }
  for (const c of names.sort()) {
    console.log(`\n<!-- ${c} -->`)
    console.log(tableFor(c))
  }
} else if (args.length) {
  console.log(tableFor(args[0]))
} else {
  console.error("usage: ds-styling-maps.mjs <Component> | --all")
  process.exit(1)
}
