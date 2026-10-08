# Part 2 — Library profile: shadcn

**Profile** `shadcn` 1.6 · **Platform** web · **Frameworks** Next.js, Vite · **For schema** `ttt-ds/1`

**1.6** (kit 0.7.0) — Styling maps keep a colour's opacity modifier beside its token (`` `status-negative` · 10% ``), and Figma binds that variable at that paint opacity. On Vite, `withDesignSystem()` switches the repo's style rules (ESLint `layout`/`suggestion` types) off for vendored files only.

**1.5** (kit 0.5.1) — DatePicker syncs from `value` without an effect; `wiring/doctor.design-system.jsonc` scopes React Doctor like the lint blocks. Kit 0.5.2 adds `wiring/vite/eslint.design-system.d.mts` and keeps formatters off the kit-owned paths.

**1.4** (kit 0.5.0) — Locale defaults move from the repo config to the app: `wiring/locale.ts` seeds `<aliases.lib>/locale.ts`, which Calendar and DatePicker default to; `ds-settings` is gone. The Figma library is built to `kit/code/shadcn/figma/specs.md` with the kit's builder (`figma/lib.js`) and the app's own icons (`figma/icons.mjs`).

**1.3** (kit 0.4.0) — Vite joins Next.js as a supported framework: same components, scripts and mapping; per-framework stack, tested range, dev checklist, pre-flight and wiring (fonts, linting, build). Apps inside a monorepo, and pnpm, are supported.

**1.2** (kit 0.1.0, 0.1.1) — kit extension catalog: Tabs pill/underline and Card compact are stock now; Alert joins Semantic colour; Clickable rows added as a candidate. Mapping gains `font-heading`; the generator emits the spacing base, the status shorthands and font fallbacks. Kit code vendored under `kit/code/shadcn/`. Kit 0.1.1 adds config validation, contrast checking and the tested range (no change to the mapping or catalog).

Everything in this part is specific to shadcn/ui. The universal rules in Part 1 apply unchanged.

## Stack

The profile supports two **frameworks**: **Next.js** (App Router) and **Vite** (a React single-page app). The UI library is the same in both — the stock components, kit extensions, scripts, token mapping and design-system output don't change. What differs is the framework's own packages, the app's wiring (fonts, linting, the build script) and the tested range. The repo config records which (`framework`: `"next"` or `"vite"`; absent means `"next"`), and pre-flight reads it from the app's `package.json` before there is a config.

**Tested range.** For each package, the lowest and highest version the kit's acceptance runs passed on — an app built from the dev setup checklist below, with the kit applied from the kit alone and every check green (token generation, `ds-validate`, `ds-contrast`, typecheck, lint, the kit's tests, the framework's production build, the bundle builder and its fixture, the styling maps, the types file, and three components in the browser in both themes, their handlers firing). The range is nothing more than that: a version no acceptance run has passed on is untested, however close. It widens only when another acceptance run passes, and only for the framework that run used. Its machine-readable copy is `kit/code/shadcn/scripts/tested-range.json` (`packages` shared, `frameworks.next` and `frameworks.vite` on top), installed with the scripts, which also lists the runs.

The runs:

- **Next.js floor** (kit 0.1.1, 2026-10-07) — `create-next-app@15.5` and `shadcn@4.21.1 init` exactly as installed; **ceiling** — the same app with React at 19.3.0, the newest 19.x.
- **Vite floor** (kit 0.4.0, 2026-10-08) — TTT's full-stack starter template as cloned: a pnpm 10 + Turborepo monorepo whose `apps/web` is Vite 7 + React 19.2, with ESLint 10, Vitest 4 and oxlint at the workspace root; plus Tailwind 4.3.3 with `@tailwindcss/vite` and `shadcn@4.21.1 init` run in `apps/web`.

Every other package resolved to one version per run, so most ranges are a single version.

**Shared** — the same range for both frameworks:

