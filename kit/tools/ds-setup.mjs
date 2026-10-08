#!/usr/bin/env node
// design-system-kit 0.5.1 · Setup tool — runs from the kit, never copied into a client repo
/**
 * ds-setup.mjs — the two mechanical parts of Setup's "generate" step.
 *
 *   node kit/tools/ds-setup.mjs tokens --inputs <inputs.json> --out <tokens.json> [--report <report.md>]
 *       The template's tokens with the client's inputs applied: role-named
 *       ramps generated from each brand hex (the hex lands on the ramp's
 *       documented step), the neutral tint, status ramps (separate or reusing
 *       brand ramps), client-added ramps, radius and motion character, font
 *       families. Then every contrast pair is checked and the adjustable
 *       foregrounds (on-*, *-text, status-*, inverse-*, chart-*) are moved
 *       along their own ramp to the nearest step that passes. Exits 1 if any
 *       pair still fails (other than the config template's intentional ones).
 *
 *   node kit/tools/ds-setup.mjs fill --from <dir> --to <dir> --values <values.json>
 *       Copies a folder (the kit template) and replaces every {{KEY}} whose KEY
 *       is in values.json. Prints each placeholder left, by file, and exits 1
 *       if any is left — the rest are prose for Setup to write from the inputs.
 *
 * Everything it decides is in the report: ramps per step, every adjustment
 * (token, theme, old → new, ratio), semantic tokens that resolve to raw values,
 * and grounds that resolve to the same colour.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, copyFileSync } from "node:fs"
import { join, resolve, dirname, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { check, parseColour, ratio } from "../code/shadcn/scripts/ds-contrast.mjs"

const HERE = dirname(fileURLToPath(import.meta.url))
const KIT = resolve(HERE, "..")
const ALIAS = /^\{([^}]+)\}$/

// ---------------------------------------------------------------------------
// OKLCH ⇄ sRGB
// ---------------------------------------------------------------------------

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

export function hexToOklch(hex) {
  const h = String(hex).trim().replace(/^#/, "")
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`"${hex}" isn't a #rrggbb colour`)
  const [r, g, b] = [0, 2, 4].map((i) => toLinear(parseInt(h.slice(i, i + 2), 16) / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(A, B), H: (Math.atan2(B, A) * 180) / Math.PI }
}

function oklchToLinear({ L, C, H }) {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

const inGamut = (rgb) => rgb.every((c) => c >= -1e-6 && c <= 1 + 1e-6)

/** The colour at L and H with the most chroma up to C that sRGB can show. */
export function oklchToHex({ L, C, H }) {
  let lo = 0, hi = C
  if (!inGamut(oklchToLinear({ L, C, H }))) {
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2
      if (inGamut(oklchToLinear({ L, C: mid, H }))) lo = mid
      else hi = mid
    }
    C = lo
  }
  return "#" + oklchToLinear({ L, C, H })
    .map((c) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, c))))) * 255).toString(16).padStart(2, "0"))
    .join("")
}

// ---------------------------------------------------------------------------
// Ramps
// ---------------------------------------------------------------------------

/** A primitive's ramp and step: "brand-primary-50" → ["brand-primary", "50"]. */
const split = (name) => { const m = /^(.*)-(\d+)$/.exec(name); return m ? [m[1], m[2]] : [name, null] }
const isPrimitive = (t) => typeof t.value === "string" && /^Primitive/.test(t.usage ?? "")

/** The template ramp's steps, in order, with their OKLCH. */
function ladder(tokens, ramp) {
  const steps = tokens.color.tokens.filter((t) => isPrimitive(t) && split(t.name)[0] === ramp)
  if (!steps.length) throw new Error(`the template has no "${ramp}" ramp to take its ladder from`)
  return steps.map((t) => ({ step: split(t.name)[1], ...hexToOklch(t.value) }))
}

