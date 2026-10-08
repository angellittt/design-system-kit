# Common procedure — every design-system skill

design-system-kit 0.4.1 · schema `ttt-ds/1`

Setup, Sync, Components and Drift audit all follow these rules. Each one was
learned from a run that went wrong without it; none is optional. The rules
themselves live in the kit (`kit/contract.md`, `kit/profiles/<profile>.md`);
this file is how a skill applies them.

**Paths.** "Plugin root" is the folder holding `.claude-plugin/plugin.json`.
A skill finds it from its own base directory (two levels up from
`skills/<skill>/`). Kit files are read there, by path — never copied into the
session or pasted from memory. The plugin root is outside the repo (in
Claude Code's plugin cache), so reading it can ask for permission; if the
session can't read it, stop and ask the user to allow reading the plugin
folder — never run a step from memory instead. "The repo" is the client project the skill
runs in; "the design system" is the claude.ai Design System artifact linked
from the repo config.

**The app and its package manager.** In a monorepo, "the repo" in every kit
file means the **app's folder** — the workspace package that holds
`components.json` and `.ttt/` (e.g. `apps/web`): kit commands run there, and
git commands (branch, commit, PR) run at the git root. Commands are written
for npm (`npm run ds:validate`, `npm install x@1.2.3`); run them with the
repo's own package manager instead — the one whose lockfile is at the
workspace root: `pnpm run ds:validate` / `pnpm add x@1.2.3`, `yarn
ds:validate` / `yarn add x@1.2.3`. The profile's `framework` (repo config;
absent means `next`) decides the few framework-specific steps.

---

## 1. Validate first

Read the live System section (`project/01-system.md`) into a scratch file
first — §2 needs it too — and run, in the repo:

```bash
npm run ds:validate -- --system <scratch>/01-system.md
```

`--system` lets validation check that every client-added ramp is listed in
the System section's client-specific choices (contract, Token tiers).
Without it (CI, a quick local run) that check is skipped and printed as a
`note`. If the design system can't be read at all, validate without
`--system` anyway — a config error is still a stop — and report the
unreadable link under Gaps.

On any error, **stop**: report each error with the fix it names. Don't work
around a failing config — a skill that runs on an invalid config writes
invalid output. Warnings don't stop the run, but each one goes in the report's
Gaps.

## 2. Check versions — never mix them silently

Compare three things:

| What | Where |
|---|---|
| The installed kit | `<plugin root>/.claude-plugin/plugin.json` → `version`, and `<plugin root>/kit/profiles/<profile>.md` → its `**Profile**` line |
| The repo | `.ttt/design-system.json` → `kitVersion`, `schema`, `profile`; the version stamped in the first lines of each `scripts/ds-*.mjs` |
| The design system | its System section (`project/01-system.md`) → the Versions row |

- `schema` or `profile` name different from the kit's → **stop**. That needs a migration, not a sync.
- Kit versions differ (repo older than the plugin, scripts stamped with different versions, or the System section behind) → **warn** in the first message and in the report, and say which files are behind. Don't quietly run newer rules over older files, and don't copy newer kit files in as a side effect — catching a repo up to a kit version is its own change, with its own PR.
- The repo newer than the installed plugin → **stop**: install the matching plugin version first.

## 3. Read the live design system — twice

- **Before working**: read the design system's index (`project/design-system.json`) and every file you will change, from the live artifact. Note `lastChange` (`by`, `at`, `note`).
- **Immediately before publishing**: read the index again. If `lastChange` moved since your first read, someone else published: re-read the files you're about to send, merge their change into yours, and only then publish. Never publish over a newer version, and never treat a local copy as proof that nothing changed.
- A read returns the artifact's version id as well. A changed version id with an unchanged `lastChange` is your own earlier publish in this session — not someone else's.

