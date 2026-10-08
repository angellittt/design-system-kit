# TTT design system kit · ttt-ds/1 · kit 0.11.0

The starting point for every client design system, bundled into TTT's four skills: **Setup** (design system + Figma + code branch, ending in a PR), **Sync** (pull → PR, publish-back), **Components** (check → propose → accept) and **Drift audit**. Extracted from Jelly, the worked example; the classification of what came over and why is in `docs/extraction/classification.md` at the repo root.

**Scope:** greenfield projects — the app is set up by devs but has little or no custom UI. Setup's pre-flight stops on projects with substantial existing UI.

**Version:** the kit's version is the plugin's (`.claude-plugin/plugin.json`). A client repo records the version it was set up or last synced with as `kitVersion` in `.ttt/design-system.json`, and every kit file it carries names that version in its header. Each release is tagged `v<version>` at the merge that brought it (`.github/workflows/release.yml`), so `git show v<kitVersion>:<path>` is any kit file exactly as a repo on that version received it — the base for upgrading a client's customized copy. A PR that changes what clients copy (`kit/code/`, `kit/template/`) must bump the version; the kit workflow checks it.

## Install

The repo is a Claude Code plugin marketplace:

```
/plugin marketplace add angellittt/design-system-kit
/plugin install design-system-kit@ttt-design
```

**Updating.** A new release on GitHub doesn't reach your machine by itself. Refresh the marketplace, then update the plugin, then start a new session (a running session keeps the version it loaded):

```
claude plugin marketplace update ttt-design
claude plugin update design-system-kit@ttt-design
```

`claude plugin list` shows the installed version; it must match the `kit` version in this README's title. A copy left over from an older install shows as orphaned and is never run.

Then, in a new client repo (no `.ttt/design-system.json` yet):

```
/ds-setup           # brand inputs → tokens, code branch, Design System, review, Figma library, PR
```

and in a repo that has `.ttt/design-system.json`:

```
/ds-sync pull       # design → code and Figma: tokens and assets into a PR, token changes to Figma's variables
/ds-sync publish    # code → design system → Figma
/ds-sync restyle    # new brand inputs (usually the provisional ones) → design system, then pull
/ds-sync restyle    # new brand inputs (usually the provisional ones) → design system, then pull
/ds-upgrade         # catch the repo up to the installed kit, keeping the client's changes
```

If another plugin also defines `/ds-sync` or `/ds-setup`, use the namespaced form, `/design-system-kit:ds-sync`. The skills read kit files from the plugin's install folder, outside the repo, so the first run may ask to allow reading it.

