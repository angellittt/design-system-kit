# Code — the branch, then the PR

design-system-kit 0.4.0

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
the scoped blocks), `next.config` (`distDir`, Next.js only) and the font
files. Nothing else in the app is touched; if something else
would have to change, list it in the report instead.

## 2. Components — never overwrite a modified stock file

Use the repo's aliases (`components.json` → `aliases`; pre-flight recorded
any that differ from the profile's). For each file the inventory needs —
`stock/ui/*` for every baseline component, `stock/hooks/*`, `stock/lib/*`, and
`kit/ui/<name>.tsx` (with its `<name>.test.tsx`) for every chosen kit
extension and for DatePicker:

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

## 3. Wiring, scripts, harness

From `kit/code/<profile>/`, into the places the README table gives:

- **Scripts** — `scripts/*` → the repo's `scripts/`, unchanged (they are kit
  files; every one names the kit version).
- **Repo config** — `wiring/design-system.json` → `.ttt/design-system.json`,
  filled: `tracker`, `lastSynced` (system clock), `settings` from the inputs
  (`weekStartsOn` as a **number**, not the quoted placeholder), `namespace`,
  `tokensOut` and any adaptable path, `kitVersion` = the plugin's version.
  `designSystem` gets the link once the design system exists
  (`generate.md` §5) — until then `ds:validate` isn't run.
- **Token snapshot** — `<out>/tokens.json` → `.ttt/tokens.json`, byte for
  byte. Then `node scripts/ds-tokens.mjs` writes the token file
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
  - Next.js: font files into the repo (e.g. `src/app/fonts/`), loaded with
    `next/font/local` in the root layout as `--font-display`, `--font-sans`,
    `--font-mono`.
  - Vite: font files into `src/assets/fonts/`; `wiring/vite/fonts.css` →
    beside the token file, one `@font-face` per file and the variables for
    the families that load, **unlayered**, imported in the global CSS right
    after the token file. A font package `shadcn init` added (e.g.
    `@fontsource-variable/geist`) stays; list it in the report.
- **Client settings** — `wiring/ds-settings.ts` →
  `<aliases.lib>/ds-settings.ts`: fix the config import path if `lib/` isn't
  at `src/lib`, and add the client's locale to `LOCALES` (its date-fns
  import, by name).
- **Lint** — never change the repo's own rules; add the kit's scoped blocks.
  - Next.js: `wiring/next/eslint.config.mjs`, or its jsx-a11y block added to
    the repo's flat config.
  - Vite: spread `wiring/vite/eslint.design-system.mjs` into the repo's flat
    config after its own entries; if the repo runs oxlint, add
    `wiring/vite/oxlint.design-system.jsonc`'s object to `.oxlintrc.json`
    `overrides`. If nothing runs jsx-a11y rules yet (no oxlint jsx-a11y
    plugin, no `eslint-plugin-jsx-a11y`), also add the jsx-a11y block from
    `wiring/next/eslint.config.mjs` and its plugin.
- **CLAUDE.md** — append `wiring/CLAUDE.design-system.md`, every `{{…}}`
  filled and its `npm` commands written for the repo's package manager; `{{CLIENT_USAGE_RULES}}` and `{{AGREED_COMPONENT_RULES}}` start as
  "None yet." Remove its template comment.
- **Harness** — `harness/scripts-tests/` → `scripts/__tests__/`,
  `harness/fixture/` → `scripts/__fixtures__/`. The test config:
  - no Vitest config yet → `harness/vitest.config.ts` and
    `harness/test/setup.ts`;
  - the repo has one (usual on Vite) → keep it, and make sure it runs in
    `jsdom`, its setup file imports `@testing-library/jest-dom/vitest`, its
    `include` reaches `src/**/*.test.tsx` and `scripts/**/*.test.mjs`, and its
    `exclude` has `scripts/__fixtures__/**` (the fixture keeps a test file on
    purpose, to prove the bundle drops it).
- **`next.config`** (Next.js only) — `distDir: process.env.NEXT_DIST_DIR ||
  ".next"`.

## 4. Packages — add missing, never change existing

Merge `wiring/package.fragment.json`, then `wiring/<framework>/package.fragment.json`,
into the app's `package.json`: add every script, dependency and dev
dependency that's **missing**; never change one that's
there, whatever its version. Install each added package at its **tested
max** for the framework (`scripts/tested-range.json`), e.g. `pnpm add
sonner@2.0.8` in the app's folder —
pre-flight already flagged any existing one outside the range.

For the PR, record **why** each added package is there: search the files
this step installed for its imports (`grep -rl "from \"sonner\"" …`) and
name the components (or scripts) that need it, e.g. "`react-day-picker@10.0.2`
— Calendar, DatePicker".

## 5. Check the branch

```bash
npm run ds:contrast
npm run typecheck
npm run lint              # the repo's own lint script (ESLint, and oxlint if it has it)
npm test
npm run build:safe        # Next.js: beside a dev server; Vite: plain vite build
npm run ds:fixture
```

Every one must pass. A failure is a stop: report the command and its output.
Don't change a kit file to make it pass — a kit file that fails in a client
repo is a kit bug; say so in Gaps.

`ds:validate` runs once the design system's link is in the config
(`generate.md` §5).

## 6. The PR (Setup step 9)

After the Figma step (or after it was skipped, with the reason):

1. Make sure the branch is committed and pushed; `git status` is clean.
2. Open the PR against the default branch. Title: "Design system setup —
   <client>". The body is the report (`report.md`), plus three lists:
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
