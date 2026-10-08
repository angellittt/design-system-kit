// design-system-kit 0.8.0 · Setup tool tests — node --test kit/tools/
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import { hexToOklch, generateRamp, fitOptions, anchorStep, applyInputs, fitContrast, flags, fill } from "./ds-setup.mjs"

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

const ladderOf = (ramp) => template.color.tokens.filter((t) => new RegExp(`^${ramp}-\\d+$`).test(t.name)).map((t) => ({ step: t.name.split("-").pop(), ...hexToOklch(t.value) }))

test("a colour that can't sit on the step it's given is refused, with same-hue options that fit", () => {
  assert.throws(() => generateRamp("#fffefe", "50", ladderOf("brand-primary")), /too light for this ramp at any step/)
  // Districtly's Civic Ink, pinned to step 50: darker than the whole ladder, so 50 can't hold it.
  assert.throws(() => applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: { hex: "#14213D", step: 50 }, accent: "#f5a524" } })),
    /inputs\.brand\.secondary \(brand-secondary\): #14213D is too dark[\s\S]*a\) #[0-9a-f]{6} at step 50[\s\S]*"from": "#14213D"/)
  const ink = hexToOklch("#14213D")
  const options = fitOptions("#14213D", ladderOf("brand-secondary"), "50")
  assert.equal(options.length, 3)
  for (const o of options) {
    assert.equal(o.step, "50")
    assert.doesNotThrow(() => generateRamp(o.hex, o.step, ladderOf("brand-secondary")), `${o.hex} should fit`)
    assert.ok(Math.abs(hexToOklch(o.hex).H - ink.H) < 3, `${o.hex} keeps the hue`)
  }
  const Ls = options.map((o) => hexToOklch(o.hex).L)
  assert.ok(Ls[0] < Ls[1] && Ls[1] < Ls[2], "nearest first, the step's own last")
})

test("a colour can sit on another step, and the tokens that were the colour move with it", () => {
  const { tokens, notes } = applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: { hex: "#384766", step: 20 }, accent: "#f5a524" } }))
  assert.equal(value(tokens, "brand-secondary-20"), "#384766")
  const Ls = tokens.color.tokens.filter((t) => t.name.startsWith("brand-secondary-")).map((t) => hexToOklch(t.value).L)
  assert.ok(Ls.every((L, i) => i === 0 || L > Ls[i - 1]), "still monotonic")
  assert.deepEqual(value(tokens, "secondary-normal"), { light: "{brand-secondary-20}", dark: "{brand-secondary-20}" })
  assert.ok(notes.some((n) => /sits at step 20, not the usual 50\. Moved with it: `secondary-normal \(light\)`/.test(n)))
  assert.throws(() => applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: { hex: "#384766", step: "dark" }, accent: "#f5a524" } })), /step is "dark"/)
  assert.throws(() => applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: { hex: "#384766", step: 45 }, accent: "#f5a524" } })), /step 45 isn't in the ramp/)
})

test("a stand-in colour records what it replaced", () => {
  const { tokens, notes } = applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: { hex: "#465676", step: "50", from: "#14213D" }, accent: "#f5a524" } }))
  assert.match(tokens.color.tokens.find((t) => t.name === "brand-secondary-50").usage, /#465676, chosen in place of #14213D/)
  assert.ok(notes.some((n) => /stands in for #14213D/.test(n)))
})

test("an anchor on a near-grey end step doesn't saturate the middle past the brand colour", () => {
  const brand = hexToOklch("#1f2d4a")
  const steps = generateRamp("#1f2d4a", "10", ladderOf("brand-secondary"))
  assert.ok(steps.every((s) => hexToOklch(s.hex).C <= brand.C * 1.25 + 0.005), "chroma capped")
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

const gaps = (tokens, ramp) => {
  const Ls = tokens.color.tokens.filter((t) => new RegExp(`^${ramp}-\\d+$`).test(t.name)).map((t) => hexToOklch(t.value).L)
  return Ls.slice(1).map((L, i) => L - Ls[i])
}

test("a dark colour that would squeeze its usual step moves to the step its lightness matches", () => {
  // Districtly's lightened navy: on 50, steps 10–50 shared 0.12 of lightness.
  const { tokens, notes } = applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: "#384766", accent: "#f5a524" } }))
  assert.equal(value(tokens, "brand-secondary-20"), "#384766")
  assert.deepEqual(value(tokens, "secondary-normal"), { light: "{brand-secondary-20}", dark: "{brand-secondary-20}" })
  assert.ok(Math.min(...gaps(tokens, "brand-secondary").slice(0, 4)) > 0.05, "the dark steps keep their spacing")
  assert.ok(notes.some((n) => /would squeeze the ramp at step 50 .* so it sits at step 20/.test(n)))
})

test("a colour darker than the whole ladder anchors the darkest step, which stretches to it", () => {
  // Districtly's original Civic Ink, no longer swapped for a lighter stand-in.
  const { tokens } = applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: "#14213D", accent: "#f5a524" } }))
  assert.equal(value(tokens, "brand-secondary-10"), "#14213d")
  assert.deepEqual(value(tokens, "secondary-normal"), { light: "{brand-secondary-10}", dark: "{brand-secondary-10}" })
  assert.ok(gaps(tokens, "brand-secondary").every((g) => g > 0), "monotonic")
  assert.throws(() => applyInputs(template, inputs({ brand: { primary: "#2f4bda", secondary: "#010102", accent: "#f5a524" } })), /too dark for this ramp at any step/)
})

test("mid-tone colours stay on their usual step", () => {
  for (const [primary, accent] of [["#fe4a49", "#fed766"], ["#1D5BD1", "#F5A623"], ["#2f4bda", "#f5a524"]]) {
    const { tokens } = applyInputs(template, inputs({ brand: { primary, secondary: "#0f9d8a", accent } }))
    assert.equal(value(tokens, "brand-primary-50"), primary.toLowerCase(), primary)
    assert.equal(value(tokens, "brand-accent-60"), accent.toLowerCase(), accent)
  }
})