| Path (plugin root) | What it is |
|---|---|
| `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | The plugin (`design-system-kit`) and the marketplace (`ttt-design`) |
| `skills/setup/` | The Setup skill: `SKILL.md`, and the steps in `references/` (`preflight.md`, `inputs.md`, `generate.md`, `code.md`, `review.md`, `figma-library.md`, `report.md`) |
| `commands/ds-setup.md` | `/ds-setup` |
| `kit/tools/ds-setup.mjs` | Setup's tool, run from the kit (never copied into a repo): `tokens` generates the ramps from the brand inputs and fits contrast; `restyle` regenerates only what changed inputs drive on a live design system's tokens (Sync's restyle); `fill` fills the template's placeholders. Tests: `node --test kit/tools/ds-setup.test.mjs` |
| `kit/tools/ds-upgrade.mjs` | Upgrade's tool, run from the kit: reconciles every kit file a repo carries with the installed version — against the kit file it started from (the release tag of its own stamp), through the repo's formatter — as stamp, replace, keep, merge or conflict; `--add <names>` adds components the repo doesn't have, with what they need. Tests: `node --test kit/tools/ds-upgrade.test.mjs` |
| `skills/upgrade/` | The Upgrade skill: `SKILL.md`, and `references/upgrade.md` and `report.md` |
| `commands/ds-upgrade.md` | `/ds-upgrade` |
| `skills/sync/` | The Sync skill: `SKILL.md`, and the steps in `references/` (`pull.md`, `publish.md`, `restyle.md`, `figma.md`, `report.md`) |
| `commands/ds-sync.md` | `/ds-sync pull \| publish \| restyle` |
| `kit/procedures/common.md` | The rules every skill follows — validate, versions, read-before-publish, owner only, clock, changelog, deviations, files, repos, report |

Skills read kit files from the plugin root by path; nothing is copied into a session.

## What's here

| Path | What it is | Who changes it |
|---|---|---|
| `kit/contract.md` | The universal rules every system follows (read by the skills from the installed kit; never copied into a design system) | TTT, by bumping the schema version |
| `kit/profiles/shadcn.md` | Part 2 for shadcn projects: stack, config, token mapping, kit tooling, kit extensions, inventory, Figma | TTT; a new library means a new profile file |
| `kit/template/` | A brand-neutral design system in the Design System type's file format | Never edited per client; Setup copies it |
| `kit/code/shadcn/` | The code Setup applies to a client repo on this profile (below) | TTT; fixes found in a client repo are brought back here |

`kit/template/` holds `design-system.json` (the index), `README.md` (the brand book skeleton), `01-system.md`, `02-using-in-code.md`, `03-changelog.md` (with the entry format every skill writes), `tokens.json` (role-named ramps with placeholder values, the full semantic set, spacing, radius, shadows, type scale) `components/Cover/preview.html` (the cover, filled by Setup) and `components/<Comp>/` for the 37 baseline components — one per stock file, named by code export — plus DataTable, a whole-component kit extension that Setup drops when it isn't chosen. Each has a `README.md` (summary, the preview banner, a Base UI usage snippet, the agreed rules, the opt-in kit extensions, a styling map generated by `ds-styling-maps` against the template's placeholder tokens, and a contract block with status `validated`) and a `preview.html` that renders it from `window.{{NAMESPACE}}`.

## `kit/code/shadcn/`

Generic: no client names, tokens, prefixes or values. Every file names the kit version in its header.

In a monorepo, "the client repo" below means the app's folder (e.g. `apps/web`): every path is relative to it.

| Folder | What it holds | Lands in the client repo at |
|---|---|---|
| `stock/ui/` | Stock `base-nova` components as installed by shadcn 4.21.1 on 2026-10-07, plus **baseline** changes only (each file's header lists them) | `components.json` → `aliases.ui` (default `src/components/ui/`) |
| `stock/hooks/`, `stock/lib/` | Stock's `use-mobile` and `utils` | `aliases.hooks`, `aliases.lib` |
| `kit/ui/` | **Kit extensions.** Each `<name>.tsx` is the complete component — the stock file, its baseline changes and the extensions — so opting in replaces the stock file. `date-picker.tsx` and `data-table.tsx` have no stock counterpart; `data-table.tsx` needs `table.tsx` from here too. Their interaction tests (`<name>.test.tsx`) run in the kit's CI | `aliases.ui`, replacing the stock file (tests not copied) |
| `scripts/` | `ds-tokens`, `ds-validate`, `ds-contrast`, `ds-pack-react`, `ds-build-bundle`, `ds-styling-maps`, `ds-types` (see the profile's Kit tooling), with `contrast-pairs.json` and `tested-range.json`. **Run from the plugin**, in the app's folder (`$KIT`, common.md) | only `ds-validate.mjs` → `scripts/`, for the repo's CI |
| `wiring/theme-block.css`, `wiring/focus.css` | The theme block that replaces shadcn's theme variables, and the single `:focus-visible` rule | merged into the global CSS (`components.json` → `tailwind.css`) |
| `wiring/theme-provider.tsx` | next-themes on `data-theme` (works on Vite too) | `<aliases.components>/theme-provider.tsx`, wrapped around the root layout (Next.js) or the root render in `main.tsx` (Vite) |
| `wiring/locale.ts` | Seed for the app's locale defaults (locale, week start, date format). App-owned once copied: Setup fills it from the inputs; devs edit it | `<aliases.lib>/locale.ts` |
| `wiring/next/eslint.config.mjs` | Next.js: flat config with the jsx-a11y rules | `eslint.config.mjs` (or its a11y block added to the repo's) |
| `wiring/vite/eslint.design-system.ts`, `.mjs`; `wiring/vite/oxlint.design-system.jsonc` | Vite: `withDesignSystem()` — the repo's style rules off for vendored files, the kit's blocks — for a TypeScript or JavaScript flat config; the oxlint override | **pasted into** the app's own lint configs (no file) |
| `wiring/doctor.design-system.jsonc` | React Doctor overrides for the same paths as the lint blocks: stock markup, cva and DatePicker helper exports, kit tests and scripts | the app's `doctor.config.json` → `ignore.overrides`, when the repo runs React Doctor |
| `wiring/vite/fonts.css` | Vite: font package imports (or `@font-face` for a face with no package) and the `--font-*` variables | beside the token file, imported after it |
| `wiring/design-system.json` | The repo config template, `kitVersion` included | `.ttt/design-system.json` |
| `wiring/CLAUDE.design-system.md` | The design-system section of `CLAUDE.md`, with the "Replaced by stock" table | appended to `CLAUDE.md` |
| `wiring/package.fragment.json`, `wiring/<framework>/package.fragment.json` | Scripts and dependencies the above need — shared, then the framework's | merged into the app's `package.json` (missing entries only) |
| `wiring/ds-drift.test.mjs` | Validates the repo against its System section snapshot, so the repo's test run (and CI) fails on drift | `scripts/ds-drift.test.mjs`, beside `ds-validate.mjs` |
| `harness/` | The kit's own tests: Vitest setup, script tests, the bundle-builder fixture (a deliberately different repo shape — namespace `Acme`, `~` alias, `lib/ui`). Run by `kit/ci` (`npm test`) and the kit's GitHub workflow | not copied |
| `figma/specs.md` | How each baseline component is constructed in Figma: measurements, tokens, parts, variants and states, properties, the "In use" example | read by Setup's and Sync's Figma steps; not copied |
| `figma/lib.js` | The Figma builder library, prepended to every `use_figma` script that builds library pages | not copied |
| `figma/icons.mjs` | Prints the icon geometry from the app's installed icon package for the Utilities page | run from the kit against the app; not copied |

On Next.js, `build:safe` also needs `distDir: process.env.NEXT_DIST_DIR || ".next"` in `next.config`. On Vite it is plain `vite build`.

## How Setup uses it

The Setup skill (`skills/setup/`) is the procedure; in short: prerequisites and pre-flight (`ds-validate --preflight` against the repo's lockfile), every input asked for, tokens generated from the template by `kit/tools/ds-setup.mjs tokens` with contrast fitted and checked, the code branch from `kit/code/<profile>/`, the design system created from the Design System artifact type and filled from this template (`ds-setup.mjs fill`, then the brand book's prose from the inputs), the designer's review, the Figma library, and the PR.

Placeholders to fill: `{{CLIENT_NAME}}`, `{{NAMESPACE}}`, `{{N_IMPLEMENTED}}`, `{{N_VALIDATED}}` (the bundle global, in the index, the config and every preview), `{{REACT_VERSION}}`, `{{ONE_SENTENCE_BRAND_SUMMARY}}`, `{{NOW_ISO}}`, `{{OWNER}}`, `{{PROFILE}}`, `{{PLATFORM}}`, `{{KIT_VERSION}}`, the brand book's section placeholders, and those in `kit/code/<profile>/wiring/`.

## How Sync uses it

Reads the system's contract (schema and profile first), generates the theme file and installs components as the profile describes, writes the repo guardrails, and moves each component from `validated` to `implemented` once it's in the codebase.

## Changes

**0.11.0** (2026-10-08) — provisional inputs and restyle: start generic, take on the style later
- **Setup's inputs can be provisional** (`references/inputs.md`). Design teams often start generic and pass the style once the client approves UI samples, so each answer is *decided*, *provisional · default* (the kit's default, e.g. the template's placeholder brand ramp) or *provisional · extracted* (proposed by Claude from client material the person handed over, with its source, and accepted). Still nothing is guessed: provisional is an answer the person gives.
- **Lock now, or provisional.** Inputs that change structure — client name and namespace, locale settings, status mode, kit extensions — are decided at Setup; the rest (brand colours, neutral tint, fonts, logo, guidelines and voice, radius, motion, status colours, client ramps, cover) can wait. `ds-setup.mjs tokens` refuses a lock-now key in `inputs.provisional`, and a brand colour can be `"default"` only while provisional. Two new tests.
- **Extraction and directions.** Claude can propose inputs from client material (only what the person hands over), one line each with its source; when the designer is choosing between looks, one value set per direction, compared with the token tool before Setup starts on one.
- **The System section lists what's provisional** (`01-system.md`, a **Provisional** line), and the brand book marks provisional values; review and the report say so.
- **`/ds-sync restyle`** (`references/restyle.md`): new values for any of those inputs on a design system that exists — usually the provisional ones once the style is chosen, or a designer's later revision. `ds-setup.mjs restyle` runs Setup's generators and grafts only what the changed inputs drive onto the live tokens (the designer's other edits stay), moves the tokens that were a colour when it lands on another step, fits contrast, and reports the whole diff and every hand-edited step it replaces. The designer approves the diff and screenshots before anything is published; then the design system is updated and pull carries it to code and Figma, plus the font wiring and Figma text styles pull doesn't carry. Values only — structure changes stop with what they need instead. Five new tests (22).

**Upgrading a 0.10.2 repo**: nothing but the stamp. A design system set up before 0.11.0 has no **Provisional** line; restyle treats that as none provisional, and adds the line the first time it publishes.

**0.10.2** (2026-10-08) — React Doctor findings from Districtly's upgrade PR; Figma spec catch-up
- **DataTable and DatePicker keep a default when an override is `undefined`.** `strings` merged as `{ ...defaults, ...overrides }`, so `strings={{ rowsPerPage: undefined }}` — easy to produce from a conditional — rendered a blank label (React Doctor: `no-spread-props-over-defaults-clobbers-with-undefined`). Both now merge through `withDefaults`, which skips `undefined`. Two new tests.
- **React Doctor overrides** (`wiring/doctor.design-system.jsonc`) add `react-doctor/jsx-no-constructed-context-values` for the component folder: ToggleGroup's stock context value is built inline, and memoizing it would fork the stock file. Same reasoning as the overrides 0.5.1 added.
- **Figma spec** (`figma/specs.md`), from the Districtly build: Toggle's icon-only form is a `Content text · icon` variant, not a "Show label" boolean (a boolean can't change the padding, so icon-only toggles came out wider than tall); Button gains `State=disabled` on its outline icon sizes, so a pager's disabled arrows aren't faked with opacity.

**Upgrading a 0.10.1 repo**: `/ds-upgrade` replaces `data-table.tsx` and `date-picker.tsx` (merging any client edits). If the repo runs React Doctor, add `react-doctor/jsx-no-constructed-context-values` to the component folder's override in its `doctor.config.json` (a section, done by hand — it isn't a whole kit file). Libraries built before 0.10.2 keep their Toggle and Button sets until a publish-back rebuilds them; nothing breaks meanwhile.

**0.10.1** (2026-10-08) — Upgrade offers new components
- **The offer** (`references/upgrade.md` step 5b): after the dry run, the components the kit has and the repo doesn't are offered once, in one message — what each is for, *candidate* where the profile says so, and what it brings — the way Setup offers kit extensions. Nothing is added unless named. 0.10.0 only listed them in the report, and nothing said how to ask for one.
- **Adding to a repo already on the kit's version**: `/ds-upgrade` no longer stops at "nothing to do" when components are available; it offers them and opens a `ds-add/<date>` PR for those taken. (A Components skill remains the long-term home.)
- **`ds-upgrade.mjs --add <names>`**: adds components with what they import from the component folder — a missing file comes too (ToggleGroup brings Toggle); a stock file that lacks an imported name is swapped for its kit extension when the repo's copy is unmodified (DataTable swaps stock Table for the kit's, for `TableSortButton`) and blocks the component when it's customized; npm packages the added files import and the app doesn't declare are listed for the skill to install. Each requested component is all-or-nothing. Four new tests (11).

**Upgrading a 0.10.0 repo**: nothing but the stamp.

**0.10.0** (2026-10-08) — the Upgrade skill
- **`/ds-upgrade`** (`skills/upgrade/`): catches a repo up to the installed kit as its own PR. Versions first (nothing to do, or stop when the repo is newer or the schema/profile differ), then the changelog's steps from the repo's `kitVersion` on, split into file steps (the reconcile does them), other steps (tokens, config keys, call sites, packages — done in version order) and design-system steps (`/ds-sync publish` after the merge).
- **`kit/tools/ds-upgrade.mjs`** reconciles every kit file the repo carries, so client changes survive an upgrade. Each file's base is the kit file at the release tag of **its own stamp** (an upgrade restamps only what it touches, so `kitVersion` isn't enough), picked by the stamp's kind — stock, kit extension, wiring, kit file — so a repo that kept stock Table reconciles against stock. Base and new kit file go through the repo's Prettier (honouring `.prettierignore`) first: a format-on-commit hook otherwise makes every file look customized. Outcomes: stamp, replace, keep (customized; the kit didn't change it), merge (three-way, clean), conflict (left with its old stamp, the conflict and the kit's file saved for a dev), plus unknown, removed, obsolete (kit tests) and app-owned (`locale.ts`, Vite's `fonts.css`). The plan shows every customization as a diff against its base, and the skill flags any the design system doesn't list under Client extensions as undocumented drift. Seven tests.
- Proven on Districtly (0.8.0/0.8.1 → 0.9.0): all 43 kit files identical to their base after Prettier (40 stamp, `ds-validate.mjs` replace, two app-owned). With a client edit on Sidebar away from 0.8.1's change and one on DatePicker's trigger, which 0.8.1 rewrote: Sidebar merged with both changes, DatePicker conflicted and was left as it was, and the app typechecked.
- `common.md` §2 points a repo that's behind at `/ds-upgrade`.

**Upgrading a 0.9.0 repo**: nothing but the stamp — `/ds-upgrade` does it.

**0.9.0** (2026-10-08) — profile `shadcn` 1.9; three stock components and a data table
- **Toggle, ToggleGroup and ButtonGroup** join the baseline (37 components), each with a README, a preview and a Figma spec. Their stock files take the kit's baseline: the global focus outline instead of stock's ring (Toggle), the radius roles (D1: a toggle is a button, so `radius-md`, `sm` `radius-sm`; a joined group rounds its outer corners to match Button inside a group), and imports from `@/components/ui`. One stock gap fixed: ToggleGroup took `orientation` but never gave it to Base UI, so a vertical group moved with left/right; it now moves with up/down.
- **DataTable** (kit extension, candidate): shadcn's data-table guide as one kit file on `@tanstack/react-table` v8. `useDataTable` (the guide's row models and state), `DataTable` (rows from any TanStack table; `aria-sort` on the sorted column, `data-state="selected"`, Empty when there are no rows), `DataTableColumnHeader` (Table's `TableSortButton`), `DataTablePagination` (selected count, rows per page, page N of M, first/previous/next/last in a ButtonGroup), `DataTableViewOptions` (the Columns menu) and `dataTableSelectColumn()`. Visible text through `strings`, as in DatePicker. It uses Table's kit file, so choosing it brings that file. Six interaction tests. Server-side tables call `useReactTable` themselves; every part takes any table.
- `@tanstack/react-table` goes in the package fragment, added only when DataTable is chosen. The kit's CI tests on 8.21.3; it stays out of the tested range until an acceptance run uses it.
- `ds-types` keeps a function's type parameters (`DataTable<TData>`); they were dropped, leaving `TanStackTable<TData>` with nothing declaring `TData`.
- Setup: a chosen DataTable installs `table.tsx`'s kit file too; one not chosen has its template folder deleted and gets no Figma section. The code step no longer says kit tests are copied (they haven't been since 0.8.0).

**Upgrading a 0.8.1 repo**: optional — nothing existing changes. To take the new components, copy `toggle.tsx`, `toggle-group.tsx` and `button-group.tsx` from `stock/ui/` (and, for DataTable, `kit/ui/data-table.tsx` plus `kit/ui/table.tsx` if the repo has stock Table, and `@tanstack/react-table@8.21.3`); then stamp the config and `ds-validate.mjs`. `/ds-sync publish` adds their design-system pages and Figma sections.

**0.8.1** (2026-10-08) — profile `shadcn` 1.8; three component fixes from Districtly
- **DatePicker follows shadcn's examples.** It had used the older composition, an `Input` beside an outline icon `Button`, and `typed={false}` left the icon button on its own. Now the typed field is an Input Group with the calendar button inside it at the end (shadcn's "Input" example; ArrowDown opens the calendar), a range types both ends in one field, and `typed={false}` is shadcn's "Basic" / "Range" trigger: an outline button showing the value, or "Pick a date". Picking a single date closes the calendar. Props, parsing and validation are unchanged; five new tests.
- **Combobox multi-select list keeps the field's width.** The template's example didn't anchor the list, so it anchored to the chips' text input and narrowed with every chip. The preview and README now use shadcn's `useComboboxAnchor()` on `ComboboxChips` and `ComboboxContent`; the component itself was already stock.
- **Sidebar items: space between them, and hover and active told apart.** Menu items sat flush (`gap-0`) and hover and the current page were both `sidebar-accent`, mapped to `background-elevated` (white in light mode), so a hovered item merged into the current one. Items are now 4px apart (`gap-1`, as shadcn's earlier sidebar had); `sidebar-accent` maps to `fill-normal` for hover; the current item and pressed take `fill-strong`, one step darker, and keep it on hover. The token file regenerates (`--sidebar-accent`).

**Upgrading a 0.8.0 repo**: replace `src/components/ui/date-picker.tsx` and `sidebar.tsx` with 0.8.1's and rerun `ds-tokens` (the `sidebar-accent` mapping changed); add the anchor to any multi-select `Combobox` (`const anchor = useComboboxAnchor()`, `<ComboboxChips ref={anchor}>`, `<ComboboxContent anchor={anchor}>`); stamp the config and `ds-validate.mjs`. Then `/ds-sync publish` refreshes the DatePicker, Combobox and Sidebar pages and Figma's DatePicker and Sidebar/Item.

**0.8.0** (2026-10-08) — profile `shadcn` 1.7; a client repo carries the app, not the kit
- **Tools run from the plugin.** The skills run `ds-tokens`, `ds-contrast`, `ds-build-bundle`, `ds-pack-react`, `ds-styling-maps` and `ds-types` from the installed plugin (`$KIT`), in the app's folder; each takes the current directory (or `--repo`) as the app and loads the app's own esbuild, TypeScript and React. A repo carries **one** kit script, `scripts/ds-validate.mjs` — now self-contained (it holds the token mapping) — with `scripts/ds-drift.test.mjs`, so its CI still fails on config errors and drift. `package.json` gets one script, `ds:validate`.
- **The kit tests itself.** Script tests, the bundle fixture and the extensions' interaction tests no longer ship into repos: `kit/ci` assembles the kit as an app has it and runs a strict typecheck, the component and script tests, the Setup tool's tests and the fixture (`npm test`), and `.github/workflows/kit.yml` runs it on every PR. Its first run caught five kit tests with an unused `React` import, fixed.
- **ESLint helper pasted, not copied:** `wiring/vite/eslint.design-system.ts` (or `.mjs`) goes into the app's own config; no `.mjs` or `.d.mts` in the repo.
- **Fonts from packages** where they exist (`@fontsource-variable/*` on Vite, `next/font/google` on Next.js); files only for a face with no package.
- **`CLAUDE.md` section** 224 → 92 lines: the Tokens table defers to the design system's generated "Using in code", and the tooling section is three lines.
- Districtly, upgraded from 0.5.0: its Setup and upgrade branches carried 23 kit-tooling files and 8 font files; after the upgrade, 2 kit files and no font files.

**Upgrading a 0.7.0 (or 0.5.x–0.6.x) repo**: delete every `scripts/ds-*.mjs` except `ds-validate.mjs` (replace it with 0.8.0's), `scripts/contrast-pairs.json`, `scripts/tested-range.json`, `scripts/__tests__/` and `scripts/__fixtures__/`; add `wiring/ds-drift.test.mjs` as `scripts/ds-drift.test.mjs`; delete the kit's interaction tests from the component folder (`*.test.tsx` that came from `kit/ui/`); remove every `ds:*` script but `ds:validate` from `package.json`; on Vite, paste `eslint.design-system.ts`/`.mjs` into the ESLint config and delete the copied `.mjs`/`.d.mts`; narrow `.prettierignore`'s `scripts/` to the two kit files; replace the `CLAUDE.md` section with 0.8.0's. Optionally swap vendored font files for packages. Then the usual stamp and System row.

**0.7.0** (2026-10-08) — profile `shadcn` 1.6; four gaps from the Districtly Setup PR
- **Cover**: `kit/template/components/Cover/preview.html` — the Design System type's cover, generated by Setup from the template: name, tagline and a motif (`grid`, `dots`, `lines` or `none`, chosen from the brand book, reason recorded), every colour, radius and space a token from the bundle. New input row 15. Districtly's had been hand-written.
- **Lint**: `wiring/vite/eslint.design-system.mjs` exports `withDesignSystem(entries)`: the repo's entries, the kit's blocks, then the repo's **style** rules — those ESLint itself types `layout` or `suggestion` — off for the vendored files (`src/components/ui/**`, `theme-provider.tsx`, `use-mobile.ts`). Correctness, security, hooks and accessibility rules stay on. Districtly: 213 warnings → 0. The kit's own `eslint.design-system.mjs` is ignored like `scripts/`.
- **Figma tints**: `ds-styling-maps` keeps a colour's opacity modifier (`bg-destructive/10` → `` `status-negative` · 10% ``) instead of dropping it; Figma binds the variable at that paint opacity and the read-back checks it. "Used by" lists are unchanged.
- **Dark (and very light) brand colours**: a colour stays on its usual step unless that would squeeze one side of its ramp into under half its room; then it sits on the step its lightness matches, and an end step stretches to a colour beyond the whole ladder. The semantic tokens that were the colour move with it. Districtly's Civic Ink `#14213D` is now used as given (step 10) instead of a lighter stand-in; mid-tone colours (Jelly, Districtly's primary and accent) are unchanged.

**Upgrading a 0.6.1 repo**: copy the 0.7.0 `ds-styling-maps.mjs`; on Vite, copy `eslint.design-system.mjs` (and `.d.mts` if the config is TypeScript) and change the config to `defineConfig(withDesignSystem([...entries]))`. The next publish-back regenerates the styling maps with opacities; the next Figma build binds them. Covers and token generation are Setup-only — an existing design system keeps its cover.

**0.6.1** (2026-10-08) — two loose ends from the Districtly run
- **Status colours: Setup asks what each one means** before a brand colour goes on a status ramp. Components hard-wire them: `negative` colours every error and destructive action across 13 stock components. A colour the brand reserves for something else (Districtly's coral marked "attention moments", not errors) keeps the status default and gets a home of its own: a client-added ramp or the accent. See Setup's `inputs.md`.
- **Drift is checked in CI.** The repo commits a snapshot of the System section, `.ttt/system.md` (config `systemIn`), written by Setup and Sync's pull like the token snapshot. `ds:validate` reads it by default (`--system` still wins) and tags each disagreement as `drift`. The new harness test `ds-drift.test.mjs` runs validation on the repo inside its own tests, so the existing CI test job fails on drift and on config errors. Tried on Districtly: it passes, then fails with "weekStartsOn is Sunday; the System section records Monday" after the app's week start is changed.

**Upgrading a 0.6.0 repo**: copy the 0.6.1 scripts and `scripts/__tests__/` (with the new `ds-drift.test.mjs`); write the design system's `project/01-system.md` to `.ttt/system.md`; add `"systemIn": ".ttt/system.md"` to the config. A Sync pull does the last two by itself.

**0.6.0** (2026-10-08) — the token tool places brand colours the designer's way
- **A colour can sit on another step.** Brand and status colours take `{ "hex", "step" }` as well as a hex, like client-added ramps already did. The report's Notes list the semantic tokens still on the usual step.
- **A colour no step can hold gets options, not a dead end.** It used to stop with "ask the designer which step it belongs on" even when no step could hold it (Districtly's Civic Ink, `#14213D`, is darker than the secondary ramp's darkest step). Now it offers three same-hue colours on the role's usual step: the nearest that fits, a third of the way, and the step's own lightness. The designer's answer is recorded as `{ "hex", "step", "from" }`, and `from` reaches the token's usage text and the System section.
- **Chroma is capped** at 1.25× the brand colour's own, so a colour anchored near a grey end step doesn't turn the middle of its ramp brighter than the brand. Existing ramps are unchanged; the Districtly inputs produce identical tokens.
- No change to client repos: the token tool runs from the kit. A repo upgrading from 0.5.2 only restamps.

**Upgrading a repo**, for every version: the upgrade is its own PR, never a side effect of Sync. From 0.10.0, `/ds-upgrade` does it: it reconciles the repo's kit files (keeping the client's changes), follows the version's steps below, sets `kitVersion` and opens the PR; `/ds-sync publish` then updates the design system's System section Versions row (profile and kit) — read before you publish (common.md §3) — so all three agree (common.md §2). By hand: follow the version's steps, then set `kitVersion`, stamp every kit file with the new version, and update the Versions row.

**0.5.2** (2026-10-08) — profile `shadcn` 1.5, lessons from the Districtly Setup run
- **`wiring/vite/eslint.design-system.d.mts`**: types for the kit's ESLint blocks, copied beside them when the app's flat config is TypeScript (TTT's starter has `eslint.config.ts`). Without it the import fails the typecheck.
- **Formatter wiring**: Setup keeps Prettier (or any formatter that rewrites on commit) off the kit-owned and generated paths — `.ttt/`, `scripts/`, the token file — through the `.prettierignore` it reads. The token snapshot must stay byte for byte.
- **Pinned toolchain**: commands run under the repo's pinned Node (common.md §9); a non-login shell picked up Node 22 instead of the starter's 24, and oxlint's TypeScript plugin failed to load.
- **Upgrades update the System section's Versions row** (above), so the design system doesn't keep naming the old kit.
- **Updating the plugin**: Install covers refreshing the marketplace and updating the plugin locally.

**Upgrading a 0.5.1 repo**: if the app's ESLint config is TypeScript and has no declaration for the kit's block, copy `eslint.design-system.d.mts` beside it; if the repo runs Prettier and its `.prettierignore` doesn't cover `.ttt/`, `scripts/` and the token file, add them.

**0.5.1** (2026-10-08) — profile `shadcn` 1.5, from the review of the Districtly setup PR
- **DatePicker syncs from `value` without an effect.** Typed text is kept as a draft tied to the value it was typed against: when `value` changes (a pick, or the caller setting it) the input shows the new value in the same render, with no frame of stale text, and a calendar pick reports the cleared error from its own event. A caller that sets `value` itself (a form reset) clears any validation message it holds. Four new interaction tests.
- **React Doctor stays quiet about stock files.** Setup adds `wiring/doctor.design-system.jsonc` to the app's React Doctor config when the repo runs it, mirroring the oxlint override: a fresh setup went from 35 findings to the repo's own 3.

**Upgrading a 0.5.0 repo**: copy `date-picker.tsx` and its test; if the repo runs React Doctor, add the overrides; stamp the kit files and `kitVersion` 0.5.1.

**0.5.0** (2026-10-08) — profile `shadcn` 1.4
- **Figma libraries are constructed, not generated.** Setup's Figma step builds every component to `kit/code/shadcn/figma/specs.md` with the kit's builder (`figma/lib.js`): the page order and section layout of the reference library (root frame per page, a section per component with description, set and an "In use" example), State axes, component properties, `<Component>/<Part>` sets composed as instances, content in the client's voice, and icons from the app's own package (`figma/icons.mjs`) on a Utilities page. The styling maps become the check, not the blueprint. The read-back adds zero unbound paints, zero unstyled text, and a screenshot review per section. Sync's publish-back follows the same spec and builder. Learned on the Districtly run: the first, map-generated library was unusable.
- **Locale defaults move to the app.** Locale, week start and date format are product decisions the app owns: `wiring/locale.ts` seeds `<aliases.lib>/locale.ts` (plain literals: `localeTag`, `locale`, `weekStartsOn`, `dateFormat`), which Calendar and DatePicker default to and props override. `wiring/ds-settings.ts` is gone and `.ttt/design-system.json` no longer has `settings` (the app no longer bundles the repo config). The System section still records the decision; `ds-validate` checks the module and, with `--system`, warns when code and the System section differ. Setup's date-format input is the numeric typed-entry pattern.
- Contract: Client settings and Config validation updated to match.

**Upgrading a 0.4.x repo** (its own PR, never a side effect of Sync): copy the 0.5.0 scripts, `calendar.tsx`, `date-picker.tsx` and its test; write `<aliases.lib>/locale.ts` from `wiring/locale.ts` with the values in `.ttt/design-system.json` → `settings`; delete `<aliases.lib>/ds-settings.ts` and `settings`; replace `CLAUDE.md`'s Client settings section with the 0.5.0 Locale defaults section; set `kitVersion` to 0.5.0. `ds-validate` warns on a leftover `settings` key until it's removed.

**0.4.1** (2026-10-08)
- Setup adds the missing dev setup itself. Pre-flight has a fourth outcome, **missing setup**: Tailwind v4, the `@/*` alias in `tsconfig.json` or `shadcn init` simply absent. Setup lists what it would add, asks once, and on a yes does them first on its branch (Tailwind with the framework's plugin and the CSS import, the alias, then `shadcn@4.21.1 init`), one commit each, then re-checks versions. The PR lists them under "Dev setup done by Setup". Anything that would change what's there — Tailwind v3, a `tailwind.config`, another shadcn style — is still blocked.

**0.4.0** (2026-10-08) — profile `shadcn` 1.3
- **Vite** joins Next.js as a supported framework of the shadcn profile, proven by an acceptance run on TTT's full-stack starter (pnpm + Turborepo, `apps/web` on Vite 7, ESLint 10, Vitest 4, oxlint). Components, kit extensions, scripts and the token mapping are shared; the framework sets the tested range, the dev checklist, pre-flight and the wiring. The repo config gains `framework` (`"next"` | `"vite"`; absent means `"next"`).
- `tested-range.json` has shared `packages` plus `frameworks.next` and `frameworks.vite`; `ds-validate --preflight` checks the app's framework (read from its `package.json` when there's no config yet).
- **Monorepos and pnpm**: the scripts read installed versions from an npm lockfile in the app's folder or above it, else from `node_modules` up to the workspace root — `ds-validate`, `ds-build-bundle` and `ds-pack-react` no longer require a `package-lock.json`. Every skill runs in the app's folder with the repo's package manager (`common.md`).
- Wiring: `wiring/next/` (the ESLint flat config, the Next.js package fragment) and `wiring/vite/` (ESLint and oxlint blocks scoped to the component folder and `scripts/`, `fonts.css` with `@font-face` and the `--font-*` variables unlayered, the Vite package fragment). The shared package fragment keeps the `ds:*` scripts and component dependencies.
- Setup: pre-flight asks for the app's folder in a monorepo and reads the framework and package manager; the "unmodified stock" check compares after the repo's formatter (a Prettier hook reformats every file shadcn writes); the code step wires fonts, the theme provider, lint and the test config per framework.
- Fixed, found by the Vite run: `ds-styling-maps --using-in-code` printed `<prefix>undefined` for a type scale with no `body` style (operator precedence); an unused import in the DatePicker test; an unused parameter in `ds-validate`.

**0.3.1** (2026-10-08)
- Pull republishes the design system's **preview bundle** (new step 9): `bundle.css` is generated from the token file, so a token pull left the previews on the old tokens until a publish-back. It's built on the pull branch (or `main` when nothing changed in code), only what differs is sent, and a changed `bundle.css` gets the preview check, with differences reported as visible preview differences.
- Pull sets `lastSynced` **before** regenerating the token file, whose "Snapshot synced" header records it; it was set afterwards, leaving the header one pull behind. `ds-validate` warns when the header and `lastSynced` disagree.

**0.3.0** (2026-10-07)
- **Setup** skill (`skills/setup/`, `/ds-setup`), drafted: prerequisites, pre-flight (ready / adaptable / blocked, including the existing-UI stop), every input asked for and none guessed, tokens, the code branch, the design system created from the Design System artifact type, a review gate, the Figma library after approval, the PR. It reuses `common.md` and Sync's `figma.md`.
- `kit/tools/ds-setup.mjs` (kit-side, with tests): `tokens` generates role-named ramps from each brand hex in OKLCH, the hex exactly on its documented step, and moves only `on-*`, `*-text`, status, inverse and chart steps until every contrast pair passes; it reports what it couldn't fix, raw-value semantic tokens and shared grounds. `fill` fills the template's placeholders and lists what's left.
- `ds-validate --preflight` runs the lockfile check even before `.ttt/design-system.json` exists (Setup's pre-flight).
- `common.md`: a pending mark flips only when the merged code or the Figma read-back matches what the entry says now. `figma.md`: token comparisons cover value or alias, scopes, code syntax and description, and new variables get `WEB` code syntax.
- Template: the brand accent lands on `brand-accent-60` (its usage text said 50, while the brand book and `accent-normal` use 60); status ramps document where a given status colour lands; the System section's counts are `{{N_IMPLEMENTED}}` and `{{N_VALIDATED}}`.

**0.2.1** (2026-10-07)
- Pull owns design → Figma as well as design → code: after the snapshot it pushes every token change to the Figma variables (new, changed values and aliases, removed), reads them back, and reminds the designer to publish the library. Without a connector Figma stays pending and the code PR still opens. `figma.md` is split into a Tokens part (pull and publish) and a Components part (publish only).
- Contract: **client-added ramps** — primitive ramps beyond the standard roles, named by role, recorded in the System section's client-specific choices. `ds-validate` rejects a ramp named by hue and, with `--system <01-system.md>`, warns on one the System section doesn't list.
- Pending changelog marks flip themselves: every Sync run first flips `Code pending` (merged PR whose result is still current) and `Figma pending` (confirmed read-back) — only what it verified — and reports each flip (`common.md` §6).

**0.2.0** (2026-10-07)
- The repo is a plugin marketplace (`ttt-design`) with the first skill: **Sync** (`skills/sync/`, `/ds-sync pull | publish`), steps in `references/`.
- `kit/procedures/common.md`: the rules every skill follows, for Setup, Components and Drift audit to reuse.
- Contract: a third preview banner, "Preview from the kit's code", for components whose code is a kit file.

**0.1.2** (2026-10-07)
- Template catch-up: `components/` now has all 34 baseline components (was 19), one per stock file, each with a neutral README and a `preview.html`. Nothing from before Base UI remains: snippets use `render` and `onClick`, maps are generated from the kit's stock code against the template's placeholder tokens, and previews were checked against a bundle built from the kit in both themes.
- Agreed rules carried from the worked example, without its brand choices: Field's exceptions, `aria-describedby` by hand and focus on a failed submit; the loading-button composition; Alert's dismissal rule; AlertDialog as the component only; Separator for meaningful divisions; Combobox inside an Input Group; DatePicker's client settings and typed input.
- The profile's baseline inventory matches `kit/code/shadcn/stock/` (Label under Input, Calendar under DatePicker).
- `ds-validate --template <config> --tokens <tokens>` checks the kit's own templates, accepting `{{…}}` placeholders; `ds-contrast --config <file>`. Both pass on the template.
- The template index declares React as the profile's classic-script globals (`components/lib/`, `{{REACT_VERSION}}`) instead of React 18 from a CDN; the namespace placeholder is `{{NAMESPACE}}` everywhere.

**0.1.1** (2026-10-07)
- `ds-validate.mjs` — the contract's config validation: every config key, the token snapshot, the theme block's `@source`, `kitVersion` against the scripts; `--preflight` compares the lockfile with the tested range.
- `ds-contrast.mjs` with a generic `contrast-pairs.json`; misses fail unless the config lists them under `contrast.intentional`.
- `ds-styling-maps.mjs` resolves spacing utilities to space tokens; new `--used-by` (the tokens' "Used by" lists) and `--using-in-code` (the design system's "Using in code" section); `--all` covers every UI file.
- The profile defines the **tested range** from acceptance runs (`scripts/tested-range.json`), and pre-flight checks the lockfile against it.
- Config template: `contrast.intentional` (`label-disable`) and `usingInCode.notes`. Package fragment and CLAUDE.md section: `ds:validate`, `ds:contrast`. Harness: tests for both scripts.
- Template tokens: four placeholder steps changed so the template passes its own contrast pairs (`label-alternative` and `label-assistive` dark, `accent-text` light, `primary-strong` dark).

**0.1.0** (2026-10-07) — first release, extracted from Jelly.

## Not in the kit yet

- **Components and Drift audit.** Setup, Sync and Upgrade are written; the others will reuse `kit/procedures/common.md`.
- **Other profiles.** Ant Design, MUI or a mobile library each need their own `profiles/<library>.md` and `code/<library>/`; nothing else changes.
