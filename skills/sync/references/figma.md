# Figma — inside publish

design-system-kit 0.2.0

Figma is a read-only consumer of the design system: it is regenerated from
what publish just sent, never edited to taste. The Figma file is the one in
the System section's Figma row.

## 0. Tools and access

- Use the Figma MCP tools. **Load the `figma-use` skill before any
  `use_figma` call**, and follow it (it carries the Plugin API rules).
- `whoami`: the account needs an editor seat on the team that owns the file.
  A view seat can read but not write — stop and say so.
- **List pages with `use_figma`** (`figma.root.children`), not
  `get_metadata`: `get_metadata` only lists pages already loaded in the
  session and can report a full library as one Cover page.
- `search_design_system` finds only **published** library assets; the file's
  own unpublished components and variables are found with `use_figma`
  (`findAllWithCriteria`, `getLocalVariablesAsync`).
- Read-only discovery first; one page per `use_figma` call, pages fanned out
  in parallel.

## 1. List what Figma is missing

Compare the design system (after publish) with the file, and list:

- every **component change** (a variant, part, state or token binding that
  changed in the styling map);
- every **new stock part** (e.g. a new size documented in a README);
- every **binding change** (a part now uses a different token — e.g. a
  foreground moved from `on/primary` to `on/secondary`);
- every **implemented component missing** from the file;
- every **variable** missing or with a different value.

This list goes in the report whether or not you change anything.

## 2. Variables

- **Name**: the token name with its **first hyphen turned into a slash** and
  **dots into underscores**: `label-normal` → `label/normal`, `on-primary` →
  `on/primary`, `space-0.5` → `space/0_5`.
- Primitives and semantic tokens live in separate collections; semantic ones
  have Light and Dark modes, aliasing the primitives as the tokens do.
- **Scopes by role**, always set explicitly:
  - text tokens (`label-*`, `*-text`, `on-*`, `status-*` used as text) → text fill;
  - grounds (`background-*`, `fill-*`, `*-normal`, `*-soft`) → frame fill and shape fill;
  - lines (`line-*`, `focus-ring`) → stroke;
  - spacing and radius → gap, padding, corner radius.

## 3. Components

- Build each one **from the generated styling map**: every row whose value is
  a token becomes a binding to that token's variable — fills, strokes, radius,
  gap, padding. "Fixed in code" values are set literally.
- Names follow the contract: the component set is the design-system folder
  name (`Button`); parts that are their own components are
  `<Component>/<Part>` (`DropdownMenu/Item`); a size or style that is one
  component in code is a **variant** of its set, not a set of its own.
- The description of each component ends with
  `Status: <status> · Source: <source>`, matching its README's contract block.
- **Before rebinding a layer, check what it sits on.** Walk up to the nearest
  ancestor with a bound fill and confirm it's the ground the binding expects
  (e.g. an `on/secondary` label must sit on `secondary/normal`). Change only
  layers whose current binding and ground both match; report anything else
  instead of changing it.

## 4. Pitfalls — each one has broken a library

- **Never copy a component into another component.** Build each frame fresh;
  a copied component drags its instance links and overrides along.
- **Check an icon's default orientation before rotating it.** A chevron may
  already point up; rotating it 180° makes it point down. Inspect the vector
  (or a screenshot) first.
- **A new section takes the page's standard width** — measure an existing
  section on that page and match it.
- **After moving variants between sets**, Figma rewrites their names. Fix the
  `Property=Value` names, then confirm the set is valid: every variant has
  every property, and no two variants share a combination.
- Text edits need the node's fonts loaded first; colours are 0–1, not 0–255.

## 5. Read back, then mark ✓

- After each change, read it back with `use_figma`: the bound variable names
  per changed layer, the variant names, the variable values per mode — and
  take a screenshot of each changed set.
- Tally the result (e.g. every foreground per ground) and compare it with the
  list from §1.
- Only then flip the changelog entry's `Figma pending` to `Figma ✓`
  (common.md §3 and §6: re-read the changelog and the index before that
  publish).
- **Remind the designer that publishing the Figma library is manual.**
  Figma's tools can update variables and components but can't publish a
  library; until they publish, files that use the library don't see the
  change. Put this in the report's Gaps.