/**
 * A ramp from one colour: the colour sits exactly on `anchor`; the other
 * steps keep the template ladder's lightness spacing and chroma profile,
 * stretched so the ends stay where the template has them.
 */
export function generateRamp(hex, anchor, templateLadder) {
  const brand = hexToOklch(hex)
  const at = templateLadder.find((s) => s.step === String(anchor))
  if (!at) throw new Error(`step ${anchor} isn't in the ramp (${templateLadder.map((s) => s.step).join(", ")})`)
  const Ls = templateLadder.map((s) => s.L)
  const [lo, hi] = [Math.min(...Ls), Math.max(...Ls)]
  if (brand.L <= lo + 0.01 || brand.L >= hi - 0.01)
    throw new Error(`${hex} is too ${brand.L <= lo + 0.01 ? "dark" : "light"} to sit at step ${anchor}: its lightness ${brand.L.toFixed(3)} is outside the ramp's ${lo.toFixed(3)}–${hi.toFixed(3)}. Ask the designer which step it belongs on.`)
  return templateLadder.map((s) => {
    if (s.step === at.step) return { step: s.step, hex: hex.toLowerCase() }
    const L = s.L <= at.L
      ? lo + ((s.L - lo) * (brand.L - lo)) / (at.L - lo)
      : brand.L + ((s.L - at.L) * (hi - brand.L)) / (hi - at.L)
    const C = at.C > 0.005 ? (brand.C * s.C) / at.C : brand.C
    return { step: s.step, hex: oklchToHex({ L, C, H: brand.H }) }
  })
}

/** The neutral ramp at the template's lightness, tinted toward a hue (chroma ≤ 0.02). */
export function tintNeutral(tint, templateLadder) {
  const t = hexToOklch(tint)
  const C = Math.min(t.C, 0.02)
  return templateLadder.map((s) => ({ step: s.step, hex: oklchToHex({ L: s.L, C, H: t.H }) }))
}

// ---------------------------------------------------------------------------
// Applying the inputs
// ---------------------------------------------------------------------------

/** Where each brand colour lands: the step whose usage text says so (contract, Token tiers). */
export function anchorStep(tokens, ramp) {
  const t = tokens.color.tokens.find((x) => isPrimitive(x) && split(x.name)[0] === ramp && /lands/.test(x.usage))
  if (!t) throw new Error(`the template doesn't document where ${ramp}'s colour lands`)
  return split(t.name)[1]
}

const RADIUS = { sharp: 0.5, default: 1, soft: 1.5 }
const EXPRESSIVE = {
  calm: "cubic-bezier(0.2, 0, 0, 1)",
  playful: "cubic-bezier(0.34, 1.56, 0.64, 1)",
}
const STATUS = ["positive", "cautionary", "negative"]
const BRAND = { primary: "brand-primary", secondary: "brand-secondary", accent: "brand-accent" }
const HUE_WORD = /(^|-)(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|magenta|plum|lavender|lilac|mauve|maroon|crimson|scarlet|tomato|coral|salmon|peach|gold|golden|mustard|olive|mint|navy|aqua|turquoise|brown|tan|beige|cream|ivory|grey|gray|slate|zinc|stone|charcoal|black|white|silver|ruby|sapphire|jade|cobalt|ochre|sand)(-|$)/i