How a Design System artifact is written (the type's own instructions come back with every read; these are the parts that have bitten):

- Content lives under `project/`. Publish with the Artifact tool: `url` = the system, `root` = a local folder holding `project/…` copies of only the files you changed, `file_path` = one of them, `files` = the rest, keyed by their `project/…` path.
- The index (`project/design-system.json`) goes **last**, in the final call, re-read right before. Keep every key you didn't mean to change; set `lastChange` (`by` = the owner, `at` = system clock, `via` = "Claude Code", `note` = one line).
- A file whose extension isn't a served type needs an explicit content type: `components/index.d.ts` goes as `{"from": "…", "contentType": "text/plain"}`.
- Don't write the generated files the page owns (`tokens.css`, `api/…`, `manifest.json`).
- After publishing, read back what you sent and compare (`cmp`, or the file text) — that, not the publish result, is proof it landed.

## 4. Publish only as the owner

The System section names the owner; the artifact read says whether this
session can write ("owned by you" / "writer"). Publish only when the session
is the owner's. If it isn't — read-only, or someone else's account — **stop**
and say who the owner is, so they can run the skill or review the diff
themselves. The contract's ownership table: only the owner's account updates
the design system, and the owner reviews every publish-back diff.

## 5. Timestamps come from the system clock

`lastChange.at`, `lastSynced`, changelog dates and the report's times are
taken with `date -u +%Y-%m-%dT%H:%M:%SZ` at the moment of writing. Never
estimate, never reuse a time from earlier in the run.

## 6. Changelog

The design system's `project/03-changelog.md`, newest first. Each entry is
exactly two lines:

```
**Oct 7** · <what changed>[ — <short reason, only when it isn't self-explanatory>] · <owner: design | code | dev | design + dev> · [PR](<link>) or [task](<link>)
Code ✓ · Figma pending
```

- The second line marks every sync target `✓`, `pending` or `—`. **Code ✓ only once the PR is merged**; until then `pending`. **Figma ✓ only after reading back what changed in Figma** (see Sync's `figma.md`).
- The reason is a clause, not a paragraph; the reasoning lives in the linked PR or task.
- Keep the latest 10. Before dropping the oldest, check that `archived/` already holds its full text (`project/archived/changelog-to-<date>.md`); if not, add it there in the same publish.
- When a later run completes an earlier entry's pending target, flip that entry's mark rather than adding a new entry.

### Pending entries flip themselves

Every Sync run — pull or publish — starts, after §1–§5, by checking the
changelog for `pending` marks it can **verify**, and flips only those.
**A mark flips because the result matches the entry, never because
something happened.** A merged PR is not enough; a read-back that ran is not
enough. Compare what's in `main` or in Figma now with what the entry says
now (design may have edited the entry, or the token, since):

| Mark | Flip to ✓ only when |
|---|---|
| `Code pending` | The entry's linked PR is **merged** (`gh pr view <n> --json state,mergedAt`) **and** `main` holds what the entry describes now. For a design entry with no PR link, find the pull PR that carried it (its branch `ds-sync/pull-*`, merged after the entry) and check that `main`'s token snapshot matches the live `project/tokens.json` for every token the entry names. |
| `Figma pending` | A read-back of the change in Figma (`figma.md` §5) — this run's, or an earlier run's recorded in its report — shows every variable or binding the entry names as the design system has it now: for a variable, its value or alias per mode, scopes, code syntax and description all match (`figma.md` §1). |

- **Not verified, not flipped.** An open PR, a PR that merged an older value
  (design changed the entry again after the pull), a read-back that doesn't
  match, or no connector — leave it `pending` and say why in Gaps.
  Example: a pull PR merged `chart-5` dark = `data-50`; design then changed
  it to `data-60`. The PR is merged, but `main` doesn't hold what the entry
  says, so Code stays `pending` until the next pull merges.
- Flips are published like any changelog edit (§3 re-read, §4 owner,
  §5 clock, index last), together with the run's other changes or alone
  if the run publishes nothing else.
- The report lists every flip under **What changed** — the entry, the mark,
  and the evidence (PR number and merge time; the read-back) — and every
  mark checked but left `pending` under **Gaps**.

## 7. Deviations

Anything that conflicts with an agreed intent — a contrast failure, a
component that misses its agreed styling, a token code can't honour — is a
**deviation**, logged as a task in the ClickUp list in the repo config
(`tracker`), never fixed by quietly changing the other side.

- Code never changes a design-owned value (a token, a brand asset) to make a check pass.
- The design system mirrors only **open** deviations, as links, in the System section's "Open deviations" line (`project/01-system.md`).
- Every deviation logged in a run is listed in the report.

## 8. Files

- Deleting or renaming a file — in the repo or in the design system — happens only in Claude Code (a Cowork or chat session can add and replace, not remove). A rename is "add new, then remove old", in that order, in one run.
- In a shell, remove only by literal absolute path. Never `cd` and then remove a relative glob.

## 9. Repos

- Never write to a `tttstudios` repository — no branch, commit, push, PR or comment. Read only, and only if the user asked.
- Work on a branch, never directly on `main`; end with a PR. Commit messages and PR bodies end with the attribution the session specifies.
- Don't change a package under a running dev server you didn't start (its cache keeps the old files and every page starts failing). Build with `npm run build:safe` (`.next-build`) while a dev server runs.

## 10. The report

Every run ends with a report the skill writes itself, posted in the chat and as
the PR body (or, with no PR, in the chat alone). It ends with exactly these
headings, in this order, with "none" under any that are empty:

```
## What changed
## Values changed (old → new)
## Deviations logged
## Visible preview differences
## Gaps
```

- **What changed** — files and design-system paths touched, checks run and their results.
- **Values changed (old → new)** — every token value, status, version and setting that changed, as `old → new`.
- **Deviations logged** — each ClickUp task, with its link.
- **Visible preview differences** — what a designer would see change in a preview, or "none".
- **Gaps** — anything the contract or profile didn't say and the run had to decide, every warning from validation, and every manual step left (e.g. publishing the Figma library).
