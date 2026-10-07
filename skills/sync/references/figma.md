# Figma — tokens (pull and publish), components (publish)

design-system-kit 0.2.1

Figma is a read-only consumer of the design system: it is regenerated from
the design system, never edited to taste. The Figma file is the one in the
System section's Figma row.

Two parts, two callers:

| Part | Sections | Run by |
|---|---|---|
| **Tokens** — variables | §0, §1, §2, §5 | `pull` (design → code and Figma), and `publish` |
| **Components** | §0, §3, §4, §5 | `publish` only — components are code-owned |

## 0. Tools and access

- Use the Figma MCP tools. **Load the `figma-use` skill before any
  `use_figma` call**, and follow it (it carries the Plugin API rules).
- **No connector, or it needs authorising?** Don't block on it. Say so in
  the first message, leave the changelog's Figma mark `pending`, carry on
  with code (pull still opens its PR), and put "Figma not updated — the
  connector wasn't available; re-run once it's connected" in the report's
  Gaps.
- `whoami`: the account needs an editor seat on the team that owns the file.
  A view seat can read but not write — same as no connector: say so, Figma
  stays `pending`, code carries on.
- **List pages with `use_figma`** (`figma.root.children`), not
  `get_metadata`: `get_metadata` only lists pages already loaded in the
  session and can report a full library as one Cover page.
- `search_design_system` finds only **published** library assets; the file's
  own unpublished components and variables are found with `use_figma`
  (`findAllWithCriteria`, `getLocalVariablesAsync`).
- Read-only discovery first; one page per `use_figma` call, pages fanned out
  in parallel.

# Tokens — shared by pull and publish

## 1. List what the variables are missing

Read the file's local variable collections and every variable's value per
mode (`getLocalVariableCollectionsAsync`, `getLocalVariablesAsync`), and
compare them with the design system's `project/tokens.json`:

- every token with **no variable**;
- every variable whose **value or alias differs** from its token, per mode;
- every variable with **no token** any more (removed or renamed in design);
- every variable in the **wrong collection** (a primitive in Semantic, or
  the reverse).

This list goes in the report whether or not you change anything. On
publish, nothing should differ — tokens reach Figma through pull — so a
difference found there is a pull that didn't push: fix it the same way and
say so in Gaps.

## 2. Push the token changes

- **Name**: the token name with its **first hyphen turned into a slash** and
  **dots into underscores**: `label-normal` → `label/normal`, `on-primary` →
  `on/primary`, `space-0.5` → `space/0_5`, `data-50` → `data/50`.
- **Collections**:
  - **Primitives** — every primitive (usage text starting "Primitive":
    the colour ramps, including client-added ones) and the scalar families
    the file already keeps there (spacing, radius). One mode.
  - **Semantic** — every semantic colour token, with **Light** and **Dark**
    modes (the token's `light` and `dark` values).
- **Alias, don't copy.** Where the token's value is `{primitive}`, the
  semantic variable's value in that mode is a **variable alias** to the
  primitive's variable (`figma.variables.createVariableAlias`), never the
  resolved colour. A literal in the token stays a literal.
- **Order**: create new primitives first, then the semantics that alias
  them; then change values and aliases; remove last.
- **Removed tokens**: before removing a variable, find every layer bound to
  it (`boundVariables` across the component pages). Unbound → remove it.
  Still bound → leave it, and list the variable and the layers in Gaps:
  removing it would silently turn those bindings into raw values.
- **Scopes**, always set explicitly:
  - semantic tokens, by role — text tokens (`label-*`, `*-text`, `on-*`,
    `status-*` used as text) → text fill; grounds (`background-*`, `fill-*`,
    `*-normal`, `*-soft`) → frame fill and shape fill; lines (`line-*`,
    `focus-ring`) → stroke; spacing and radius → gap, padding, corner radius;
  - primitives — the same scopes the file's existing primitives of that kind
    use (a new ramp copies an existing ramp's); in a file with none, `[]`,
    since primitives are never applied directly.
- **Description**: the token's usage text, so designers see it in the picker.

# Components — publish only

## 3. List what the components are missing

Compare the design system (after publish) with the file, and list:

- every **component change** (a variant, part, state or token binding that
  changed in the styling map);
- every **new stock part** (e.g. a new size documented in a README);
- every **binding change** (a part now uses a different token — e.g. a
  foreground moved from `on/primary` to `on/secondary`);
- every **implemented component missing** from the file.

Then build or change them:

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

# Both

## 5. Read back, then mark ✓

- After each change, read it back with `use_figma`:
  - tokens — every changed variable's collection, scopes, and value per mode
    (an alias reads back as the primitive's variable name, not a colour);
    then re-run §1 and require an empty list;
  - components — the bound variable names per changed layer, the variant
    names, and a screenshot of each changed set; tally the result (e.g.
    every foreground per ground) against §3's list.
- Only then flip the changelog entry's `Figma pending` to `Figma ✓`
  (common.md §3 and §6: re-read the changelog and the index before that
  publish). Record what you read back in the report, so the next run can
  trust the ✓ (common.md §6, "Pending entries flip themselves").
- **Remind the designer that publishing the Figma library is manual.**
  Figma's tools can update variables and components but can't publish a
  library; until they publish, files that use the library don't see the
  change. Put this in the report's Gaps, every time Figma changed.