export function applyInputs(template, inputs) {
  const tokens = structuredClone(template)
  const notes = []
  const need = (path, v) => { if (v === undefined || v === null || v === "") throw new Error(`inputs.${path} is missing — ask for it, never guess`) ; return v }

  tokens.name = need("client", inputs.client)
  if (tokens.meta) tokens.meta.source = `TTT kit template ttt-ds/1, generated by Setup for ${inputs.client}`

  const replaceRamp = (ramp, steps, describe) => {
    for (const s of steps) {
      const t = tokens.color.tokens.find((x) => x.name === `${ramp}-${s.step}`)
      t.value = s.hex
      t.usage = `Primitive ${ramp} step ${s.step}. ${describe(s.step)} Never reference in components; use a semantic token.`
    }
  }

  // Brand ramps.
  for (const [role, ramp] of Object.entries(BRAND)) {
    const hex = need(`brand.${role}`, inputs.brand?.[role])
    const anchor = anchorStep(template, ramp)
    replaceRamp(ramp, generateRamp(hex, anchor, ladder(template, ramp)), (step) =>
      step === anchor ? `The client's brand ${role} colour (${hex}) lands here.` : `Generated from the brand ${role} colour (${hex}).`)
  }

  // Neutral.
  const tint = need("neutralTint", inputs.neutralTint)
  if (tint !== "none") {
    replaceRamp("neutral", tintNeutral(tint, ladder(template, "neutral")), () => `Tinted toward ${tint}.`)
  } else {
    replaceRamp("neutral", ladder(template, "neutral").map((s) => ({ step: s.step, hex: template.color.tokens.find((x) => x.name === `neutral-${s.step}`).value })), () => "TTT's cool grey (no tint).")
  }

  // Status: separate ramps (default) or reuse brand ramps.
  const status = need("status", inputs.status)
  if (status.mode === "separate") {
    for (const s of STATUS) {
      const v = need(`status.${s}`, status[s])
      if (v === "default") { replaceRamp(s, ladder(template, s).map((x) => ({ step: x.step, hex: template.color.tokens.find((t) => t.name === `${s}-${x.step}`).value })), () => `TTT's default ${s} colour.`); continue }
      const anchor = anchorStep(template, s)
      replaceRamp(s, generateRamp(v, anchor, ladder(template, s)), (step) => step === anchor ? `The client's ${s} colour (${v}) lands here.` : `Generated from the ${s} colour (${v}).`)
    }
  } else if (status.mode === "reuse") {
    const map = {}
    for (const s of STATUS) {
      const role = need(`status.${s}`, status[s])
      if (!Object.values(BRAND).includes(role)) throw new Error(`inputs.status.${s} is "${role}"; reuse names a brand ramp: ${Object.values(BRAND).join(", ")}`)
      map[s] = role
    }
    tokens.color.tokens = tokens.color.tokens.filter((t) => !(isPrimitive(t) && STATUS.includes(split(t.name)[0])))
    for (const t of tokens.color.tokens) {
      if (!t.value || typeof t.value !== "object") continue
      for (const theme of Object.keys(t.value)) {
        const m = ALIAS.exec(t.value[theme])
        const [ramp, step] = m ? split(m[1]) : []
        if (ramp && map[ramp]) t.value[theme] = `{${map[ramp]}-${step}}`
      }
    }
    notes.push(`Status colours reuse brand ramps: ${STATUS.map((s) => `${s} → ${map[s]}`).join(", ")}; the separate status ramps were removed.`)
  } else throw new Error(`inputs.status.mode is "${status.mode}"; it's "separate" or "reuse"`)

  // Client-added ramps, named by role.
  for (const [i, r] of (inputs.clientRamps ?? []).entries()) {
    const name = need(`clientRamps[${i}].name`, r.name)
    if (HUE_WORD.test(name)) throw new Error(`clientRamps[${i}].name "${name}" names a hue; name it by the role it plays (contract, Token tiers)`)
    if (tokens.color.tokens.some((t) => split(t.name)[0] === name)) throw new Error(`clientRamps[${i}].name "${name}" is already a ramp`)
    const hex = need(`clientRamps[${i}].hex`, r.hex)
    const reason = need(`clientRamps[${i}].reason`, r.reason)
    const anchor = String(r.step ?? 50)
    const steps = generateRamp(hex, anchor, ladder(template, "brand-primary"))
    const at = tokens.color.tokens.findIndex((t) => split(t.name)[0] === "neutral")
    tokens.color.tokens.splice(at, 0, ...steps.map((s) => ({
      name: `${name}-${s.step}`, value: s.hex,
      usage: `Primitive ${name} step ${s.step}. ${reason} ${s.step === anchor ? `Its colour (${hex}) lands here.` : `Generated from ${hex}.`} Never reference in components; use a semantic token.`,
    })))
    notes.push(`Client-added ramp \`${name}\` (${hex} at step ${anchor}) — record it in the System section's client-specific choices.`)
  }

  // Radius character.
  const radius = need("radius", inputs.radius)
  const scale = typeof radius === "string" ? RADIUS[radius] : null
  if (typeof radius === "string" && scale == null) throw new Error(`inputs.radius is "${radius}"; it's sharp, default, soft, or a map of radius token → px`)
  const px = (v) => parseFloat(String(v))
  const space1 = px(tokens.spacing.tokens.find((t) => t.name === "space-1")?.value ?? 4)
  for (const t of tokens.radius.tokens) {
    if (t.name === "radius-full" || t.name === "radius-inset") continue
    if (scale != null) t.value = `${Math.round(px(t.value) * scale)}px`
    else if (radius[t.name] != null) t.value = `${px(radius[t.name])}px`
  }
  const lg = tokens.radius.tokens.find((t) => t.name === "radius-lg"), inset = tokens.radius.tokens.find((t) => t.name === "radius-inset")
  if (lg && inset) inset.value = `${Math.max(0, px(lg.value) - space1)}px`

  // Motion character.
  const motion = need("motion", inputs.motion)
  if (motion !== "default") {
    if (!EXPRESSIVE[motion]) throw new Error(`inputs.motion is "${motion}"; it's calm, default or playful`)
    const t = tokens.easing.tokens.find((x) => x.name === "ease-expressive")
    t.value = EXPRESSIVE[motion]
  }

  // Font families: the client's face first, the template's stack as fallback.
  for (const role of ["display", "sans", "mono"]) {
    const family = need(`fonts.${role}`, inputs.fonts?.[role])
    if (family !== "default") tokens.type.families[role] = `"${family}", ${template.type.families[role]}`
  }
  tokens.type.fonts = (inputs.fonts?.files ?? []).map((f) => ({ family: f.family, file: f.file, weight: f.weight, style: f.style ?? "normal" }))

  return { tokens, notes }
}

