---
name: setup
description: Set up a TTT design system for a new project — brand inputs to tokens, a code branch, a claude.ai Design System, a designer review, the Figma library, and a PR. Use when the user wants to set up, create, start or bootstrap a design system for a new client or project, or runs /ds-setup in a repo that has no .ttt/design-system.json yet.
---

# Setup — a new client design system

design-system-kit 0.4.0 · schema `ttt-ds/1`

Setup turns a client's brand into the four things every TTT project runs on:

1. **Tokens** — colour ramps, type, radius, motion — generated from the
   brand and checked for contrast.
2. **A code branch** — the profile's stock components, the chosen kit
   extensions, the wiring and a generated token file.
3. **A Design System** on claude.ai — brand book, System, Using in code,
   Changelog, every component's README and preview — owned by the person
   running Setup.
4. **A Figma library** — variables, styles and components — built only after
   the designer approves the design system.

It ends with one PR in the client repo and a report.

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
   - §4 (owner): the person running Setup creates the design system, so it is
     theirs. Ask them to confirm they'll own it (`prerequisites`, below).
3. Read the rules Setup applies: `kit/contract.md`,
   `kit/profiles/<profile>.md` (Setup asks which profile in step 1; today
   `shadcn` is the only one) and `kit/README.md`.
4. Read Sync's `skills/sync/references/figma.md`: the Figma step reuses its
   Tokens part (§0–§2, §5) and its component rules (§3–§4).

## Steps — in this order, each one a gate

| # | Step | Reference |
|---|---|---|
| 1 | Prerequisites — or stop and say which is missing | `references/preflight.md` §1 |
| 2 | Pre-flight: ready / adaptable / blocked — blocked stops | `references/preflight.md` §2 |
| 3 | Ask for every input; never guess one | `references/inputs.md` |
| 4 | Generate tokens; contrast must pass | `references/generate.md` Part A |
| 5 | Build the code branch | `references/code.md` |
| 6 | Create the design system | `references/generate.md` Part B |
| 7 | Review gate: stop until the designer approves | `references/review.md` |
| 8 | Figma library | `references/figma-library.md` |
| 9 | PR and report | `references/code.md` §6, `references/report.md` |

## Never

- Go past a **blocked** pre-flight or a **failed contrast check**.
- **Guess an input** — a missing answer is a question, not a default.
- Generate **Figma before the designer approves** the design system.
- **Overwrite a modified stock file**, or **upgrade or downgrade an existing
  package**.
- Write to a **`tttstudios`** repository.

A stopped run still ends with the report (`references/report.md`), saying
where it stopped and why. Stop and report — don't improvise — whenever a step
says stop.
