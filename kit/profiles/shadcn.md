# Part 2 — Library profile: shadcn

**Profile** `shadcn` 1.2 · **Platform** web · **For schema** `ttt-ds/1`

**1.2** (kit 0.1.0) — kit extension catalog: Tabs pill/underline and Card compact are stock now; Alert joins Semantic colour; Clickable rows added as a candidate. Mapping gains `font-heading`; the generator emits the spacing base, the status shorthands and font fallbacks. Kit code vendored under `kit/code/shadcn/`.

Everything in this part is specific to shadcn/ui. The universal rules in Part 1 apply unchanged.

## Stack

Reference versions, taken from the Jelly demo repo. A client project records its own versions here from its **lockfile**, which wins over any range.

| Package | Reference version | Notes |
|---|---|---|
| next | ^15.5.0 | App Router |
| react · react-dom | ^19 | shadcn's current components pass `ref` as a prop (React 19); Next.js 15 App Router runs React 19 |
| tailwindcss · @tailwindcss/postcss | ^4.3.3 | CSS-first config, no `tailwind.config` |
| shadcn (CLI) | ^4.21.1 | |
| @base-ui/react | ^1.8.0 | Primitives (Base UI). shadcn's default since July 2026; Radix remains supported but isn't this profile's choice |
| class-variance-authority | ^0.7.1 | Variants and kit extensions |
| clsx · tailwind-merge | latest | Required by `cn()` in `lib/utils` |
| tw-animate-css | ^1.4.0 | |
| lucide-react | ^1.52.0 | Default icon library. shadcn 4.21 installs 1.x; Jelly is on 0.460 |
| next-themes | ^0.4.6 | Light/dark switching |
| sonner | ^2.0.8 | Toasts |
| @tanstack/react-table | ^8.21.3 | Stay on v8; v9 drops `useReactTable` |
| typescript | ^5.4.0 | |

## Config