// ---------------------------------------------------------------------------
// Contrast fitting
// ---------------------------------------------------------------------------

/** Foregrounds Setup may move along their own ramp (template usage text says "Skill 1 picks"). */
export const ADJUSTABLE = /^(on-|status-(positive|cautionary|negative)$|inverse-(positive|cautionary|negative)$|chart-\d+$)|-text$/

export function fitContrast(tokens, pairs, intentional = []) {
  const changes = []
  const tried = new Map()
  const byName = () => new Map(tokens.color.tokens.map((t) => [t.name, t]))
  const rampSteps = (ramp) => tokens.color.tokens.filter((t) => isPrimitive(t) && split(t.name)[0] === ramp).map((t) => t.name)
  const passes = (fg, theme) => check(tokens, pairs, intentional).rows
    .filter((r) => r.foreground === fg && r.status !== "intentional")
    .every((r) => r.ratios[theme] == null || r.ratios[theme] + 1e-9 >= r.min)

  for (let round = 0; round < 6; round++) {
    const failing = check(tokens, pairs, intentional).rows.filter((r) => r.status === "fail")
    const todo = new Map()
    for (const r of failing) for (const [theme, x] of Object.entries(r.ratios)) if (x + 1e-9 < r.min) todo.set(`${r.foreground}|${theme}`, [r.foreground, theme])
    if (!todo.size) break
    let moved = false
    for (const [fg, theme] of todo.values()) {
      if (!ADJUSTABLE.test(fg)) continue
      const t = byName().get(fg)
      if (!t || typeof t.value !== "object") continue
      const m = ALIAS.exec(t.value[theme] ?? "")
      if (!m) continue
      const current = m[1]
      const candidates = fg.startsWith("on-")
        ? ["neutral-100", "neutral-10", "neutral-0"].filter((n) => byName().has(n))
        : (() => { const list = rampSteps(split(current)[0]); const i = list.indexOf(current); return list.map((n, j) => [n, Math.abs(j - i)]).sort((a, b) => a[1] - b[1]).map(([n]) => n) })()
      const old = t.value[theme]
      let found = null
      const attempts = []
      for (const c of candidates) {
        t.value[theme] = `{${c}}`
        if (passes(fg, theme)) { found = c; break }
        const worst = check(tokens, pairs, intentional).rows
          .filter((r) => r.foreground === fg && r.status !== "intentional" && r.ratios[theme] != null && r.ratios[theme] + 1e-9 < r.min)
          .map((r) => `${r.background} ${r.ratios[theme].toFixed(2)}`)
        attempts.push(`${c} fails on ${worst.join(", ")}`)
      }
      if (!found) tried.set(`${fg}|${theme}`, attempts)
      if (found && `{${found}}` !== old) { changes.push({ token: fg, theme, from: old, to: `{${found}}` }); moved = true }
      else t.value[theme] = old
    }
    if (!moved) break
  }
  const result = check(tokens, pairs, intentional)
  const unresolved = result.rows.filter((r) => r.status === "fail" || r.status === "error")
  for (const r of unresolved) r.tried = Object.keys(r.ratios).flatMap((th) => (tried.get(`${r.foreground}|${th}`) ?? []).map((x) => `${th}: ${x}`))
  return { changes, result, unresolved }
}

