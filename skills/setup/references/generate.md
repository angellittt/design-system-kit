# Generate — tokens, then the design system

design-system-kit 0.3.0

Two halves, with the code branch in between (`code.md`): the tokens come
first because the code needs them; the design system comes after the code
because its bundle, previews, styling maps and "Using in code" are built from
the branch.

Work in a scratch folder (`<out>`), never in the kit's files.

# Part A — Tokens (Setup step 4)

## 1. Generate from the template

```bash
node <plugin root>/kit/tools/ds-setup.mjs tokens \
  --inputs <out>/inputs.json --out <out>/tokens.json --report <out>/tokens-report.md
```

The tool starts from `kit/template/tokens.json` and applies the inputs:

- **Brand ramps** (`brand-primary`, `brand-secondary`, `brand-accent`): each
  generated from its hex in OKLCH. The hex lands **exactly** on the step the
  template documents ("…where the client's brand … colour lands"); the other
  steps keep the template ladder's lightness spacing and chroma profile, with
  the brand hue. A colour too light or dark for its step is refused with a
  message — ask the designer which step it belongs on; never move it
  yourself.
- **Neutral**, **status** (separate or reuse), **client-added ramps**,
  **radius**, **motion** and **font families**, as `inputs.md` describes.
- **Contrast fitting.** Every pair in `contrast-pairs.json` is checked in
  both themes. Only the foregrounds the template says Setup picks are moved:
  `on-*` (white or ink), `*-text`, `status-*`, `inverse-*` and `chart-*` —
  each along its own ramp to the nearest step where all of its pairs pass.
  Brand fills, grounds and labels are never moved.

The tool exits 1 on any input it can't use (it names the field) and on any
pair it couldn't fix.

## 2. Contrast must pass — or stop

Read `<out>/tokens-report.md`:

- **Unresolved pairs → stop.** Never go on with a failing pair, and never
  fix one by changing a brand colour, a ground or a label. Each unresolved
  pair lists what was tried, e.g. "`on-primary` — `neutral-100` fails on
  `primary-normal` 3.34; `neutral-10` fails on `primary-strong` 3.43": no
  single foreground works on both fills. That is a design decision (here:
  move `primary-strong` lighter, or accept ink and lighten the hover state).
  Put the pair, its ratios and the options to the designer; re-run with
  their answer recorded in `inputs.json` (e.g. an explicit step) and continue
  only when the report shows **0 failing**. `label-disable` is intentionally
  below; nothing else is.
- **Contrast adjustments** — list each in the report (`token`, theme,
  old → new step). They are Setup's decision; the designer sees them at review.
- **Semantic tokens with raw values** — semantic tokens should alias a
  primitive. The template's `material-dimmer` (translucent) is expected;
  anything else is listed for the designer.
- **Shared grounds** — two grounds resolving to the same colour in a theme
  (e.g. `background-normal = background-elevated` in light). Not an error —
  the profile separates them with borders and shadows — but the designer
  should see them before approving.

Check the tokens validate:

```bash
node <plugin root>/kit/code/<profile>/scripts/ds-validate.mjs \
  --template <plugin root>/kit/code/<profile>/wiring/design-system.json --tokens <out>/tokens.json
```

Its one expected warning lists the config template's placeholders (the code
step fills them). Any error → stop.

Then build the code branch (`code.md`) before Part B.

# Part B — The design system (Setup step 6)

## 3. Write its files

Fill the template into `<out>/ds/project/` (the Design System type keeps its
content under `project/`):

```bash
node <plugin root>/kit/tools/ds-setup.mjs fill \
  --from <plugin root>/kit/template --to <out>/ds/project --values <out>/values.json
```

