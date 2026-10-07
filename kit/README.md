# TTT design system kit · ttt-ds/1 · kit 0.1.0

The starting point for every client design system, bundled into TTT's four skills: **Setup** (design system + Figma + code branch, ending in a PR), **Sync** (pull → PR, publish-back), **Components** (check → propose → accept) and **Drift audit**. Extracted from Jelly, the worked example; the classification of what came over and why is in `docs/extraction/classification.md` at the repo root.

**Scope:** greenfield projects — the app is set up by devs but has little or no custom UI. Setup's pre-flight stops on projects with substantial existing UI.

**Version:** the kit's version is the plugin's (`.claude-plugin/plugin.json`). A client repo records the version it was set up or last synced with as `kitVersion` in `.ttt/design-system.json`, and every kit file it carries names that version in its header.

## What's here

| Path | What it is | Who changes it |
|---|---|---|
| `kit/contract.md` | The universal rules every system follows (read by the skills from the installed kit; never copied into a design system) | TTT, by bumping the schema version |
| `kit/profiles/shadcn.md` | Part 2 for shadcn projects: stack, config, token mapping, kit tooling, kit extensions, inventory, Figma | TTT; a new library means a new profile file |
| `kit/template/` | A brand-neutral design system in the Design System type's file format | Never edited per client; Setup copies it |
| `kit/code/shadcn/` | The code Setup applies to a client repo on this profile (below) | TTT; fixes found in a client repo are brought back here |

`kit/template/` holds `design-system.json` (the index), `README.md` (the brand book skeleton), `01-system.md`, `02-using-in-code.md`, `03-changelog.md` (with the entry format every skill writes), `tokens.json` (role-named ramps with placeholder values, the full semantic set, spacing, radius, shadows, type scale) and `components/<Comp>/README.md` for the 19 baseline components, each ending in a contract block with status `validated`.

## `kit/code/shadcn/`

Generic: no client names, tokens, prefixes or values. Every file names the kit version in its header.

| Folder | What it holds | Lands in the client repo at |
|---|---|---|
| `stock/ui/` | Stock `base-nova` components as installed by shadcn 4.21.1 on 2026-10-07, plus **baseline** changes only (each file's header lists them) | `components.json` → `aliases.ui` (default `src/components/ui/`) |
| `stock/hooks/`, `stock/lib/` | Stock's `use-mobile` and `utils` | `aliases.hooks`, `aliases.lib` |
| `kit/ui/` | **Kit extensions.** Each `<name>.tsx` is the complete component — the stock file, its baseline changes and the extensions — so opting in replaces the stock file. `date-picker.tsx` has no stock counterpart. Interaction tests sit beside them as `<name>.test.tsx` | `aliases.ui`, replacing the stock file; tests beside it |
| `scripts/` | `ds-tokens`, `ds-pack-react`, `ds-build-bundle`, `ds-styling-maps`, `ds-types` (see the profile's Kit tooling) | `scripts/` |
| `wiring/theme-block.css`, `wiring/focus.css` | The theme block that replaces shadcn's theme variables, and the single `:focus-visible` rule | merged into the global CSS (`components.json` → `tailwind.css`) |
| `wiring/theme-provider.tsx` | next-themes on `data-theme` | `<aliases.components>/theme-provider.tsx`, wrapped around the root layout |
| `wiring/ds-settings.ts` | The one reader of client settings; Setup adds the client's locale to `LOCALES` | `<aliases.lib>/ds-settings.ts` |
| `wiring/eslint.config.mjs` | Flat config with the jsx-a11y rules | `eslint.config.mjs` (or its a11y block added to the repo's) |
| `wiring/design-system.json` | The repo config template, settings and `kitVersion` included | `.ttt/design-system.json` |
| `wiring/CLAUDE.design-system.md` | The design-system section of `CLAUDE.md`, with the "Replaced by stock" table | appended to `CLAUDE.md` |
| `wiring/package.fragment.json` | Scripts and dev dependencies the above need | merged into `package.json` (missing entries only) |
| `harness/vitest.config.ts`, `harness/test/setup.ts` | Vitest + jsdom + Testing Library | `vitest.config.ts`, `src/test/setup.ts` |
| `harness/fixture/` | The bundle-builder fixture: a deliberately different repo shape (namespace `Acme`, `~` alias, `lib/ui`) | `scripts/__fixtures__/` (its `run.mjs` finds the builder at `../ds-build-bundle.mjs`) |

`build:safe` also needs `distDir: process.env.NEXT_DIST_DIR || ".next"` in `next.config`.

## How Setup uses it

1. Copy `kit/template/` into the new system's `project/` folder.
2. Write `project/01-system.md` from `kit/template/01-system.md` (versions, owner, links, client settings) — a one-screen summary; the rules stay in the kit. Write `project/02-using-in-code.md` from `kit/template/02-using-in-code.md` with the profile's token mapping as this client applies it.
3. Replace placeholder values: brand colours into the role ramps (generating each ramp from the brand hex), neutrals, type families and font files, radius if the brand is sharper or softer.
4. Fill every `{{…}}` in the brand book from the client's brand guidelines; keep "TTT default" passages unless the guidelines override them.
5. Check every contrast requirement in the semantic tokens' usage text, in Light and Dark. Adjust `on-*`, `*-text` and status steps until all pass.
6. Drop any kit extensions the client doesn't need (remove them from the component README and the profile's kit table copy).
7. Stop for the designer's review in Claude. Only after approval: generate the Figma library.
8. In the client repo, on a branch: copy `kit/code/<profile>/` into place as the table above says — stock components for the inventory, the kit file instead for each chosen extension, the scripts, wiring and harness — write `.ttt/tokens.json` from the approved tokens, run `node scripts/ds-tokens.mjs`, typecheck, lint, test, build and the fixture, and open the PR.

Placeholders to fill: `{{CLIENT_NAME}}`, `{{CLIENT_NAMESPACE}}`, `{{ONE_SENTENCE_BRAND_SUMMARY}}`, `{{NOW_ISO}}`, `{{OWNER}}`, `{{PROFILE}}`, `{{PLATFORM}}`, `{{KIT_VERSION}}`, the brand book's section placeholders, and those in `kit/code/<profile>/wiring/`.

## How Sync uses it

Reads the system's contract (schema and profile first), generates the theme file and installs components as the profile describes, writes the repo guardrails, and moves each component from `validated` to `implemented` once it's in the codebase.

## Not in the kit yet

- **Skills and commands.** `skills/` and `commands/` hold README stubs only.
- **Config validation.** The contract asks for a kit script that validates `.ttt/design-system.json` and the token snapshot against a schema; it isn't written.
- **Other profiles.** Ant Design, MUI or a mobile library each need their own `profiles/<library>.md` and `code/<library>/`; nothing else changes.
