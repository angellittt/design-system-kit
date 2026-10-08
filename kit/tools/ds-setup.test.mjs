// design-system-kit 0.4.1 · Setup tool tests — node --test kit/tools/
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import { hexToOklch, generateRamp, anchorStep, applyInputs, fitContrast, flags, fill } from "./ds-setup.mjs"

const KIT = join(dirname(fileURLToPath(import.meta.url)), "..")
const template = JSON.parse(readFileSync(join(KIT, "template/tokens.json"), "utf8"))
const pairs = JSON.parse(readFileSync(join(KIT, "code/shadcn/scripts/contrast-pairs.json"), "utf8"))
const intentional = JSON.parse(readFileSync(join(KIT, "code/shadcn/wiring/design-system.json"), "utf8")).contrast.intentional
const inputs = (over = {}) => ({
  client: "Probe", brand: { primary: "#2f4bda", secondary: "#0f9d8a", accent: "#f5a524" }, neutralTint: "none",
  status: { mode: "separate", positive: "default", cautionary: "default", negative: "default" },
  radius: "default", motion: "default", fonts: { display: "default", sans: "Inter", mono: "default" }, ...over,
})
const value = (tokens, name) => tokens.color.tokens.find((t) => t.name === name)?.value

test("the brand colour lands on its documented step, and lightness rises step by step", () => {
  assert.deepEqual(["brand-primary", "brand-secondary", "brand-accent"].map((r) => anchorStep(template, r)), ["50", "50", "60"])
  const { tokens } = applyInputs(template, inputs())
  assert.equal(value(tokens, "brand-primary-50"), "#2f4bda")
  assert.equal(value(tokens, "brand-accent-60"), "#f5a524")
  for (const ramp of ["brand-primary", "brand-secondary", "brand-accent"]) {
    const Ls = tokens.color.tokens.filter((t) => t.name.startsWith(`${ramp}-`)).map((t) => hexToOklch(t.value).L)
    assert.ok(Ls.every((L, i) => i === 0 || L > Ls[i - 1]), `${ramp} isn't monotonic`)
  }
})

test("a colour too light for its step is refused, not stretched", () => {
  const ladder = template.color.tokens.filter((t) => /^brand-primary-\d+$/.test(t.name)).map((t) => ({ step: t.name.split("-").pop(), ...hexToOklch(t.value) }))
  assert.throws(() => generateRamp("#fffefe", "50", ladder), /too light to sit at step 50/)
})

test("every missing input is named, never guessed", () => {
  assert.throws(() => applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: "#0f9d8a" } })), /inputs\.brand\.accent is missing/)
  assert.throws(() => applyInputs(template, inputs({ neutralTint: undefined })), /inputs\.neutralTint is missing/)
  assert.throws(() => applyInputs(template, inputs({ radius: "round" })), /sharp, default, soft/)
})

test("status reuse removes the status ramps and re-aliases everything that used them", () => {
  const { tokens } = applyInputs(template, inputs({ status: { mode: "reuse", positive: "brand-secondary", cautionary: "brand-accent", negative: "brand-primary" } }))
  assert.equal(tokens.color.tokens.some((t) => /^(positive|cautionary|negative)-\d+$/.test(t.name)), false)
  assert.deepEqual(value(tokens, "status-positive"), { light: "{brand-secondary-30}", dark: "{brand-secondary-60}" })
  assert.equal(JSON.stringify(tokens).includes("{positive-"), false)
})

test("client-added ramps must be role-named", () => {
  const { tokens } = applyInputs(template, inputs({ clientRamps: [{ name: "data", hex: "#9145d3", step: 50, reason: "Charts." }] }))
  assert.equal(value(tokens, "data-50"), "#9145d3")
  assert.throws(() => applyInputs(template, inputs({ clientRamps: [{ name: "plum", hex: "#9145d3", reason: "Charts." }] })), /names a hue/)
})

test("radius and motion character", () => {
  const { tokens } = applyInputs(template, inputs({ radius: "soft", motion: "playful" }))
  const r = (n) => tokens.radius.tokens.find((t) => t.name === n).value
  assert.equal(r("radius-lg"), "18px")
  assert.equal(r("radius-inset"), "14px")
  assert.equal(r("radius-full"), "999px")
  assert.match(tokens.easing.tokens.find((t) => t.name === "ease-expressive").value, /1\.56/)
})

test("contrast fitting moves only adjustable foregrounds, and reports what it couldn't fix", () => {
  const { tokens } = applyInputs(template, inputs())
  assert.equal(fitContrast(tokens, pairs, intentional).unresolved.length, 0)
  const hot = applyInputs(template, inputs({ brand: { primary: "#f25c54", secondary: "#3bb4c1", accent: "#f7d154" } })).tokens
  const { changes, unresolved } = fitContrast(hot, pairs, intentional)
  assert.ok(changes.every((c) => /^(on-|status-|inverse-|chart-)|-text$/.test(c.token)))
  assert.ok(unresolved.some((r) => r.foreground === "on-primary" && r.tried.length))
})

test("flags raw semantic values and shared grounds", () => {
  const { raw, shared } = flags(applyInputs(template, inputs()).tokens)
  assert.ok(raw.some((x) => x.startsWith("material-dimmer")))
  assert.ok(shared.some((x) => x.includes("background-normal = background-elevated")))
})

test("fill replaces known placeholders and lists the rest", () => {
  const from = mkdtempSync(join(tmpdir(), "fill-from-")), to = mkdtempSync(join(tmpdir(), "fill-to-"))
  mkdirSync(join(from, "a"))
  writeFileSync(join(from, "a/x.md"), "{{CLIENT_NAME}} uses {{NAMESPACE}}; {{VOICE}}")
  const left = fill(from, to, { CLIENT_NAME: "Acme", NAMESPACE: "Acme" })
  assert.equal(readFileSync(join(to, "a/x.md"), "utf8"), "Acme uses Acme; {{VOICE}}")
  assert.deepEqual(left, { "a/x.md": ["{{VOICE}}"] })
})
