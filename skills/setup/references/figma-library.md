# Figma library — only after approval

design-system-kit 0.10.1

The Figma library is built from the **approved** design system — the live
one you re-read after approval (`review.md` §3), never your local copy.
Figma is a read-only consumer (contract, Ownership): tokens and styles are
generated; components are **constructed to the profile's spec**
(`kit/code/<profile>/figma/specs.md`) with the kit's builder
(`kit/code/<profile>/figma/lib.js`), and checked against each README's
styling map. Nothing is improvised: if the spec doesn't cover something,
it goes in Gaps.

**No approval in this chat → don't start.** No connector, or no editor seat
on the destination → skip this step: say so, leave the changelog's Figma
mark `pending`, open the PR anyway (`code.md` §7), and put "Figma library not
built — re-run Setup's Figma step once connected" in Gaps.

## 0. Tools, the file, the pages

- Load the `figma-use` skill before any `use_figma` call, and
  `figma-generate-library` alongside it. Follow Sync's
  `skills/sync/references/figma.md` §0 for tool behaviour (pages via
  `use_figma`; `search_design_system` sees only published assets).
- The destination is the one the prerequisites recorded:
  - an existing file → open it; it must have no local variable collections
    or components yet (an empty or brand-new file). If it has some, **stop**
    and ask: Setup builds a library, it doesn't merge into one.
  - a team and project → create the file (the `figma-create-new-file`
    skill), named "<client> — Design System".
- **Pages, in this order:** `Cover`, `Foundations`, `———`, `Actions`,
  `Forms`, `Status`, `Navigation & Layout`, `Overlays & Feedback`, `——— `,
  `Utilities`. The spec groups every baseline component under one of them.
- **Every component page has one root frame** named as the page, filled
  `background-alternative`, 1600 wide, padding 80, vertical gap 120. Each
  component (or small family) is a **section**: a title in
  `Display/title-2`, a description in `Text/body-2` / `label-alternative`
  (760 wide), the component set, and an **"In use"** panel — a
  `background-normal` frame (radius-xl, 1px `line-normal`, padding 32) of
  instances composed into a realistic example. `pageRoot`, `section` and
  `panel` in `lib.js` build exactly this.
- **One page per `use_figma` call**, prepended with `lib.js`. Pages build in
  the order above; later pages instance earlier ones (`getSet`), so Button and
  Badge exist before Card, Field before Dialog.

## 1. Variables — Sync's Tokens part

Build every token as Sync's `figma.md` §2 describes, from the live
`project/tokens.json`:

- **Primitives** collection, one mode: every primitive colour ramp
  (including client-added ramps), spacing and radius.
- **Semantic** collection, **Light** and **Dark** modes: every semantic
  colour, each mode a **variable alias** to its primitive wherever the token
  aliases (a literal stays literal — e.g. `material-dimmer`).
- **Names**: first hyphen → slash, dots → underscores (`label-normal` →
  `label/normal`, `space-0.5` → `space/0_5`).
