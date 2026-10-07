# TTT design system kit · ttt-ds/1

The starting point for every client design system, bundled into TTT's four skills: **Setup** (design system + Figma + code branch, ending in a PR), **Sync** (pull → PR, publish-back), **Components** (check → propose → accept) and **Drift audit**. Extracted from Jelly, the worked example.

**Scope:** greenfield projects — the app is set up by devs but has little or no custom UI. Setup's pre-flight stops on projects with substantial existing UI.

## What's here

| Path | What it is | Who changes it |
|---|---|---|
| `contract.md` | The universal rules every system follows (read by the skills from the installed kit; never copied into a design system) | TTT, by bumping the schema version |
| `profiles/shadcn.md` | Part 2 for shadcn projects: stack, config, token mapping, kit extensions, inventory, Figma | TTT; a new library means a new profile file |
| `template/` | A brand-neutral design system in the Design System type's file format | Never edited per client; Skill 1 copies it |

`template/` holds `design-system.json` (the index), `README.md` (the brand book skeleton), `03-changelog.md` (with the entry format every skill writes), `tokens.json` (role-named ramps with placeholder values, the full semantic set, spacing, radius, shadows, type scale) and `components/<Comp>/README.md` for the 19 baseline components, each ending in a contract block with status `validated`.

## How Setup uses it

1. Copy `template/` into the new system's `project/` folder.
2. Write `project/01-system.md` from `template/01-system.md` (versions, owner, links, client settings) — a one-screen summary; the rules stay in the kit. Write `project/02-using-in-code.md` from `template/02-using-in-code.md` with the profile's token mapping as this client applies it.
3. Replace placeholder values: brand colours into the role ramps (generating each ramp from the brand hex), neutrals, type families and font files, radius if the brand is sharper or softer.
4. Fill every `{{…}}` in the brand book from the client's brand guidelines; keep "TTT default" passages unless the guidelines override them.
5. Check every contrast requirement in the semantic tokens' usage text, in Light and Dark. Adjust `on-*`, `*-text` and status steps until all pass.
6. Drop any kit extensions the client doesn't need (remove them from the component README and the profile's kit table copy).
7. Stop for the designer's review in Claude. Only after approval: generate the Figma library.

Placeholders to fill: `{{CLIENT_NAME}}`, `{{CLIENT_NAMESPACE}}`, `{{ONE_SENTENCE_BRAND_SUMMARY}}`, `{{NOW_ISO}}`, `{{OWNER}}`, `{{PROFILE}}`, `{{PLATFORM}}`, and the brand book's section placeholders.

## How Sync uses it

Reads the system's contract (schema and profile first), generates the theme file and installs components as the profile describes, writes the repo guardrails, and moves each component from `validated` to `implemented` once it's in the codebase.

## Not in the template yet

- **`code/<profile>/` folder.** Vendored stock components, kit extension files with harness tests (first two: Date Picker typed input, dismissible Alert), the token generator, the preview build and framework stand-ins. Previews for pure-stock components are built from here until a client repo exists.
- **Other profiles.** Ant Design, MUI or a mobile library each need their own `profiles/<library>.md`; nothing else changes.
