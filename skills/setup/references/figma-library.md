# Figma library — only after approval

design-system-kit 0.4.0

The Figma library is generated from the **approved** design system — the
live one you re-read after approval (`review.md` §3), never your local
copy. Figma is a read-only consumer (contract, Ownership): nothing here is
designed by hand.

**No approval in this chat → don't start.** No connector, or no editor seat
on the destination → skip this step: say so, leave the changelog's Figma
mark `pending`, open the PR anyway (`code.md` §6), and put "Figma library not
built — re-run Setup's Figma step once connected" in Gaps.

## 0. Tools and the file

- Load the `figma-use` skill before any `use_figma` call, and
  `figma-generate-library` for building variables, styles and components.
  Follow Sync's `skills/sync/references/figma.md` §0 for tool behaviour
  (pages via `use_figma`; `search_design_system` sees only published assets).
- The destination is the one the prerequisites recorded:
  - an existing file → open it; it must have no local variable collections
    or components yet (an empty or brand-new file). If it has some, **stop**
    and ask: Setup builds a library, it doesn't merge into one.
  - a team and project → create the file (the `figma-create-new-file`
    skill), named "<client> — Design System".
- Pages: **Cover**, **Foundations** (colour, type, radius, shadow
  swatches), then one page per component group as the template's preview
  cards group them (`@dsCard group="…"` on each `preview.html`'s first line).

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
- **Description** = the token's usage text, verbatim.

Create primitives first, then semantics. Read back with `figma.md` §1's
comparison — value or alias per mode, scopes, code syntax, description, for
every variable — and require an empty list.

## 2. Styles

- **Text styles** — one per style in the type groups (`tokens.type.groups`):
  name `<Group>/<style>` (e.g. `Body/body-1`), font family from the group's
  family, size, line height (as a percent or px — `{unit, value}`), letter
  spacing, weight. Load every font first (`listAvailableFontsAsync`; never
  guess a style name). A family Figma doesn't have → stop and ask the
  designer to install it; don't substitute.
- **Effect styles** — one per shadow token, per theme where they differ
  (`Shadow/sm`, or `Shadow/sm (Dark)` when the dark value differs), with its
  token's usage text as the description.
- Read back: every style's properties against the tokens.

## 3. Components

Follow Sync's `figma.md` §3–§4 — the same rules publish-back uses:

- built **from each README's styling map**: every token row becomes a
  binding to its variable (fills, strokes, radius, gap, padding); "fixed in
  code" values set literally; text uses the text styles;
- **naming**: the set is the design-system folder name (`Button`); parts
  that are their own components are `<Component>/<Part>`; a size or style that
  is one component in code is a **variant**, not its own set;
- **status line**: each description ends `Status: validated · Source:
  <source>` from the README's contract block (they're `validated` until the
  PR merges and publish-back runs);
- only the **chosen** kit extensions appear;
- **the pitfalls** (`figma.md` §4): never copy a component into another;
  check an icon's default orientation before rotating; new sections take the
  page's standard width; after moving variants, fix their names and confirm
  every set is valid.

Build one group page at a time; after each, read back bindings per changed
layer and the variant names, and take one screenshot of each set.

## 4. Read back, then mark ✓

Tally what you read back against the design system: every variable
(§1), every style (§2), every component in the inventory with its variants
and bindings (§3). Only when it all matches, flip the first changelog
entry's `Figma pending` to `Figma ✓` (common.md §3, §6) and fill the System
section's Figma row with the file's name and key.

## 5. Tell the designer

Two things only they can do — both go in the report's Gaps:

- **Publish the Figma library** (Assets → Publish). Figma's tools can't
  publish; until they do, other files can't use it.
- **Share the design system** with the team from the artifact's Share menu.
  It's private to its owner until then.
