---
name: sync
description: Sync a TTT design system with code or Figma. Use when the user wants to pull design-system tokens into a repo and the Figma library's variables (design → code and Figma), publish components back from code to the design system (code → design), sync or update the Figma library from the design system, restyle a design system with new brand inputs (replace provisional colours, fonts, radius, motion, voice once the style is chosen, or revise a decided one), or runs /ds-sync pull, /ds-sync publish or /ds-sync restyle in a repo that has .ttt/design-system.json.
---

# Sync — design system ⇄ code ⇄ Figma

design-system-kit 0.12.0 · schema `ttt-ds/1`

Two directions, one skill — and restyle, which starts on the design side:

- **pull** — design → code and Figma. The design system's tokens and assets
  come down into the repo as a PR, the design system's preview bundle is
  rebuilt with them, and token changes go to the Figma library's
  variables. Nothing code-owned changes; Figma never blocks the PR.
- **publish** — code → design system → Figma. The repo's components go up:
  bundle, previews, styling maps, types, "Used by" lists, "Using in code",
  statuses, then the Figma library.
- **restyle** — new values for Setup's brand inputs (usually the ones the
  System section lists as provisional): regenerated as Setup generates them,
  approved by the designer, published to the design system, then pulled.
  Values only — never structure.

## Before anything

1. Find the plugin root: two folders up from this skill's base directory (it
   holds `.claude-plugin/plugin.json`). Every kit file below is read from
   there, by path.
2. Read and follow `kit/procedures/common.md` — validate, check versions,
   read the live design system, ownership, timestamps, changelog, deviations,
   files, repos, report. It applies to every step here.
3. Read the rules the steps apply: `kit/contract.md` and
   `kit/profiles/<profile>.md` (the profile named in `.ttt/design-system.json`).
4. Work in the repo the user is in. It must have `.ttt/design-system.json`;
   if it doesn't, it hasn't been set up — say so and stop (that's Setup).
5. Flip the changelog's `pending` marks this run can verify — merged PRs,
   confirmed Figma read-backs — and only those (common.md §6, "Pending
   entries flip themselves").

## Then

| Mode | Steps |
|---|---|
| `pull` | `references/pull.md` (its step 7 runs `references/figma.md`'s Tokens part), then `references/report.md` |
| `publish` | `references/publish.md` → `references/figma.md` (Tokens, then Components), then `references/report.md` |
| `restyle` | `references/restyle.md` (its step 5 runs `references/pull.md`), then `references/report.md` |

No mode given: ask which, and say what each does in one line.

Stop and report — don't improvise — whenever a step says stop. A stopped run
still ends with the report (`references/report.md`), saying where it stopped
and why.
