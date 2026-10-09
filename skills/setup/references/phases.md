# Phases — one run, or dev, design and finish

design-system-kit 0.12.0

Setup has three phases. One person can run them back to back (`/ds-setup`),
or a dev and a designer can each run their own: the dev builds the repo side
on the kit's default look, the designer brings the brand and owns the design
system, and the dev brings the approved result onto the branch. Each phase
only writes to what its owner owns (contract, Ownership): the dev phase and
the finish write to the repo, the design phase writes to the design system
and Figma.

| Phase | Steps | Writes to | Ends with |
|---|---|---|---|
| **dev** | prerequisites (dev), pre-flight, dev inputs, tokens on defaults, code branch | the repo: the Setup branch, pushed | a handoff for the designer |
| **design** | prerequisites (design), design inputs, tokens, design system, review, Figma | the design system and Figma — never the repo | a handoff for the dev |
| **finish** | the design system onto the branch, checks, PR | the repo — never the design system | the PR and the report |

## Where Setup stands

Each phase reads it from the repo before anything else, in the app's folder,
on the branch the person has checked out:

| The repo has | Setup is | Runs |
|---|---|---|
| No `.ttt/design-system.json` | not started | `/ds-setup` or `/ds-setup dev`. `design` or `finish` → stop: "Setup hasn't started here — a dev runs `/ds-setup dev` first." |
| `.ttt/design-system.json` with `"setup": "awaiting-design"`, and `.ttt/setup.json` | waiting on design | `/ds-setup design` (the designer), then `/ds-setup finish` (a dev). `/ds-setup` alone → ask which of the two this person is doing. `dev` → stop: the dev phase is done. |
| `.ttt/design-system.json` without `setup` | finished | Nothing — stop with the command's "already has a design system" message. |

On `main` (or any branch without these files) while a Setup branch exists
(`git ls-remote --heads origin 'ds-setup/*'`), say so: the design phase and
the finish run on that branch, so check it out first.

## The dev phase

1. **Prerequisites** — the dev's rows of `preflight.md` §1.
2. **Pre-flight** — `preflight.md` §2, its findings and the missing-setup
   question as their own round.
3. **Inputs** — the dev's rounds (`inputs.md`, "Rounds"): the lock-now
   inputs. Every input design owns is recorded as *provisional · default* —
   not asked, and not a guess: the design phase asks for every one of them.
4. **Tokens** — `generate.md` Part A, from those inputs: the kit's default
   look under the client's name, status mode and settings.
5. **Code branch** — `code.md` §1–§6, with `"setup": "awaiting-design"` in
   the config and no `designSystem` key (`ds-validate` accepts that pair, so
   the branch's checks pass). Write `.ttt/setup.json` (below) and commit it
   with the branch.
6. **Push the branch.** No PR yet: the finish opens it.
7. **Report** (`report.md`), ending with the handoff for the designer:
   - the branch (`ds-setup/<date>`) and the repo;
   - what the designer needs: read access to the repo; a checkout of the
     branch with its packages installed (`pnpm install`, or the repo's
     manager — it writes only `node_modules`); Claude Code with the
     design-system-kit plugin; the Figma connector authorized, and an editor
     seat on the destination;
   - the command: `/ds-setup design`, in the app's folder on that branch;
   - the inputs already decided (client, namespace, settings, status mode,
     extensions) — the designer sees them, but can't change them.

### `.ttt/setup.json` — what the dev phase hands on

Committed on the Setup branch; the finish removes it.

```json
{
  "branch": "ds-setup/2026-10-09",
  "inputs": { "…": "inputs.json as the dev phase saved it (inputs.md)" },
  "pr": {
    "devSetup": ["Tailwind v4: tailwindcss@4.3.3, @tailwindcss/vite@4.3.3 — vite.config.ts, src/config/global.css", "…"],
    "packages": ["sonner@2.0.8 — Toast", "…"],
    "stockLeft": [],
    "adaptable": ["global CSS at src/config/global.css"],
    "flagged": ["vite 7.3.6 — tested range 7.3.1"]
  }
}
```

`pr` holds `code.md` §7's lists and the pre-flight findings flagged for the
dev, so the finish can write the PR body without re-deriving them.

## The design phase

Runs on a checkout of the Setup branch and **never writes to it**: no edit,
no commit, no push. Everything it generates goes in its scratch folder
(`<out>`); the kit's tools read the repo's components and write to `<out>`
(`--tokens`, `--css`). Before starting, note `git status --porcelain`; at the
end it must be the same — if it isn't, say which files changed and restore
nothing yourself.

1. **Prerequisites** — the designer's rows of `preflight.md` §1, and the
   checkout itself: on the Setup branch, up to date with the remote, packages
   installed, `.ttt/setup.json` present.
2. **Inputs** — the designer's rounds (`inputs.md`, "Rounds"). The lock-now
   inputs come from `.ttt/setup.json` → `inputs`: show them in the first
   round as already decided; they are a dev change, not a design answer.
   Merge the designer's answers over them into `<out>/inputs.json`.
3. **Tokens** — `generate.md` Part A from that file. Then the token file, into
   `<out>`, never the repo's:

   ```bash
   node $KIT/ds-tokens.mjs <out>/tokens.json --css <out>/ds-tokens.css
   ```

4. **Design system** — `generate.md` Part B, with every tool pointed at
   `<out>` (Part B says how) — the designer owns it. §5's repo writes wait
   for the finish.
5. **Review** — `review.md`. After approval, §3's repo-side work (the token
   snapshot, the System snapshot, `locale.ts`) waits for the finish; rebuild
   only what the design system gets from the tokens, from `<out>`.
6. **Figma** — `figma-library.md`.
7. **Report** (`report.md`), ending with the handoff for the dev:
   - **share the design system with the dev** (view access is enough — the
     finish only reads it), from its Share menu on claude.ai;
   - its link;
   - the command: `/ds-setup finish`, on the Setup branch;
   - anything the review changed that code has to follow (client settings,
     a font family with files).

## The finish

1. **Prerequisites** — on the Setup branch, up to date; the config says
   `awaiting-design`; the design system's link (ask for it); the session can
   read it. A design system with placeholders left (`{{`), no Setup changelog
   entry, or an owner who isn't the designer who ran the design phase → stop
   and say so: the design phase hasn't finished.
2. **The rest** — `finish.md`.

## One run

`/ds-setup` with nothing started runs the three phases in one session, in
order, without handoffs, writing directly where the phases write:

- Prerequisites are asked once — every row of `preflight.md` §1 — before
  pre-flight.
- The inputs are the dev's rounds, then the designer's, then the one summary
  — and the tokens are generated **once**, from all of them: the code branch
  is built on the real tokens, not the defaults. `.ttt/setup.json` isn't
  written; the config still carries `"setup": "awaiting-design"` until the
  finish removes it.
- Part B runs in the repo as written, without `--tokens` or `--css`, and
  review §3's repo-side rows are done at review, as written.
- The finish then has nothing to bring in except what changed in claude.ai
  after approval; `finish.md` covers both.
