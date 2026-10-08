# Pre-flight — can Setup run here?

design-system-kit 0.10.2

Two checks before Setup asks for a single input. Both are cheap, and both stop
the run if they fail: everything after them writes things (a branch, a design
system, a Figma library) that are expensive to undo.

## 1. Prerequisites — all of them, or stop

Ask, or check, each of these. If any is missing, **stop**: list every missing
one (not only the first) with what would satisfy it, and end with the report.

| Prerequisite | How to check | What satisfies it |
|---|---|---|
| **A profile** | Ask which UI library the project uses; it must have a file in `kit/profiles/`. Today: `shadcn`. | A profile file exists for it. Another library needs a new profile first — that's kit work, not Setup. |
| **An app set up per the profile's dev checklist** | Read the profile's "Dev setup checklist" and check the repo against it: framework, `components.json`, the `init` command's values, ESLint. | The repo has the app, on a git branch you can push from (`git remote -v`; not a `tttstudios` remote). |
| **The app** | In a monorepo (a `pnpm-workspace.yaml`, or `workspaces` in the root `package.json`), ask which workspace package is the app, e.g. `apps/web`. Otherwise the repo root is the app. | One folder with the app's `package.json`. Everything below is checked **in that folder**; git commands run at the git root. |
| **Package manager** | The lockfile at the workspace root: `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (Yarn). | One of them. Yarn Plug'n'Play (`.pnp.cjs`) is "missing": the kit's scripts read `node_modules`. Use this manager for every command (common.md). |
| **No design system yet** | `.ttt/design-system.json` must not exist in the app's folder. | If it exists, the app is set up: use Sync. |
| **PR access** | `gh auth status`, then `gh repo view <owner>/<repo> --json viewerPermission` — `WRITE`, `MAINTAIN` or `ADMIN`. | The person running Setup can push a branch and open a PR. |
| **Owner** | Ask: "You'll own this design system — only your account can update it, and you'll review every publish-back. OK?" | An explicit yes. The design system is created under their account (contract, Ownership). |
| **A ClickUp tracker** | Ask for the project's ClickUp **list** link. | A `https://app.clickup.com/…` list URL. Deviations are logged there (common.md §7). |
| **A Figma destination** | Ask where the library goes: an existing Figma design file (URL), or the team and project to create one in. Check with the Figma MCP `whoami`: the account needs an **editor** (Full or Dev) seat on that team. | A file URL or team/project, plus an editor seat. A view seat is "missing". |

Record each answer — they fill the System section, the repo config and the
report. If a row is missing but the repo has an app, still run the
pre-flight (§2) — it only reads — so the stop reports everything the dev and
the designer need to fix in one message. Then stop: nothing after pre-flight
runs until every row is satisfied.

## 2. Pre-flight — ready, adaptable, missing setup or blocked

Read the repo against the profile's **Config**, **Dev setup checklist** and
**Pre-flight** sections, and classify each finding:

- **ready** — matches the profile.
- **adaptable** — differs in a way the profile allows; Setup uses the repo's
  value and records it. Examples (shadcn): a different global CSS path
  (`src/app/globals.css`), different aliases, an existing ESLint config to
  add the a11y block to.
- **missing setup** — a piece of the dev checklist that is simply **absent**,
  so adding it changes nothing that exists. Setup adds these itself, on its
  branch, once the person agrees (below; `code.md` §2). Exactly three:
  - **Tailwind v4** — no `tailwindcss` installed at all, and no
    `tailwind.config.*`;
  - **the `@/*` alias in `tsconfig.json`** — missing there (on Vite it is
    often only in `tsconfig.app.json`; the shadcn CLI and the kit's scripts
    read `tsconfig.json`);
  - **`shadcn init`** — no `components.json`.
- **blocked** — Setup can't proceed. Examples (shadcn): no framework the
  profile supports (the app's `package.json` must depend on exactly one of
  `next` or `vite`), **Tailwind v3** or any `tailwind.config.*` (an upgrade,
  not an addition), a `components.json` with another style or primitive
  library (Radix instead of Base UI), a package in a different major from its
  tested range for that framework, or **substantial existing custom UI**.
  Anything that would change something already there is blocked, never
  missing setup.

**Framework.** Read it from the app's `package.json` and say which; the
tested range, the dev checklist and the wiring are that framework's
(profile, Stack). Record it — the code step writes it to the config.

### Versions

On the profile's tested range: run the kit's validator against the app's
installed packages without copying anything in yet, from the app's folder —

```bash
node $KIT/ds-validate.mjs --repo . --preflight
```

It picks the framework's range from the app's `package.json`, and reads
versions for any package manager, including tools installed at a monorepo's
root (profile, Stack).

It will also report that `.ttt/design-system.json` doesn't exist — expected
before Setup; ignore that one error. Every `package …` error is a finding:

- a different **major** than the tested range → **blocked**;
- the same major, outside the range → **flag for the dev** (adaptable): they
  either move it into range or run an acceptance run that widens it. Setup
  never moves it.
- a required package that isn't installed → not a finding; the code step
  adds it at its tested max.

### Existing UI — the scope rule

The kit is for greenfield projects (contract, Scope). Count what's already
built outside the component folder: custom components (`.tsx` files under the
source root that render markup and aren't pages, layouts or the profile's
component folder), and hand-written styling (`className` strings with
arbitrary values or default palette colours, CSS modules, styled
components).

- None, or a scaffold (a landing page, a demo page) → ready.
- A few screens built on stock components with default styling → adaptable;
  list them in the report: they'll need restyling against the tokens.
- **Screens with their own components or a visual style of their own** →
  **blocked**. Migrating an existing UI is scoped as its own work.

Also list every stock component already in the component folder, and whether
it differs from stock (`code.md` §3 decides what happens to each — never
overwritten if modified).

### Blocked → stop

Stop with a message the person can forward to the dev as-is: each blocker,
what was found (file, version, count), and what the dev needs to do — e.g.
"Tailwind is 3.4.1 (`package-lock.json`). The profile needs Tailwind v4 with
CSS-first config: upgrade before Setup runs." End with the report; nothing
else has been written.

### Missing setup → ask once

If there is no blocker but some setup is missing, list exactly what Setup
would add — the packages with versions, the files it would edit and how —
and ask **once**, e.g.:

> `apps/web` doesn't have Tailwind v4 or shadcn yet. Setup can add them on
> its branch: `tailwindcss@4.3.3` and `@tailwindcss/vite@4.3.3` (the plugin in
> `vite.config.ts`, `@import "tailwindcss"` at the top of
> `src/config/global.css`), the `@/*` alias in `tsconfig.json`, then
> `shadcn@4.21.1 init --preset nova --base base`. A dev reviews all of it in
> the PR. Add them?

- **Yes** → record it; the code step does them first (`code.md` §2). Don't
  install anything yet — the branch doesn't exist until then.
- **No** → stop, with the same list written as a message for the dev (as for
  a blocker). Never add them without that yes.

Ready, adaptable or agreed missing setup → write the findings down (they go
in the PR and the report) and go on to the inputs.
