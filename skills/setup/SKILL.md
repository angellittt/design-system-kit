---
name: setup
description: Set up a TTT design system for a new project — brand inputs to tokens, a code branch, a claude.ai Design System, a designer review, the Figma library, and a PR. Runs in one go, or split between a dev (/ds-setup dev, then /ds-setup finish) and a designer (/ds-setup design). Use when the user wants to set up, create, start or bootstrap a design system for a new client or project, or runs /ds-setup (with or without dev, design or finish) in a repo that has no finished .ttt/design-system.json yet.
---

# Setup — a new client design system

design-system-kit 0.12.0 · schema `ttt-ds/1`

Setup turns a client's brand into the four things every TTT project runs on:

1. **Tokens** — colour ramps, type, radius, motion — generated from the
   brand and checked for contrast.
2. **A code branch** — the profile's stock components, the chosen kit
   extensions, the wiring and a generated token file.
3. **A Design System** on claude.ai — brand book, System, Using in code,
   Changelog, every component's README and preview — owned by the person
   who creates it.
4. **A Figma library** — variables, styles and components — built only after
   the designer approves the design system.

It ends with one PR in the client repo and a report.

## One run, or split between dev and design

| Command | Who | Does |
|---|---|---|
| `/ds-setup` | one person | Everything, in one run: the three phases below back to back, with no handoffs. |
| `/ds-setup dev` | a dev | The repo side: pre-flight, the inputs that are final from day one, the code branch on the kit's default look. Pushes the branch and stops. |
| `/ds-setup design` | the designer | The brand side, on a read-only checkout of that branch: brand inputs, tokens, the design system (they own it), review, Figma. Never writes to the repo. |
| `/ds-setup finish` | a dev | Brings the approved design system onto the branch and opens the PR. Never writes to the design system. |

`references/phases.md` says what each phase does, what it hands to the next,
and how a phase knows where Setup stands. Read it first, whichever command
was run.

## Before anything

1. Find the plugin root: two folders up from this skill's base directory (it
   holds `.claude-plugin/plugin.json`). Every kit file below is read from
   there, by path — never from memory.
2. Read `kit/procedures/common.md` and follow it throughout. Setup applies
   it with three timings of its own:
   - §1 (validate) runs once the code step has written
     `.ttt/design-system.json`, not at the start — there is no config yet.
   - §3 (read twice) starts once the design system exists: read it after
     the review, and again before every later publish.
   - §4 (owner): the person who creates the design system owns it — the
     designer, in a split Setup. Ask them to confirm (`preflight.md` §1).
3. Read the rules Setup applies: `kit/contract.md`,
   `kit/profiles/<profile>.md` (Setup asks which profile in step 1; today
   `shadcn` is the only one) and `kit/README.md`.
4. Read Sync's `skills/sync/references/figma.md`: the Figma step reuses its
   Tokens part (§0–§2, §5) and its component rules (§3–§4).

## Steps — in this order, each one a gate

| # | Step | Phase | Reference |
|---|---|---|---|
| 1 | Prerequisites — or stop and say which is missing | each its own | `references/preflight.md` §1 |
| 2 | Pre-flight: ready / adaptable / missing setup / blocked — blocked stops; missing setup is added with a yes | dev | `references/preflight.md` §2 |
| 3 | Ask for every input, a round at a time — decided or provisional; never guess one | dev, design | `references/inputs.md` |
| 4 | Generate tokens; contrast must pass | dev, design | `references/generate.md` Part A |
| 5 | Build the code branch | dev | `references/code.md` |
| 6 | Create the design system | design | `references/generate.md` Part B |
| 7 | Review gate: stop until the designer approves | design | `references/review.md` |
| 8 | Figma library | design | `references/figma-library.md` |
| 9 | Bring the design system onto the branch; PR and report | finish | `references/finish.md`, `references/code.md` §7, `references/report.md` |

## Asking

Ask for answers a round at a time — never every question in one message.
Each round is a few related questions; wait for the answer before the next.
`references/inputs.md` lists the rounds per phase. Pre-flight's findings and
its "add the missing setup?" question are a round of their own, before any
input.

- Start each round with where it stands: "Round 2 of 4 — the client".
- Where the session has a multiple-choice question tool (Claude Code's
  `AskUserQuestion`), use it for questions with two to four fixed answers —
  yes/no gates, radius, motion, status mode — and write the rest as plain
  questions in the same message. Without one, write the options out.
- "Default for the rest" (or "provisional for the rest") answers every
  input left in the phase that can be provisional with *provisional ·
  default*. It never answers a lock-now input, a prerequisite or a gate.

## Never

- Go past a **blocked** pre-flight or a **failed contrast check**.
- **Guess an input** — a missing answer is a question, not a default.
  "Provisional · default" is an answer the person gives; it is never assumed.
- Generate **Figma before the designer approves** the design system.
- **Overwrite a modified stock file**, or **upgrade or downgrade an existing
  package**.
- Write to the **repo in the design phase**, or to the **design system in
  the finish** (`references/phases.md`).
- Write to a **`tttstudios`** repository.

A stopped run still ends with the report (`references/report.md`), saying
where it stopped and why. Stop and report — don't improvise — whenever a step
says stop.