| Package | Tested min | Tested max | Notes |
|---|---|---|---|
| react | 19.1.0 | 19.3.0 | shadcn's current components pass `ref` as a prop (React 19) |
| react-dom | 19.1.0 | 19.3.0 |  |
| tailwindcss | 4.3.3 | 4.3.3 | CSS-first config, no `tailwind.config` |
| @tailwindcss/cli | 4.3.3 | 4.3.3 | Bundle builder only |
| @base-ui/react | 1.8.0 | 1.8.0 | Primitives (Base UI). shadcn's default since July 2026; Radix remains supported but isn't this profile's choice |
| class-variance-authority | 0.7.1 | 0.7.1 | Variants and kit extensions |
| cn | 0.4.0 | 0.4.0 | `cn()` — stock components import it from the `cn` package; `lib/utils` re-exports it |
| tw-animate-css | 1.4.0 | 1.4.0 |  |
| next-themes | 0.4.6 | 0.4.6 | Light/dark switching — framework-agnostic despite the name |
| sonner | 2.0.8 | 2.0.8 | Toasts |
| typescript | 5.9.3 | 5.9.3 |  |
| react-day-picker | 10.0.2 | 10.0.2 | Calendar and DatePicker |
| date-fns | 4.4.0 | 4.4.0 | Calendar, DatePicker, the app's `locale.ts` |
| esbuild | 0.28.2 | 0.28.2 | Bundle builder only |

**Next.js:**

| Package | Tested min | Tested max | Notes |
|---|---|---|---|
| next | 15.5.27 | 15.5.27 | App Router; Next.js 15 runs React 19 |
| @tailwindcss/postcss | 4.3.3 | 4.3.3 |  |
| shadcn | 4.21.4 | 4.21.4 | The package `shadcn init` installs; the init itself is run as `shadcn@4.21.1` |
| lucide-react | 1.52.0 | 1.52.0 | Default icon library |
| vitest | 3.2.7 | 3.2.7 | Kit harness |
| eslint | 9.39.5 | 9.39.5 | Flat config, `eslint .` |
| eslint-plugin-jsx-a11y | 6.10.2 | 6.10.2 | Accessibility rules |

**Vite:**

| Package | Tested min | Tested max | Notes |
|---|---|---|---|
| vite | 7.3.1 | 7.3.1 |  |
| @vitejs/plugin-react | 5.1.4 | 5.1.4 |  |
| @tailwindcss/vite | 4.3.3 | 4.3.3 | Tailwind's Vite plugin (no PostCSS) |
| shadcn | 4.21.0 | 4.21.0 | As `shadcn@4.21.1 init` installed it in the starter |
| lucide-react | 1.49.0 | 1.49.0 | As installed |
| vitest | 4.1.11 | 4.1.11 | The repo's own runner; the kit's tests run on it |
| eslint | 10.0.3 | 10.0.3 | The repo's own config; accessibility rules came from oxlint's jsx-a11y plugin |
| jsdom | 28.1.0 | 28.1.0 | Test environment |

`@tanstack/react-table` (^8, stay on v8 — v9 drops `useReactTable`) is a reference version only: no kit component uses it, so no acceptance run exercises it.

A client project's own versions are what it has **installed**, which win over any range; pre-flight compares the two. The scripts read them for any package manager and for an app inside a workspace: an npm `package-lock.json` in the app's folder or above it, otherwise the installed package under `node_modules` in the app's folder or any folder above it (pnpm, Yarn without Plug'n'Play, devDependencies hoisted to a monorepo root).

## Config