`components.json`: style `base-nova` — written by `npx shadcn@4.21.1 init --preset nova --base base` (the CLI has no `base-nova` preset name; Nova on Base UI is stored as `base-nova`) (Base UI primitives, Nova's compact style for dashboards and portals), base colour `neutral`, CSS variables on, RSC on, TSX, icon library `lucide`, menu colour `default`, menu accent `subtle`. Aliases `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`. Global CSS `src/styles/globals.css` by default; `create-next-app` puts it at `src/app/globals.css`, which pre-flight records as adaptable.

**Why these choices.** Base UI is shadcn's default and recommended primitive library for new projects, so it's the stock path (see "prefer stock"). Nova is the compact style suited to TTT's typical work — dashboards, admin portals, resource tools. One style per profile version: the kit vendors and tests one style's files. A different style or primitive library for a client is a profile change decided at kickoff.

**Base UI conventions.** Composition uses the `render` prop, not `asChild` (`<DialogTrigger render={<Button variant="secondary" />}>Delete</DialogTrigger>`). Style component states with Base UI's data attributes (e.g. `data-[checked]`, `data-[open]`), not Radix's `data-[state=…]`. Popovers position with Floating UI.

**Base UI part names and variables** (for adapting Radix-based examples):

| Radix | Base UI |
|---|---|
| `asChild` | `render` prop |
| `Portal` → `Content` | `Portal` → `Positioner` → `Popup` |
| `Tabs.Trigger` · `Tabs.Content` | `Tabs.Tab` · `Tabs.Panel` |
| `DropdownMenu.Label` | `Menu.GroupLabel` |
| `DropdownMenu.Sub*` | `Menu.Submenu*` |
| `Popover.Anchor` | `anchor` prop on the Positioner |
| `--radix-*-trigger-width` · `--radix-*-content-available-height` · `--radix-*-content-transform-origin` | `--anchor-width` · `--available-height` · `--transform-origin` |
| `data-[state=open]` · `data-[state=checked]` · `data-highlighted` | `data-open` · `data-checked` · `focus:` (highlighted items) |
| `DropdownMenu.Item` `onSelect` | `Menu.Item` `onClick` — `onSelect` is a valid DOM attribute, so the old name type-checks and silently does nothing |

**Animations** — utilities that depend on Radix variables (e.g. tw-animate-css's accordion keyframes) silently do nothing under Base UI. Accordion uses Base UI's height transition on `--accordion-panel-height`; popups use `--transform-origin`. Don't use Radix-specific animation utilities.

**Verify behaviour, not just types.** After any library, primitive or API change, exercise every interactive handler in the browser (menus, selects, dialogs, toggles). Renamed event props can be valid DOM attributes, so typecheck, lint and build all pass while the handler never fires. The kit harness includes interaction tests (click → handler fires) for every kit component with event props.


## Dev setup checklist

What the dev's own app setup must include before the designer runs Setup:

- Next.js with the App Router, TypeScript, Tailwind v4 — versions within this profile's tested range.
- `shadcn init` run with the Config values above (style, base colour, CSS variables, icon library, aliases): `npx shadcn@4.21.1 init --preset nova --base base`.
- No custom theme yet — shadcn's default theme variables are fine; Setup replaces them.
- Little or no custom UI. Stock shadcn components already added are fine.
- ESLint configured to run unattended (flat config, `eslint .`; `next lint` is deprecated). Setup adds the accessibility rules on top.
- The designer has PR access to the repo.

## Pre-flight

Setup's first step reads the repo and reports **ready**, **adaptable** (e.g. different aliases or CSS path — Setup uses the repo's values and records them) or **blocked** (e.g. Tailwind v3, no shadcn init, versions outside the tested range, or substantial existing custom UI). Missing packages that selected components need are added at tested versions; existing packages are never upgraded or downgraded — out-of-range ones are flagged for the dev. Modified stock components are never overwritten; differences are listed in the PR.

## How this profile provides each layer

- **Base** — components are copied into `components/ui` by the shadcn CLI and owned by the project.
- **Repo config** — `.ttt/design-system.json` records the design system link, tracker link, schema, profile, token file path, `typeClassPrefix` and `lastSynced`.
- **Token snapshot** — only Sync's pull writes `.ttt/tokens.json`, run by a person in Claude Code; there is no unattended fetch from claude.ai. The snapshot is committed, and everything generated reads it, never the design system directly, so CI regenerates from the snapshot alone.
- **Token file** — a generator (e.g. `scripts/ds-tokens.mjs`) turns the snapshot into `src/styles/ds-tokens.css` (default path; adaptable): every token as a CSS variable, light and dark via `[data-theme]`, aliases as `var()` references, the Tailwind v4 `@theme` mapping below, the type classes from the type groups (one Tailwind utility per text style, `type-<style>` by default, e.g. `type-body-1`; the prefix is adaptable and recorded as `typeClassPrefix`), and Tailwind's spacing base set from `space-1`. One generator covers all tokens. A token change regenerates this file and no component file.
- **Fonts** — the framework's font loader (`next/font`) owns `--font-display`, `--font-sans`, `--font-mono` and the font files; the generator emits `--font-fallback-*` from the design system's type families. The families the layout loads must match the design system's fonts (checked by the drift audit).
- **Preview runtime** — the design system's preview frame loads React 18 unless told otherwise, and React 19 ships no browser-global build. Publish-back therefore builds React 19 and ReactDOM 19 as classic-script globals (`window.React`, `window.ReactDOM`) into `components/lib/`, and lists them in `libraries` with `name`, `version`, `global` and `file`. *To test on first use.*
- **Theme block** — Setup replaces only shadcn's theme variable block in the global CSS with an import of the token file.
- **Theme switching** — next-themes with `attribute="data-theme"`; Tailwind's `dark:` variant points at `[data-theme="dark"]`.
- **Focus** — one base `:focus-visible` rule (2px solid `ring`, 2px offset) rather than per-component outline utilities. Text fields keep stock's border and ring, which replaces it.
- **Kit and client extensions** — `cva` variants and props on the copied component, or small companion parts exported from the same file.
- **Repo guardrails** — Setup writes a design-system section in `CLAUDE.md` (usage rules, agreed component rules, styling guardrails); Sync keeps it current. Other repo docs point to it rather than repeating it.
- **Styling guardrails** — custom UI uses only the Tailwind names in the mapping: no hex values, no arbitrary colour values, no default shadcn palette classes.

## Token mapping

**Watch the naming clash.** In shadcn, `secondary` and `accent` are neutral greys, not brand colours. Brand secondary and accent get their own Tailwind names.

**Every semantic token is also a Tailwind utility of the same name** (`text-label-strong`, `border-line-strong`, `bg-status-positive-soft`), in addition to the shadcn names below. Only semantic tokens are mapped — never primitives.

| shadcn / Tailwind | Semantic token |
|---|---|
| `background` · `foreground` | `background-normal` · `label-normal` |
| `card` · `card-foreground` · `popover` · `popover-foreground` | `background-elevated` · `label-normal` |
| `primary` · `primary-foreground` | `primary-normal` · `on-primary` |
| `secondary` · `secondary-foreground` | `fill-normal` · `label-normal` (neutral) |
| `muted` · `muted-foreground` | `fill-alternative` · `label-alternative` |
| `accent` · `accent-foreground` | `fill-alternative` · `label-normal` (hover highlight) |
| `destructive` | `status-negative` |
| `border` · `input` · `ring` | `line-normal` · `line-strong` · `focus-ring` |
| `sidebar` · `sidebar-foreground` | `background-alternative` · `label-normal` |
| `sidebar-primary` · `sidebar-primary-foreground` | `primary-normal` · `on-primary` |
| `sidebar-accent` · `sidebar-accent-foreground` | `background-elevated` · `label-normal` |
| `sidebar-border` · `sidebar-ring` | `line-normal` · `focus-ring` |
| `chart-1` … `chart-5` | `chart-1` … `chart-5` |
| `brand-secondary` (+ `-foreground`, `-soft`, `-text`) | `secondary-normal` · `on-secondary` · `secondary-soft` · `secondary-text` |
| `brand-accent` (+ `-foreground`, `-soft`, `-text`) | `accent-normal` · `on-accent` · `accent-soft` · `accent-text` |
| `primary-soft` · `primary-text` | same-named tokens |
| `positive` · `cautionary` · `negative` (+ `-soft`) | `status-*` and `status-*-soft` |
| `inverse` · `inverse-foreground` · `dimmer` | `inverse-background` · `inverse-label` · `material-dimmer` |
| `rounded-xs` … `rounded-xl`, `rounded-inset` | radius tokens (exact values, not shadcn's derived ones) |
| `shadow-xs` … `shadow-xl` | shadow tokens (per theme) |
| `font-display` · `font-sans` · `font-mono` | loaded by the framework from the design system's fonts; fallbacks as `--font-fallback-*` from type families, used whenever no face is loaded |
| `font-heading` | the display family (stock shadcn headings use it) |
| `type-<style>` (prefix adaptable) | text styles from the type groups |
| `p-N`, `m-N`, `gap-N`, `w-N` … | `space-N`: Tailwind's spacing base is set from `space-1`, so `p-4` = `space-4`. If a client's scale isn't N × base, the generator emits named spacing overrides instead |
| `ease-standard` · `ease-expressive` | easing tokens |
| `duration-fast` · `duration-normal` · `duration-slow` | duration tokens |

Client extensions that add tokens add their Tailwind names here too.

## Kit tooling

Five scripts generate everything the design system receives from code. They
are **kit files**: the same file in every repo on this profile, parameterised
from that repo's own config, never edited per client. Their source is
`kit/code/shadcn/scripts/` in the kit; Setup copies them to the client repo's
`scripts/`, and each names the kit version in its header. The paths below are
the client repo's.

Everything else Setup applies comes from the same folder:

| Kit path | What it is |
|---|---|
| `kit/code/shadcn/stock/` | Stock base-nova components (shadcn 4.21.1, 2026-10-07) with baseline changes only |
| `kit/code/shadcn/kit/` | Kit extensions — each a complete component file that replaces the stock one when chosen — and their interaction tests |
| `kit/code/shadcn/wiring/` | Theme block, focus rule, theme provider, `ds-settings`, ESLint flat config with jsx-a11y, `.ttt/design-system.json` template, `CLAUDE.md` design-system section, `package.json` fragment |
| `kit/code/shadcn/harness/` | Vitest + jsdom setup, and the bundle fixture (installed at `scripts/__fixtures__/`) |

| Script | Produces | Reads its configuration from |
|---|---|---|
| `scripts/ds-tokens.mjs` | the token file, including the spacing base from `space-1` and the type classes (prefix default `type-`) | `.ttt/design-system.json` (`tokensIn`, `tokensOut`, `typeClassPrefix`) |
| `scripts/ds-pack-react.mjs` | `components/lib/react.js`, `react-dom.js` | the repo's lockfile |
| `scripts/ds-build-bundle.mjs` | `components/bundle.js`, `bundle.css` | `.ttt/design-system.json` (`namespace`, `bundleExtras`, `tokensOut`), `components.json` (`aliases.ui`), `tsconfig.json` (`paths`) |
| `scripts/ds-styling-maps.mjs` | each README's styling map | `.ttt/design-system.json` (`tokensIn`, `tokensOut`, `componentFiles`), `components.json` (`aliases.ui`, `iconLibrary`), `tsconfig.json` (`paths`) |
| `scripts/ds-types.mjs` | `components/index.d.ts` | `.ttt/design-system.json` (`namespace`, `bundleExtras`), `components.json` (`aliases.ui`), `tsconfig.json` (`paths`) |

Two keys exist for the builder alone: `namespace` is the global the bundle
assigns, and `bundleExtras` names module-level APIs that `components/ui`
re-exports only partially (e.g. `{"sonner": ["toast"]}` — the component file
exports `<Toaster>` but previews also need `toast()`). A third, `componentFiles`,
maps each design-system component to the files it is built from, for the
components that span more than one (`Input`: input.tsx + label.tsx;
`DatePicker`: date-picker.tsx + calendar.tsx).

**The styling-map generator** reads the TSX rather than the rendered output, so
it has to resolve `className` the way the code does: through `cn()`, through
`cva()` base, variants and compound variants, and through module-level consts
to the element that actually uses them. That last one matters — a shared class
string declared at the top of a file belongs to every part that references it,
not to whichever `data-slot` happens to be declared above it. It resolves each
utility to a semantic token by following the CSS variable chain in the
generated token file, so the profile's mapping table above is not restated in
the script and a remapping needs no change to it.

Two things it deliberately leaves out: presentational keywords with no
measurable value (`uppercase`, `italic`, `whitespace-nowrap`), and icon
components as parts — an icon sized inside an item is that item's styling.

**The types file** is "types as docs", not a compilation input: every
signature is the one written in the component's source, so it cannot drift
into describing a library the code no longer uses. `ds-types.mjs` builds a
TypeScript Program over the component layer, so a helper whose return type is
inferred (`initialsOf`, `parseTyped`) is printed as what it actually returns
rather than assumed to be a component. A props type that comes from the
primitive library is named, not inlined; a `cva` component's variant axes and
defaults are listed above its signature; a local type an exported signature
names is emitted alongside it; and `bundleExtras` are listed, because they are
on the bundle's global even though no file in the component layer declares
them. Run it with `--check <file>` in CI to fail on a stale file.

**The maintenance commitment.** `ds-build-bundle.mjs` is pinned to a
toolchain, because it depends on behaviour rather than just API surface:

| Package | Pin | Why |
|---|---|---|
| `tailwindcss`, `@tailwindcss/cli` | minor | `@source`, `@theme` and `source(none)` semantics |
| `@base-ui/react` | minor | part names reached through the bundled components |
| `react` | major | the shim's export list is derived from the installed package |
| `esbuild` | major | plugin, banner and footer API |

After any dependency bump, run `--check` (compares installed versions against
the pins) and the fixture (`scripts/__fixtures__/` in the client repo, from
`kit/code/shadcn/harness/fixture/`, which builds a repo with a
different namespace, alias and source directory, so a change that quietly
hardcodes one repo's layout fails there rather than in a client's project).
The fixture also keeps a test file beside its components and asserts it
reaches neither bundle.

**Two behaviours worth knowing**, both found by the fixture:

- The bundle's CSS entry uses `@import "tailwindcss" source(none)`. Without it Tailwind's automatic source detection walks up from the entry and scans the whole consuming repo — markdown included, so the design system's bundle was carrying utilities generated from the guardrails' *forbidden examples*.

- The entry's base layer is written as custom properties, not `@apply`. A consuming repo's token file need not define every shadcn alias utility, and an unknown one is a hard error in Tailwind v4.

- Component discovery excludes `*.test.tsx`, `*.spec.tsx` and `*.stories.tsx`, in both the JS and the CSS pass, from one shared list. Tests live beside the components they cover and pull a test renderer in with them: the bundle tripled in size and picked up the `<!--` that breaks an inlining consumer, and the CSS pass would have shipped utilities only a test ever used.

## Kit extensions

| Capability | Component | How shadcn provides it |
|---|---|---|
| Row density | Table | `density` prop (`comfortable` / `compact`) |
| Sortable header | Table | `TableSortButton` companion part (empty state uses stock Empty in a full-width cell) |
| Clickable rows *(candidate)* | Table | `TableRow` `clickable` prop (pointer cursor; the row's own handler opens the target) |
| Count pill | Tabs | `TabsCount` (pill and underline styles are stock: `TabsList variant="default" \| "line"`) |
| Raised / flat, hover lift | Card | `variant`, `interactive` props (compact is stock: `size="sm"`) |
| Width presets | Dialog | `size` prop |
| Divider rows | Accordion | `variant="flush"` |
| Semantic colour | Badge, Avatar, Alert | `tone` prop, alongside stock's `variant` |
| Initials | Avatar | `initialsOf()` helper |
| Typed date entry *(candidate)* | DatePicker | Input alongside the calendar, parsed in the locale's format |
| Dismiss button *(candidate)* | Alert | close slot; component emits `onDismiss`, the app remembers dismissal |
| Urgent-only interruption *(candidate)* | Alert | `urgent` prop; only urgent alerts use `role="alert"` |
| Error icon *(candidate)* | Field | `FieldError` always renders the alert icon, so errors never rely on colour alone |

## Baseline inventory

Accordion, Avatar, Badge, Button, Card, Checkbox, Dialog, DropdownMenu, Input (with Label), Popover, RadioGroup, Select, Sidebar, Slider, Sonner, Switch, Table, Tabs, Tooltip.

Installed as Sidebar dependencies, not documented by default: `sheet`, `separator`, `skeleton`. Add an entry before using one directly in screens.

## Figma

Skill 1 generates the Figma library from the approved design system: a Primitives and a Semantic variable collection with Light and Dark modes, and components built from the semantic variables, named by the Figma naming rules in Part 1. Designers publish it as a library; screen files subscribe to it.