/** Semantic tokens with a literal value in some theme, and grounds that resolve to the same colour. */
export function flags(tokens) {
  const byName = new Map(tokens.color.tokens.map((t) => [t.name, t]))
  const themes = tokens.color.themes.map((t) => t.id)
  const literal = (name, theme) => { const t = byName.get(name); const v = typeof t.value === "object" ? t.value[theme] : t.value; const m = ALIAS.exec(v); return m ? literal(m[1], theme) : String(v).toLowerCase() }
  const semantic = tokens.color.tokens.filter((t) => typeof t.value === "object")
  const raw = semantic.flatMap((t) => themes.filter((th) => !ALIAS.test(t.value[th] ?? "")).map((th) => `${t.name} (${th}: ${t.value[th]})`))
  const GROUND = /^(?!line-|thumb-|label-)(background-|fill-|.*-(soft|normal)$)/
  const shared = []
  for (const theme of themes) {
    const groups = new Map()
    for (const t of semantic.filter((x) => GROUND.test(x.name))) {
      const v = literal(t.name, theme)
      groups.set(v, [...(groups.get(v) ?? []), t.name])
    }
    for (const [v, names] of groups) if (names.length > 1) shared.push(`${theme}: ${names.join(" = ")} (${v})`)
  }
  return { raw, shared }
}

// ---------------------------------------------------------------------------
// Placeholders
// ---------------------------------------------------------------------------

export function fill(from, to, values) {
  const left = {}
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const src = join(dir, name), rel = relative(from, src), dst = join(to, rel)
      if (statSync(src).isDirectory()) { walk(src); continue }
      mkdirSync(dirname(dst), { recursive: true })
      if (!/\.(md|json|html|css|js|ts|tsx|txt)$/.test(name)) { copyFileSync(src, dst); continue }
      const text = readFileSync(src, "utf8").replace(/\{\{([A-Z0-9_]+)\}\}/g, (all, key) => (key in values ? String(values[key]) : all))
      writeFileSync(dst, text)
      const rest = [...text.matchAll(/\{\{[^}]+\}\}/g)].map((m) => m[0])
      if (rest.length) left[rel] = [...new Set(rest)]
    }
  }
  walk(from)
  return left
}

