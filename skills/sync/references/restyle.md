# Restyle — new brand inputs on a design system that exists

design-system-kit 0.12.0

A project often starts generic and takes on its style once the client
approves UI samples, and a designer may revise a decided value later. Restyle
is how either lands: new values for some of Setup's inputs, regenerated the
way Setup generates them, proposed as a diff, approved by the designer,
published to the design system — then carried to code and Figma by pull.

Tokens, brand and assets are design-owned (contract, Ownership), so restyle
changes the design system first and code follows. It is **values only**:
nothing appears, disappears or is renamed that code uses.

`kit/procedures/common.md` §1–§6 have already run: the config validates,
versions are checked, you've read the live design system's index, and pending
marks this run can verify are flipped. Restyle publishes, so this session must
be the owner's (§4) — if it isn't, stop and say who the owner is.

## 1. What changes — ask, guess nothing

Read the live System section's **Provisional** line: those inputs are what a
restyle usually replaces. (A design system set up before kit 0.11.0 has no
such line: none are provisional.) Ask which inputs change — provisional ones,
or decided ones being revised — and take each answer exactly as Setup's
`skills/setup/references/inputs.md` says: the same formats, decided or
provisional (still provisional means it stays on the line), extraction from
client material only with its source and the person's yes, and the meaning
question for any colour going on a status ramp.

**Not a restyle — stop and say what it needs instead:**

| Change | Instead |
|---|---|
| Client name or namespace | Not supported after Setup. |
| Locale, week start, date format | The app's `locale.ts` and the System section's Client settings line (contract, Client settings) — a dev's PR. |
| Status mode (separate ⇄ reuse) | Removes or adds ramps that code uses: a dev change first, then pull. |
| Kit extensions | Component code: `/ds-upgrade`'s offer. |
| Removing a client-added ramp | Code that uses it moves first (pull, "rename or removal"). |

Write the answers to `<out>/changes.json` — `inputs.json`'s shape with only
the inputs that change, plus `provisional` for those that stay provisional,
and `brandNames` for any brand colour that changes:

```json
{
  "brand": { "primary": "#1f5f8b", "accent": "#f2a541" },
  "brandNames": { "primary": "Harbour", "accent": "Marigold" },
  "fonts": { "display": "Fraunces", "files": [{ "family": "Fraunces", "file": "fonts/Fraunces.woff2", "weight": "100 900", "style": "normal" }] },
  "radius": "soft",
  "provisional": { "brand.accent": "extracted: Volunteer program PDF p. 6" }
}
```

Read the changes back as one summary — old → new for each, and its kind — and
get a "yes".

## 2. Regenerate the tokens

From the live design system's `project/tokens.json`, saved to `<out>/live.json`:

```bash
node <plugin root>/kit/tools/ds-setup.mjs restyle \
  --tokens <out>/live.json --changes <out>/changes.json \
  --config .ttt/design-system.json \
  --out <out>/tokens.json --report <out>/restyle-report.md
```

The tool runs Setup's generators against the template's ladders and grafts
**only** what the changed inputs drive onto the live tokens — a ramp, the
radius tokens, `ease-expressive`, a font family — so the designer's other edits
stay. A colour that lands on another step takes the tokens that were the colour
with it (and back, when a later colour sits on the usual step again). Then
contrast is fitted as in Setup: only the adjustable foregrounds move.

Read the report, as Setup's `generate.md` §2 says:

- **Unresolved pairs → stop.** Same rule as Setup: it's a design decision,
  put to the designer with the ratios and the options; re-run with their
  answer. Never change a ground, a label or the new colour to make it pass.
- **Values changed** is the whole diff: every step of every regenerated ramp,
  every moved alias, every contrast adjustment. Nothing outside it changed.
- **Hand edits replaced** — steps of a regenerated ramp that its own
  generator wouldn't give (the designer edited them in claude.ai). The
  restyle replaces them; the designer sees the list before approving, and
  can pin a colour with `{ "hex", "step" }` or re-apply an edit afterwards.

## 3. Show the designer, then wait

On a new branch from an up-to-date `main` (`ds-sync/restyle-<YYYY-MM-DD>`),
write `<out>/tokens.json` to the token snapshot (`tokensIn`), run
`node $KIT/ds-tokens.mjs`, and build the preview bundle into a scratch folder
(`ds-build-bundle.mjs <out>/components`). Check the previews against it as
Sync's `publish.md` §4 does — both themes, zero errors — and screenshot the
Cover and the components the change shows most on (Button, Badge, Alert,
Card, Field for colour; Dialog and Card for radius; any with text for fonts),
light and dark.

Send the designer the diff summary, the contrast result, the hand edits
replaced, and the screenshots. Then **stop** until they approve in this
chat, as Setup's `review.md` §2 defines approval. Changes asked for → back to
§1.

Nothing is published and nothing is pushed before approval. The branch's
snapshot is a proposal; pull will rewrite it from the live design system.

## 4. Publish to the design system

Re-read the live design system (common.md §3); if `lastChange` moved since
§2, regenerate from the new live tokens and show the designer again. Then
publish, index last:

- `project/tokens.json` — `<out>/tokens.json`, with the "Used by" lists
  carried over from the live file (they don't change in a restyle).
- **Brand book** (`README.md`) — the colour table (name, hex, the step it
  landed on), type families, the radius and motion sentences, logo usage,
  principles and voice — only the parts the changes touch; each extracted
  value names its source, and a still-provisional one keeps its
  "Provisional" mark. A status colour's meaning goes in the colour section.
- **System section** — the **Provisional** line (added above **Open
  deviations** if the design system predates it): remove each input now
  decided, update any still provisional, "None." when nothing is left; the client-specific choices for a
  client-added ramp or a substituted colour.
- **Assets** — new font files under `project/fonts/`, logos in the `Logos`
  group (the Design System type's instructions). A new logo replaces the
  cover's name `<h1>` with the template's `<img class="logo">`.
- **Cover** — tagline and motif, if they changed.
- **Changelog** — one entry: "Restyle: …" naming each input and its new
  value in a clause, owner `design`, the tracker task if there is one;
  `Code pending · Figma pending`.

Read back what you sent.

## 5. Carry it: pull, plus what pull doesn't do

Run `references/pull.md` from §1 on the restyle branch (instead of a new
branch). It snapshots the live tokens byte for byte, regenerates the token
file, checks contrast, validates, tests and builds, pushes the variables to
Figma, opens the PR and rebuilds the design system's preview bundle.

Two things a value change can need that pull doesn't carry — do them on the
same branch, each its own commit, and list them in the PR:

- **Fonts in code** — a family changed: wire it as Setup's `code.md` §4
  "Fonts" says (a package before files; `next/font` or Vite's `fonts.css`),
  and remove the old family's loading if nothing uses it any more. A package
  added at the version you checked; an existing one never changed.
- **Fonts in Figma** — after pull's variables: every text style whose group's
  family changed gets the new font, as Setup's `figma-library.md` §2 says
  (load first; a family Figma doesn't have → ask, don't substitute; a weight
  with no named style rounds to the nearest, said in the report). Read the
  styles back.

Components need nothing: their layers are bound to the variables and text
styles, so the library re-skins. Screenshot one section per page anyway, and
put anything that looks wrong (a tint that didn't follow, a label that no
longer fits) in Gaps rather than patching it by hand.

## 6. Report

Sync's report (`references/report.md`), with the restyle's diff under
"Values changed", the designer's approval under "What changed", and under
Gaps: what is still provisional, every hand edit the restyle replaced, and —
as always after a Figma change — "publish the Figma library".
