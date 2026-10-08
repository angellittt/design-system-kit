# Code — the branch, then the PR

design-system-kit 0.11.0

Setup step 5 builds the code branch; step 9 opens its PR. Paths are the
app's folder; commands use the repo's package manager (common.md, "The app
and its package manager"). Everything comes
from `kit/code/<profile>/` in the plugin, laid out as `kit/README.md`'s
"`kit/code/shadcn/`" table says — read that table first; it's the map for
this whole step. Paths below are shadcn's; another profile names its own.

## 1. Branch

From the repo's up-to-date default branch: `ds-setup/<YYYY-MM-DD>`. Commit as
you go; every commit message ends with the session's attribution.

**Only design-system paths change**: the component folder, `scripts/`, the
wiring files, `.ttt/`, the token file, `CLAUDE.md`'s design-system section,
`package.json` and its lockfile, the test harness, the lint configs (Vite:
the scoped blocks), `next.config` (`distDir`, Next.js only), the font
files — and, only when pre-flight found them missing and the person agreed,
the dev setup in §2 (`vite.config` or `postcss.config.mjs`, the entry CSS's
Tailwind import, `tsconfig.json`'s alias, `components.json`). Nothing else in the app is touched; if something else
would have to change, list it in the report instead.

## 2. Dev setup — only what pre-flight found missing, only with a yes

Skip this section unless pre-flight reported **missing setup** and the person
agreed to it (`preflight.md`, "Missing setup → ask once"). Do only the pieces
it listed, in this order, each as its own commit ("Dev setup: …") so the dev
can review them apart from the design system. Each one only **adds**; if any
step would have to change something that exists, stop and report it as a
blocker instead.

1. **Tailwind v4**, at the framework's tested max:
   - Vite: add `tailwindcss` and `@tailwindcss/vite`; in `vite.config`,
     import `tailwindcss from "@tailwindcss/vite"` and add `tailwindcss()` to
     `plugins`; put `@import "tailwindcss";` as the first line of the entry
     CSS (the file `main.tsx` imports; create `src/index.css` and import it
     only if there is none).
   - Next.js: add `tailwindcss` and `@tailwindcss/postcss`; write
     `postcss.config.mjs` (`plugins: { "@tailwindcss/postcss": {} }`) if
     there is none; `@import "tailwindcss";` first in the global CSS.
2. **The `@/*` alias in `tsconfig.json`** — `compilerOptions.paths` `{"@/*":
   ["./src/*"]}` (with `baseUrl: "."`), matching what `tsconfig.app.json`
   already has; keep `files` and `references` as they are. On Vite, confirm
   something resolves it at build time (`vite-tsconfig-paths` in
   `vite.config`, or `resolve.alias`); if nothing does, add `resolve.alias`
   for `@`.
3. **`shadcn init`**, in the app's folder, with the repo's package manager:
   `pnpm dlx shadcn@4.21.1 init --preset nova --base base --yes` (npm: `npx`;
   Yarn: `yarn dlx`). Check `components.json` afterwards: style `base-nova`,
   base colour `neutral`, CSS variables on, icon library `lucide`, the CSS
   path where step 1 put the import. The CLI may also add a font package
   (e.g. `@fontsource-variable/geist`) — leave it and list it.

Then run pre-flight's version check again (`ds-validate --preflight`):
`shadcn init` installs packages of its own (e.g. `lucide-react`), and they must
be in the framework's tested range like everything else. A package outside it
is flagged for the dev, as in pre-flight; a different major is a stop.

Everything here goes in the PR's **Dev setup done by Setup** list (§7).

## 3. Components — never overwrite a modified stock file

Use the repo's aliases (`components.json` → `aliases`; pre-flight recorded
any that differ from the profile's). For each file the inventory needs —
`stock/ui/*` for every baseline component, `stock/hooks/*`, `stock/lib/*`, and
`kit/ui/<name>.tsx` for every chosen kit extension and for DatePicker (the
kit's tests stay in the kit). A chosen DataTable brings `kit/ui/table.tsx`
too, whether or not a Table extension was chosen (it uses `TableSortButton`):

| The repo's file | What to do |
|---|---|
| Doesn't exist | Copy the kit's file in. |
| Exists and is **unmodified stock** | Replace it with the kit's file (stock + baseline changes, or the extension). |
| Exists and is **modified** | **Leave it.** List it in the PR with a short summary of how it differs from stock. If a chosen extension needed it, the extension isn't installed — say so. |

**Unmodified** means identical to what `shadcn@4.21.1 add <name>` writes for
this app's `components.json`, **after both are run through the repo's own
formatter**. Many repos reformat on commit (a Prettier pre-commit hook adds
semicolons and quotes to every file shadcn wrote), so a byte comparison would
call every stock file modified. Find out without touching the repo: copy
`components.json`, `tsconfig.json` (and `tsconfig.app.json` on Vite) and
`package.json` to a scratch folder, run `npx shadcn@4.21.1 add <name> --yes
--overwrite` there, format both copies with the repo's formatter config
(e.g. `npx prettier --config <repo>/.prettierrc`), and compare. Any
difference left counts as modified — when in doubt, leave it.

If the repo's aliases differ from `@/components/ui`, `@/lib/utils`,
`@/hooks`, rewrite the kit files' imports to the repo's aliases as you copy
them, and record that in the report.

## 4. Wiring, scripts, harness

From `kit/code/<profile>/`, into the places the README table gives:

- **The CI check** — the only kit files the repo carries: `$KIT/ds-validate.mjs`
  → `scripts/ds-validate.mjs` and `wiring/ds-drift.test.mjs` →
  `scripts/ds-drift.test.mjs`, unchanged. Every other kit tool runs from the
  plugin (common.md, "The kit's tools run from the plugin"); nothing else goes
  in `scripts/`.
- **Repo config** — `wiring/design-system.json` → `.ttt/design-system.json`,
  filled (with `systemIn`: `.ttt/system.md`): `tracker`, `lastSynced` (system clock), `namespace`,
  `tokensOut` and any adaptable path, `kitVersion` = the plugin's version.
  `designSystem` gets the link once the design system exists
  (`generate.md` §5) — until then `ds:validate` isn't run.
- **Token snapshot** — `<out>/tokens.json` → `.ttt/tokens.json`, byte for
  byte. Then `node $KIT/ds-tokens.mjs` writes the token file
  (`tokensOut`).
- **Theme block** — in the global CSS (`components.json` → `tailwind.css`),
  replace **only** shadcn's theme variable block with `wiring/theme-block.css`
  (fill `{{SOURCE_ROOT}}` — the path from the CSS file to the source root —
  and `{{TOKENS_IMPORT}}`), and add `wiring/focus.css`.
- **Theme provider** — `wiring/theme-provider.tsx` →
  `<aliases.components>/theme-provider.tsx`. Next.js: wrap the root layout's
  body in it and add `suppressHydrationWarning` to `<html>`. Vite: wrap the
  root render in `main.tsx` (`<ThemeProvider><App /></ThemeProvider>`).
- **Fonts** (profile, "Fonts") — a family left `default` loads nothing; the
  fallback stack applies.
  - **Prefer a package to font files in the repo.** A family Google Fonts or
    Fontsource publishes needs no files: Next.js loads it with
    `next/font/google`; Vite imports `@fontsource-variable/<family>` (or
    `@fontsource/<family>`), added at the version you checked. Only a licensed
    or custom face gets its files copied into the repo.
  - Next.js: `next/font/google` (or `next/font/local` for files in
    `src/app/fonts/`) in the root layout, as `--font-display`, `--font-sans`,
    `--font-mono`.
  - Vite: `wiring/vite/fonts.css` → beside the token file: the package imports
    (or one `@font-face` per file in `src/assets/fonts/`) and the variables
    for the families that load — set to the family name the package registers
    (e.g. "Public Sans Variable") — **unlayered**, imported in the global CSS
    right after the token file. A font package `shadcn init` added (e.g.
    `@fontsource-variable/geist`) stays; list it in the report.
- **Locale defaults** — `wiring/locale.ts` → `<aliases.lib>/locale.ts`, filled
  from the inputs: `localeTag`, `locale` (the matching date-fns locale, imported
  by name), `weekStartsOn` (a number, 0 = Sunday) and `dateFormat` (`""` for the
  locale's own pattern). App-owned from here on: it carries no kit version and
  later kit upgrades never overwrite it. Keep every export a plain literal.
- **Lint** — never change the repo's own rules; add the kit's scoped blocks.
  - Next.js: `wiring/next/eslint.config.mjs`, or its jsx-a11y block added to
    the repo's flat config.
  - Vite: **paste** `wiring/vite/eslint.design-system.ts` (TypeScript config)
    or `.mjs` (JavaScript config) into the repo's config file below its
    imports — no separate file — and wrap the repo's entries:
    `export default defineConfig(withDesignSystem([...the repo's entries]))`.
    It appends the
    kit's blocks and switches the repo's **style** rules (ESLint's own
    `layout` and `suggestion` types — `prefer-arrow-functions`,
    `import-x/order`) off for the vendored files only, so stock files stay as
    shadcn ships them instead of collecting hundreds of warnings; correctness,
    security, hooks and accessibility rules stay on. If the repo runs oxlint, add
    `wiring/vite/oxlint.design-system.jsonc`'s object to `.oxlintrc.json`
    `overrides`. If nothing runs jsx-a11y rules yet (no oxlint jsx-a11y
    plugin, no `eslint-plugin-jsx-a11y`), also add the jsx-a11y block from
    `wiring/next/eslint.config.mjs` and its plugin.
  - React Doctor — if the repo runs it (a workflow using
    `millionco/react-doctor`, a `doctor.config.*`, or a `reactDoctor` key in
    `package.json`), add `wiring/doctor.design-system.jsonc`'s objects to its
    config's `ignore.overrides` (no config yet → `doctor.config.json` beside
    the app's `package.json`). Same paths as the lint blocks; without it every
    setup PR reports the stock files' shadcn markup as new findings.
- **Formatter** — if the repo runs Prettier (a Prettier config, or a hook or
  script that calls it), add the kit-owned and generated paths to the
  `.prettierignore` Prettier reads (the one where it runs: the repo root in a
  monorepo, so prefix the app's folder, e.g. `apps/web/`), creating it if
  there's none: `.ttt/` (the token snapshot stays byte for byte),
  `scripts/ds-validate.mjs` and `scripts/ds-drift.test.mjs` (kit files), and
  the token file (`tokensOut`, regenerated). Add a comment
  line naming the kit. Components are left to the formatter: the unmodified
  stock check compares after it (§3). Never change the repo's Prettier config
  itself. The same goes for any other formatter that rewrites on commit: keep
  it off those paths, and say how in the PR.
- **CLAUDE.md** — append `wiring/CLAUDE.design-system.md`, every `{{…}}`
  filled and its `npm` commands written for the repo's package manager; `{{CLIENT_USAGE_RULES}}` and `{{AGREED_COMPONENT_RULES}}` start as
  "None yet." Remove its template comment.
- **Tests** — the kit's own tests (component interaction tests, script
  tests, the bundle fixture) run in the kit's CI, not here. The repo's test
  run only needs to reach `scripts/ds-drift.test.mjs` (node environment, no
  setup file): with no Vitest config, Vitest's defaults find it; with one,
  make sure its `include` reaches `scripts/*.test.mjs`.
- **`next.config`** (Next.js only) — `distDir: process.env.NEXT_DIST_DIR ||
  ".next"`.

## 5. Packages — add missing, never change existing

Merge `wiring/package.fragment.json`, then `wiring/<framework>/package.fragment.json`,
into the app's `package.json`: add every script, dependency and dev
dependency that's **missing**; never change one that's
there, whatever its version. Install each added package at its **tested
max** for the framework (`$KIT/tested-range.json`), e.g. `pnpm add
sonner@2.0.8` in the app's folder —
pre-flight already flagged any existing one outside the range.
`@tanstack/react-table` is added only when DataTable is chosen; it has no
tested range yet, so install `8.21.3`, the version the kit's CI tests
DataTable on, and say so in the PR.

For the PR, record **why** each added package is there: search the files
this step installed for its imports (`grep -rl "from \"sonner\"" …`) and
name the components (or scripts) that need it, e.g. "`react-day-picker@10.0.2`
— Calendar, DatePicker".

## 6. Check the branch

Under the repo's pinned Node (common.md §9): a non-login shell can pick up
another version, and tools that load TypeScript plugins (oxlint) fail on it.

```bash
node $KIT/ds-contrast.mjs
npm run typecheck
npm run lint              # the repo's own lint script (ESLint, and oxlint if it has it)
npm test
npm run build:safe        # Next.js: beside a dev server; Vite: plain vite build
npm run ds:validate       # the repo's own copy, as its CI runs it
```

Every one must pass. A failure is a stop: report the command and its output.
Don't change a kit file to make it pass — a kit file that fails in a client
repo is a kit bug; say so in Gaps.

`ds:validate` runs once the design system's link is in the config
(`generate.md` §5).

## 7. The PR (Setup step 9)

After the Figma step (or after it was skipped, with the reason):

1. Make sure the branch is committed and pushed; `git status` is clean.
2. Open the PR against the default branch. Title: "Design system setup —
   <client>". The body is the report (`report.md`), plus these lists:
   - **Dev setup done by Setup** — only when §2 ran: each piece (Tailwind,
     the alias, `shadcn init`), the packages and versions it added, and each
     file it created or edited;
   - **Packages added** — each `package@version` with the components or
     scripts that need it;
   - **Stock files left as they were** — each modified file and how it
     differs (and any extension not installed because of it);
   - **Adaptable findings** — each difference from the profile Setup used
     (CSS path, aliases, rewritten imports).
3. Link the PR from the design system's first changelog entry (re-read the
   live design system first — common.md §3) and publish that edit, index
   last. `Code pending` stays until the PR merges; the next Sync run flips it
   once `main` matches (common.md §6).