`values.json` holds every mechanical placeholder from the inputs and the
prerequisites: `CLIENT_NAME`, `NAMESPACE`, `PROFILE`, `PROFILE_VERSION`,
`KIT_VERSION`, `OWNER`, `REPO`, `TRACKER_URL`, `FIGMA_LIBRARY` (pending
until step 8 — "pending"), `LOCALE`, `WEEK_START` (the day's name),
`DATE_FORMAT`, `REACT_VERSION` (the repo's installed React), `NOW_ISO` and
`NOW_SHORT_DATE` (system clock, common.md §5), `TYPE_CLASS_PREFIX`,
`TOKENS_OUT`, `N_IMPLEMENTED` (0) and `N_VALIDATED` (the number of
components). The tool lists every placeholder it left; then:

- **`tokens.json`** — replace the filled template copy with the generated
  tokens, then add the "Used by" lists from the branch:
  `node scripts/ds-styling-maps.mjs --used-by <out>/tokens.json <out>/ds/project/tokens.json`
  (run in the client repo, on the Setup branch).
- **`README.md`** (the brand book) — write every remaining `{{…}}` from the
  inputs: the one-sentence summary, principles and voice (from the
  guidelines, or the person's answers), the colour table (brand names and
  hexes, with the step each landed on), type families, the radius and motion
  sentences, the icon library (the profile's default unless the guidelines
  name one), logo usage. Keep every "TTT default" passage the guidelines
  don't override. Remove the `<!-- TEMPLATE … -->` comment. No `{{` may be
  left.
- **`01-system.md`** — the client-specific choices line becomes one line per
  choice: status reuse (if chosen), each client-added ramp (`` A `data` ramp
  for … ``, so `ds-validate --system` finds it), radius or motion if not
  `default`, any adaptable pre-flight finding the code records (a different
  CSS path, aliases). "None yet" if there are none.
- **`02-using-in-code.md`** — generated, not filled:
  `node scripts/ds-styling-maps.mjs --using-in-code <out>/ds/project/02-using-in-code.md`
  in the branch.
- **`03-changelog.md`** — keep the template's first entry ("Design system
  created from TTT kit …"), with the PR link once the PR exists (step 9) and
  `Code pending · Figma pending`.
- **`design-system.json`** (the index) — filled by the tool; set
  `docs.sections` to `["project/01-system.md", "project/02-using-in-code.md",
  "project/03-changelog.md"]` and `lastChange` to `by` = owner, `at` = system
  clock, `via` = "Claude Code", `note` = "Created by Setup".

**Components** — for each component in the profile's baseline inventory:

- **Status** stays `validated`: the code is on a branch, not merged.
  Publish-back sets `implemented` after the PR merges.
- **Banner** (contract, Status), after the summary sentence: a pure-stock
  component — "Preview from stock — not yet in this codebase; final look may
  differ slightly once built."; a component whose code is a kit file (a chosen
  kit extension, or DatePicker) — "Preview from the kit's code — not yet in
  this codebase; final look may differ slightly once built.".
- **Kit extensions** — in the README's contract block, keep only the chosen
  ones under "Kit extensions"; remove the others' lines (and any "No preview
  yet" note about them). Chosen ones are previewed from the kit's code.
- **Styling map** — regenerate from the branch
  (`node scripts/ds-styling-maps.mjs --all > <out>/maps.md`) and replace each
  README's `**Styling map** — generated from …` block (up to the
  `**Contract**` line) verbatim, so chosen extensions appear.
- **Preview** — `preview.html` as the template has it, `{{NAMESPACE}}`
  filled.

**Preview bundle**, built from the branch with the kit's scripts:

```bash
node scripts/ds-build-bundle.mjs --check
node scripts/ds-build-bundle.mjs <out>/ds/project/components
node scripts/ds-pack-react.mjs <out>/ds/project/components/lib
node scripts/ds-types.mjs <out>/ds/project/components/index.d.ts
```

**Check every preview** against that bundle before publishing, as Sync's
`publish.md` §4 does: serve the bundle, CSS, React libraries and each
preview from a local static server, load each in light and dark, and require
zero `error` events and zero `console.error`. A broken preview is reported,
never edited to hide it.

**Fonts and logos** — follow the Design System type's own instructions
(returned when the artifact is created, §4) for font files and asset groups:
font files under `project/fonts/`, logos in the `Logos` group.

## 4. Create it — the first publish

The design system is a claude.ai artifact made from the **Design System
artifact type**, owned by the person running Setup:

1. Find the type: `Artifact` with `action: "quickstart"`, `intent: "other"`
   (or `action: "list"`, `scope: "types"`), and take the Design System
   type's URL.
2. Create it: `Artifact` publish with that `type_url`, `title` = the client
   name, `auto_open: "after_first_write"`, no files. The result carries the
   new artifact's `url` and the type's instructions — read them; they
   override anything here about the file format.
3. Publish the files to that `url` (common.md §3, "How a Design System
   artifact is written"): `root` = `<out>/ds`, the files under `project/`,
   `components/index.d.ts` as `{"from": …, "contentType": "text/plain"}`,
   **the index last**.
4. Read back the index, `01-system.md`, one component README and
   `bundle.js`, and compare with your files.

**If any of this fails, stop.** This is the first time the kit creates a
design system from Claude Code. Report exactly what failed: which call, its
arguments (paths, not contents), the error text, and what exists so far (the
branch, a partly-filled artifact and its URL). Don't retry with a different
approach, and don't go on to review.

## 5. Validate it

In the branch, with the published System section:

```bash
npm run ds:validate -- --system <out>/ds/project/01-system.md
npm run ds:contrast
```

Both must pass (no errors; the only contrast miss is `label-disable`). Save
the design system's URL in `.ttt/design-system.json` → `designSystem` if the
code step left a placeholder there, and commit it.

Then the review gate (`review.md`).