// ---------------------------------------------------------------------------

function main() {
  const [cmd, ...argv] = process.argv.slice(2)
  const flag = (n) => { const i = argv.indexOf(n); return i === -1 ? null : argv[i + 1] }
  if (cmd === "tokens") {
    const inputs = JSON.parse(readFileSync(resolve(flag("--inputs")), "utf8"))
    const template = JSON.parse(readFileSync(resolve(flag("--template") ?? join(KIT, "template/tokens.json")), "utf8"))
    const pairs = JSON.parse(readFileSync(resolve(flag("--pairs") ?? join(KIT, "code/shadcn/scripts/contrast-pairs.json")), "utf8"))
    const intentional = JSON.parse(readFileSync(join(KIT, "code/shadcn/wiring/design-system.json"), "utf8")).contrast?.intentional ?? []
    let applied
    try { applied = applyInputs(template, inputs) }
    catch (e) { console.log(`error    ${e.message}`); process.exit(1) }
    const { tokens, notes } = applied
    const { changes, result, unresolved } = fitContrast(tokens, pairs, intentional)
    const { raw, shared } = flags(tokens)
    writeFileSync(resolve(flag("--out")), JSON.stringify(tokens, null, 1) + "\n")
    const lines = [
      `# Generated tokens — ${inputs.client}`, "",
      "## Ramps", "",
      ...[...new Set(tokens.color.tokens.filter(isPrimitive).map((t) => split(t.name)[0]))].map((r) =>
        `- \`${r}\`: ${tokens.color.tokens.filter((t) => isPrimitive(t) && split(t.name)[0] === r).map((t) => `${split(t.name)[1]} ${t.value}`).join(" · ")}`),
      "", "## Contrast adjustments", "",
      ...(changes.length ? changes.map((c) => `- \`${c.token}\` (${c.theme}): ${c.from} → ${c.to}`) : ["none"]),
      "", "## Unresolved pairs", "",
      ...(unresolved.length ? unresolved.map((r) => `- \`${r.foreground}\` on \`${r.background}\` (min ${r.min}): ${Object.entries(r.ratios).map(([t, x]) => `${t} ${x.toFixed(2)}`).join(", ")} ${r.problems.join("; ")}${r.tried?.length ? `\n  - tried: ${[...new Set(r.tried)].join("; ")}` : ""}`) : ["none"]),
      "", "## Semantic tokens with raw values", "", ...(raw.length ? raw.map((x) => `- ${x}`) : ["none"]),
      "", "## Shared grounds", "", ...(shared.length ? shared.map((x) => `- ${x}`) : ["none"]),
      "", "## Notes", "", ...(notes.length ? notes.map((x) => `- ${x}`) : ["none"]),
      "", `${result.rows.length} pairs × ${result.themes.length} themes: ${unresolved.length} failing, ${result.rows.filter((r) => r.status === "intentional").length} intentional`,
    ]
    if (flag("--report")) writeFileSync(resolve(flag("--report")), lines.join("\n") + "\n")
    console.log(lines.join("\n"))
    process.exit(unresolved.length ? 1 : 0)
  }
  if (cmd === "fill") {
    const left = fill(resolve(flag("--from")), resolve(flag("--to")), JSON.parse(readFileSync(resolve(flag("--values")), "utf8")))
    const files = Object.entries(left)
    for (const [f, keys] of files) console.log(`left     ${f}: ${keys.join(" ")}`)
    console.log(files.length ? `\n${files.length} file(s) with placeholders left` : "every placeholder filled")
    process.exit(files.length ? 1 : 0)
  }
  console.log("usage: ds-setup.mjs tokens --inputs <inputs.json> --out <tokens.json> [--report <md>]\n       ds-setup.mjs fill --from <dir> --to <dir> --values <values.json>")
  process.exit(2)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