- **Scopes** by role (contract, Figma naming); primitives `[]`.
- **Code syntax** `WEB` = `var(--<token name>)` on every variable.
- **Description** = the token's usage text, verbatim. Figma stores `'` as
  `&#39;`; unescape before comparing, and before writing an edited
  description back (Sync's `figma.md` §4).

Create primitives first, then semantics. Read back with `figma.md` §1's
comparison — value or alias per mode, scopes, code syntax, description, for
every variable — and require an empty list. Compare inside Figma (embed the
expected values, return only mismatches): a full dump exceeds the tool's
return limit.

## 2. Styles and icons

- **Text styles** — one per style in the type groups (`tokens.type.groups`):
  name `<Group>/<style>` (e.g. `Text/body-1`), font family from the group's
  family, size, line height and letter spacing as percents, weight. Load every
  font first (`listAvailableFontsAsync`; never guess a style name). A family
  Figma doesn't have → stop and ask; don't substitute. A family left on the
  **system stack** (usually mono) has no Figma font: ask which font the style
  should use. A weight with no named style (450) rounds to the nearest; say so.
- **Effect styles** — one per shadow token, per theme where they differ
  (`Shadow/sm`, or `Shadow/sm (Dark)`), with the token's usage text as the
  description.
- **Icons** — on `Utilities`, one `Icon/<name>` component per icon the spec
  and the examples use, from the app's own icon package:
  `node <plugin root>/kit/code/<profile>/figma/icons.mjs --repo <app>` prints
  the geometry; wrap each body in a 24×24, 2px-stroke, round-cap SVG, create
  it with `createNodeFromSvg`, move its children into a component, and bind
  every stroke to `label-normal`. Never draw icons by hand or approximate one.
- Read back: every style's properties against the tokens; every icon listed.

## 3. Components — to the spec

For each section of `specs.md`, in page order:

1. **Build each variant** with `C()` / `F()` / `T()` / `I()` at the spec's
   measurements, binding every fill, stroke, radius, padding and gap to the
   token the spec names. Text always uses a text style. Disabled is opacity
   0.5; focus and error use `ring()`.
2. **Combine** with `gridSet(variants, section, name, description, rows)`:
   one row per variant (or size), states across. Names are `Prop=value`.
3. **Add properties**: `textProp` for text every variant shares (Label,
   Title), `boolProp` for optional layers (description, footer, close, icon),
   and name swappable icon instances ("Icon", "Leading icon").
4. **Parts** the spec lists as *(part)* are their own sets named
   `<Component>/<Part>`; the parent component is composed of their
   **instances**, never copies.
5. **"In use" panel**: compose the spec's example from instances, with
   content in the client's voice (the brand book's Voice section and the
   client's own domain). Run `syncTints()` on it.
6. **Description**: one sentence on what the component is for, its variants
   and props, ending `Status: validated · Source: <source>` from the
   README's contract block.
7. Only the **chosen** kit extensions appear; a chosen extension adds the
   variants or props its README lists. A whole-component extension
   (DataTable) gets a section only when chosen.

**Check each section against its styling map** (README): every token the
map names for a state you built is bound somewhere in that state. A row with
an opacity — `` `status-negative` · 10% `` — is that variable bound to the
paint with the paint's opacity at 0.1 (`paint("status-negative", 0.1)` in
`lib.js`), never a hand-picked tint and never a literal colour; the read-back
checks the opacity as well as the variable. A map row
for a state Figma can't show (hover-only on a part, `has-*`, `[&_svg]`) is
fine to skip; a token the spec and the map disagree on is a deviation
(common.md §7), not a choice.

**Rules that have broken builds** (`lib.js` encodes most):
a paint's opacity is set after binding its variable; instances need
`syncTints()` to keep a tinted fill; instances can't take appended children;
a TEXT property forces one text on every variant (never on fields whose
placeholder, value and error differ); `resize()` resets sizing, so set
HUG/FILL after appending; arrows are polygons. Sync's `figma.md` §4 pitfalls
apply too.

## 4. Read back, then look, then mark ✓

1. **Automated tally** (one read-only `use_figma` over all component pages):
   every inventory component present under its folder name, every part
   `<Component>/<Part>`, every description ending in the status line, **zero
   unbound solid fills or strokes**, **zero text without a text style**, and
   the variable and style read-backs (§1, §2) empty.
2. **Look**: one screenshot per section. Check against the spec and the
   design system's previews: nothing clipped, collapsed or overlapping;
   labels readable on their grounds in Light; states distinguishable; examples
   read as real UI. Fix the section and re-shoot only what changed.
3. Only when both pass, flip the first changelog entry's `Figma pending` to
   `Figma ✓` (common.md §3, §6) and fill the System section's Figma row with
   the file's name and key.

## 5. Tell the designer

Two things only they can do — both go in the report's Gaps:

- **Publish the Figma library** (Assets → Publish). Figma's tools can't
  publish; until they do, other files can't use it.
- **Share the design system** with the team from the artifact's Share menu.
  It's private to its owner until then.
