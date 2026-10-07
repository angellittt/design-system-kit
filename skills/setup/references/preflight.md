# Pre-flight — can Setup run here?

design-system-kit 0.3.0

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
| **No design system yet** | `.ttt/design-system.json` must not exist. | If it exists, the repo is set up: use Sync. |
| **PR access** | `gh auth status`, then `gh repo view <owner>/<repo> --json viewerPermission` — `WRITE`, `MAINTAIN` or `ADMIN`. | The person running Setup can push a branch and open a PR. |
| **Owner** | Ask: "You'll own this design system — only your account can update it, and you'll review every publish-back. OK?" | An explicit yes. The design system is created under their account (contract, Ownership). |
| **A ClickUp tracker** | Ask for the project's ClickUp **list** link. | A `https://app.clickup.com/…` list URL. Deviations are logged there (common.md §7). |
| **A Figma destination** | Ask where the library goes: an existing Figma design file (URL), or the team and project to create one in. Check with the Figma MCP `whoami`: the account needs an **editor** (Full or Dev) seat on that team. | A file URL or team/project, plus an editor seat. A view seat is "missing". |

Record each answer — they fill the System section, the repo config and the
report. If a row is missing but the repo has an app, still run the
pre-flight (§2) — it only reads — so the stop reports everything the dev and
the designer need to fix in one message. Then stop: nothing after pre-flight
runs until every row is satisfied.

## 2. Pre-flight — ready, adaptable or blocked

Read the repo against the profile's **Config**, **Dev setup checklist** and
**Pre-flight** sections, and classify each finding:

- **ready** — matches the profile.
- **adaptable** — differs in a way the profile allows; Setup uses the repo's
  value and records it. Examples (shadcn): a different global CSS path
  (`src/app/globals.css`), different aliases, an existing ESLint config to
  add the a11y block to.
- **blocked** — Setup can't proceed. Examples (shadcn): Tailwind v3, no
  `shadcn init`, a different primitive library (Radix instead of Base UI), a
  package in a different major from its tested range, or **substantial
  existing custom UI**.

### Versions

On the profile's tested range: run the kit's validator against the repo's
lockfile without copying anything in yet —

```bash
node <plugin root>/kit/code/<profile>/scripts/ds-validate.mjs --repo . --preflight
```

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
it differs from stock (`code.md` §2 decides what happens to each — never
overwritten if modified).

### Blocked → stop

Stop with a message the person can forward to the dev as-is: each blocker,
what was found (file, version, count), and what the dev needs to do — e.g.
"Tailwind is 3.4.1 (`package-lock.json`). The profile needs Tailwind v4 with
CSS-first config: upgrade before Setup runs." End with the report; nothing
else has been written.

Ready or adaptable → write the findings down (they go in the PR and the
report) and go on to the inputs.
