---
name: upgrade
description: Upgrade a repo's TTT design system to the installed kit version — reconcile every kit file the repo carries (keeping the client's customizations, merging where they don't overlap, flagging conflicts for a dev), offer the components the kit has that the repo doesn't, apply the changelog's upgrade steps, and open the upgrade PR. Also adds kit components to a repo already on the kit's version. Use when the user wants to upgrade, update or catch up a client repo to a newer design-system-kit, when Sync warns the repo is behind the kit, when the user wants to add a kit component (Toggle, DataTable…) the repo doesn't have yet, or runs /ds-upgrade in a repo that has .ttt/design-system.json.
---

# Upgrade — catch a repo up to the kit

design-system-kit 0.10.2 · schema `ttt-ds/1`

The kit's tools and skills reach a repo when the plugin updates; the files the
repo **carries** — components, `ds-validate.mjs`, the theme provider — don't.
Upgrade brings them to the installed kit version as one PR, never as a side
effect of Sync (common.md §2), and never overwrites what the client changed:
each file is reconciled against the kit file it started from.

## Before anything

1. Find the plugin root: two folders up from this skill's base directory (it
   holds `.claude-plugin/plugin.json`). Every kit file below is read from
   there, by path.
2. Read and follow `kit/procedures/common.md`. It applies to every step here,
   with one change to §2: a repo **older** than the plugin is this skill's
   job, not a warning.
3. Read `kit/contract.md` and `kit/profiles/<profile>.md` (the profile named
   in `.ttt/design-system.json`).
4. Work in the repo the user is in. It must have `.ttt/design-system.json`;
   if it doesn't, it hasn't been set up — say so and stop (that's Setup).

## Then

`references/upgrade.md`, then `references/report.md`.

Stop and report — don't improvise — whenever a step says stop. A stopped run
still ends with the report, saying where it stopped and why.