`components.json`: style `base-nova` — written by `npx shadcn@4.21.1 init --preset nova --base base` (the CLI has no `base-nova` preset name; Nova on Base UI is stored as `base-nova`) (Base UI primitives, Nova's compact style for dashboards and portals), base colour `neutral`, CSS variables on, RSC on (Next.js) or off (Vite — the CLI sets it), TSX, icon library `lucide`, menu colour `default`, menu accent `subtle`. Aliases `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/hooks`. Global CSS `src/styles/globals.css` by default; `create-next-app` puts it at `src/app/globals.css`, a Vite app wherever its entry CSS is (e.g. `src/index.css`) — pre-flight records either as adaptable.

**Vite specifics.** `shadcn init` on Vite needs, before it runs: Tailwind v4 through `@tailwindcss/vite` (the plugin in `vite.config`, `@import "tailwindcss"` at the top of the entry CSS), and the `@/*` alias in **both** `tsconfig.json` and `tsconfig.app.json` (a Vite `tsconfig.json` is only references; the CLI and the kit's scripts read `paths` from it) plus a resolver in `vite.config` (`vite-tsconfig-paths`, or `resolve.alias`). The CLI may add a font package (e.g. `@fontsource-variable/geist`) and import it in the entry CSS; Setup leaves it and records it.

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

What the dev's own app setup must include before the designer runs Setup. Three items are optional up front: if Tailwind v4, the `@/*` alias in `tsconfig.json` or `shadcn init` is simply **absent**, Setup adds it on its branch — after asking, and listed in the PR for a dev to review. Anything already there that differs (Tailwind v3, a `tailwind.config`, another shadcn style) is still a blocker:

- **Next.js** with the App Router, **or Vite** with `@vitejs/plugin-react` — TypeScript and Tailwind v4 either way (`@tailwindcss/postcss` on Next.js, `@tailwindcss/vite` on Vite), versions within this profile's tested range for that framework.
- `shadcn init` run with the Config values above (style, base colour, CSS variables, icon library, aliases): `npx shadcn@4.21.1 init --preset nova --base base` — on Vite, after the "Vite specifics" above.
- **In a monorepo**, all of this lives in one app's folder (e.g. `apps/web`): that folder is where `components.json`, `.ttt/` and `scripts/` go, and the one Setup is pointed at. Workspace-root tooling (ESLint, Vitest, oxlint) is fine; its versions count for the app.
- No custom theme yet — shadcn's default theme variables are fine; Setup replaces them.
- Little or no custom UI. Stock shadcn components already added are fine.
- Linting that runs unattended: an ESLint flat config (`eslint .`; `next lint` is deprecated), optionally oxlint as well. Setup adds the kit's scoped blocks and, where nothing runs jsx-a11y rules yet, the accessibility rules.
- The designer has PR access to the repo.

## Pre-flight

Setup's first step reads the repo and reports **ready**, **adaptable** (e.g. different aliases or CSS path — Setup uses the repo's values and records them), **missing setup** (Tailwind v4, the `tsconfig.json` alias or `shadcn init` simply absent — Setup adds them on its branch once the person agrees) or **blocked** (e.g. Tailwind v3, a `components.json` with another style, or substantial existing custom UI). Missing packages that selected components need are added at their tested max; existing packages are never upgraded or downgraded. Modified stock components are never overwritten; differences are listed in the PR.

**Framework, app and package manager** — pre-flight reads the framework from the app's `package.json` (`next` or `vite` as a dependency; both or neither is **blocked**), the app's folder (the repo root, or the workspace package the person names — e.g. `apps/web`), and the package manager from the lockfile beside the workspace root (`package-lock.json` npm, `pnpm-lock.yaml` pnpm, `yarn.lock` Yarn; Yarn Plug'n'Play is **blocked** — the scripts read `node_modules`). Every command Setup and Sync run uses that package manager, in the app's folder (`pnpm add …` there, not `npm install`).

**Versions** — pre-flight runs `node scripts/ds-validate.mjs --preflight`, which reads each package's installed version (see Stack) and compares it with `scripts/tested-range.json` — the shared rows plus the app's framework. A package outside its tested range is an error naming the package, its version and the range: Setup reports the repo **blocked** for a different major, and otherwise flags the package for the dev and goes on — the dev either moves it into range or runs an acceptance run that widens the range. A required package that isn't installed is added at its tested max.

## How this profile provides each layer

- **Base** — components are copied into `components/ui` by the shadcn CLI and owned by the project.
- **Repo config** — `.ttt/design-system.json` records the design system link, tracker link, schema, profile, `framework`, token file path, `typeClassPrefix` and `lastSynced`. In a monorepo it sits in the app's folder.
- **Token snapshot** — only Sync's pull writes `.ttt/tokens.json`, run by a person in Claude Code; there is no unattended fetch from claude.ai. The snapshot is committed, and everything generated reads it, never the design system directly, so CI regenerates from the snapshot alone. The System section is snapshotted the same way (`.ttt/system.md`, config `systemIn`), so CI checks the app's locale module and client-added ramps against what design recorded (`scripts/__tests__/ds-drift.test.mjs`).
- **Token file** — a generator (e.g. `scripts/ds-tokens.mjs`) turns the snapshot into `src/styles/ds-tokens.css` (default path; adaptable): every token as a CSS variable, light and dark via `[data-theme]`, aliases as `var()` references, the Tailwind v4 `@theme` mapping below, the type classes from the type groups (one Tailwind utility per text style, `type-<style>` by default, e.g. `type-body-1`; the prefix is adaptable and recorded as `typeClassPrefix`), and Tailwind's spacing base set from `space-1`. One generator covers all tokens. A token change regenerates this file and no component file.
- **Fonts** — the generator emits `--font-fallback-*` from the design system's type families; something else sets `--font-display`, `--font-sans`, `--font-mono` to the loaded faces. **Next.js**: `next/font` (its `variable` option, on `<html>`). **Vite**: `wiring/vite/fonts.css` — `@font-face` per file (or an `@fontsource` import) and the three variables on an **unlayered** `:root`, imported after the token file, so it beats the token file's own `@theme` declaration. The families the app loads must match the design system's fonts (checked by the drift audit).
- **Preview runtime** — the design system's preview frame loads React 18 unless told otherwise, and React 19 ships no browser-global build. Publish-back therefore builds React 19 and ReactDOM 19 as classic-script globals (`window.React`, `window.ReactDOM`) into `components/lib/`, and lists them in `libraries` with `name`, `version`, `global` and `file`. *To test on first use.*
- **Theme block** — Setup replaces only shadcn's theme variable block in the global CSS with an import of the token file.
- **Theme switching** — next-themes with `attribute="data-theme"` (it works the same outside Next.js); Tailwind's `dark:` variant points at `[data-theme="dark"]`. The provider wraps the root layout's body (Next.js) or the root render in `main.tsx` (Vite).
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

Seven scripts generate everything the design system receives from code and
check what it sends down. They are **kit files**: the same file in every repo on this profile, parameterised
from that repo's own config, never edited per client. Their source is
`kit/code/shadcn/scripts/` in the kit; Setup copies them to the client repo's
`scripts/`, and each names the kit version in its header. The paths below are
the client repo's.

Everything else Setup applies comes from the same folder:

| Kit path | What it is |
|---|---|
| `kit/code/shadcn/stock/` | Stock base-nova components (shadcn 4.21.1, 2026-10-07) with baseline changes only |
| `kit/code/shadcn/kit/` | Kit extensions — each a complete component file that replaces the stock one when chosen — and their interaction tests |
| `kit/code/shadcn/wiring/` | Shared: theme block, focus rule, theme provider, the locale module seed (`locale.ts`), `.ttt/design-system.json` template, `CLAUDE.md` design-system section, `package.json` fragment, React Doctor overrides (`doctor.design-system.jsonc`). `wiring/next/`: ESLint flat config with jsx-a11y, the Next.js package fragment (`build:safe` into `.next-build`). `wiring/vite/`: ESLint and oxlint blocks scoped to the component folder and scripts (with the ESLint block's types for a TypeScript flat config), `fonts.css`, the Vite package fragment |
| `kit/code/shadcn/harness/` | Vitest + jsdom setup, and the bundle fixture (installed at `scripts/__fixtures__/`) |
| `kit/code/shadcn/figma/` | The Figma build: `specs.md` (per-component construction), `lib.js` (the builder), `icons.mjs` (icon geometry from the app's package). Used by the Figma steps, never copied into the app |

| Script | Produces | Reads its configuration from |
|---|---|---|
| `scripts/ds-tokens.mjs` | the token file, including the spacing base from `space-1` and the type classes (prefix default `type-`) | `.ttt/design-system.json` (`tokensIn`, `tokensOut`, `typeClassPrefix`) |
| `scripts/ds-validate.mjs` | nothing — exits 1 on any error. Checks every key of `.ttt/design-system.json`, the token snapshot (name grammar, alias targets, alias cycles, colour formats, the semantic tokens this mapping needs, primitive ramps named by role, never by hue), that the theme block's `@source` resolves to the source root, and that `kitVersion` is no newer than the scripts; `--preflight` adds the lockfile against `tested-range.json`; `--system <01-system.md>` warns on a client-added ramp the System section doesn't list | `.ttt/design-system.json`, the snapshot, `components.json` (`tailwind.css`), `tsconfig.json` (`paths`), `package-lock.json` |
| `scripts/ds-contrast.mjs` | a table of every pair in every theme with its ratio; exits 1 on a miss the config doesn't list under `contrast.intentional` | `scripts/contrast-pairs.json` (generic, by semantic name), the snapshot, `.ttt/design-system.json` (`contrast`) |
| `scripts/ds-pack-react.mjs` | `components/lib/react.js`, `react-dom.js` | the repo's lockfile |
| `scripts/ds-build-bundle.mjs` | `components/bundle.js`, `bundle.css` | `.ttt/design-system.json` (`namespace`, `bundleExtras`, `tokensOut`), `components.json` (`aliases.ui`), `tsconfig.json` (`paths`) |
| `scripts/ds-styling-maps.mjs` | each README's styling map; with `--used-by <tokens.json>`, every token's "Used by" list; with `--using-in-code`, the design system's "Using in code" section | `.ttt/design-system.json` (`tokensIn`, `tokensOut`, `componentFiles`, `typeClassPrefix`, `usingInCode.notes`), `components.json` (`aliases.ui`, `iconLibrary`), `tsconfig.json` (`paths`) |
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

Spacing utilities (`p-4`, `gap-2`, `h-8`) resolve to space tokens the same way: an off-scale override names its token, an on-scale step with a token of its own is that token (`space-4`), and any other step is reported as a multiple of the base (`space-1` × 11). Only arbitrary values (`h-[34px]`) are "fixed in code".

**Used by and Using in code** are generated by the same script, so neither is hand-written: `--used-by` collects every token each component's styling map names and rewrites the "Used by" clause at the end of each token's usage text; `--using-in-code` reads the generated `@theme` block (the mapping as this client applies it), the type scale and the spacing base, and appends the config's `usingInCode.notes`.

**Contrast pairs** are written once, against semantic names, from the template's usage text ("Must reach …", "Pair with …"), so every client is checked against the same list. A pair that misses on purpose — `label-disable`, by convention — is listed in the repo config under `contrast.intentional` with its reason; nothing else excuses a miss. Contrast failures in a client project are logged as deviations, not fixed in code: tokens are design-owned.

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

One design-system component per stock file in `kit/code/shadcn/stock/ui/`, named by code export — 34 in all, each with a README and preview in `kit/template/components/`:

Accordion, Alert, AlertDialog, Avatar, Badge, Breadcrumb, Button, Card, Checkbox, Combobox, DatePicker (with Calendar), Dialog, DropdownMenu, Empty, Field, Input (with Label), InputGroup, Pagination, Popover, Progress, RadioGroup, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Tooltip.

Two stock files are documented under another component, by the naming rule (a composition takes its main part's name; a TTT wrapper's name wins): `label.tsx` under Input, and `calendar.tsx` under DatePicker — whose shell is the kit file `kit/ui/date-picker.tsx`, so a project that doesn't take it has Calendar alone. `sheet`, `separator` and `skeleton` come with Sidebar and are documented for direct use.

## Figma

Skill 1 generates the Figma library from the approved design system: a Primitives and a Semantic variable collection with Light and Dark modes, and components built from the semantic variables, named by the Figma naming rules in Part 1. Designers publish it as a library; screen files subscribe to it.
