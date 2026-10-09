# Finish — the design system onto the branch, then the PR

design-system-kit 0.12.0

Setup's last step (step 9). In a split Setup a dev runs it (`/ds-setup
finish`) after the designer's phase: the branch was built on the kit's
default look, and the approved design system now holds the client's. The
finish brings the design system's design-owned values onto the branch the
way Sync's pull does, opens the PR, and ends Setup. In one run it follows
straight on from the Figma step, and mostly confirms there's nothing left to
bring in.

It **reads** the design system and never writes to it: the designer owns it
(common.md §4). Everything here happens on the Setup branch, in the app's
folder, with the repo's package manager and pinned toolchain (common.md §9).

## 1. Read what you need — before changing anything

1. `.ttt/setup.json` (split only) — its `inputs` and `pr` lists. The PR body
   needs them, and step 6 deletes the file.
2. The live design system, from the link the dev gave you (`phases.md`, "The
   finish"): `project/design-system.json`, `project/tokens.json`,
   `project/01-system.md`, `project/03-changelog.md`, the brand book's type
   section, every file under `project/fonts/` and the `Logos` asset group.
   Save each to `<out>`. Can't read it → stop: ask the designer to share it
   with you (view access is enough).
3. Check it's finished: no `{{` left in any section, Setup's changelog entry
   ("Design system created from TTT kit …") present, the System section's
   owner named. Anything missing → stop: the design phase hasn't finished.

## 2. Connect the config

In `.ttt/design-system.json`: set `designSystem` to the link, and remove
`"setup": "awaiting-design"`. From here `ds-validate` requires the link and
the System snapshot like any connected repo.

Then run common.md §1 and §2 against the live System section in `<out>`:
validate, and compare versions. Errors stop the finish, as they stop Sync.

## 3. Snapshot and regenerate — pull's §3

Follow Sync's `skills/sync/references/pull.md` §3 on this branch (not a new
one):

- `project/tokens.json` → `tokensIn`, and `project/01-system.md` →
  `systemIn`, byte for byte;
- `lastSynced` from the system clock, **before** regenerating;
- `node $KIT/ds-tokens.mjs`;
- logos where the repo keeps them (or Gaps, if it has no place for them).

Then pull's §4 diff is this step's **Values changed**: in a split Setup,
every value the designer's tokens moved from the kit's default — expected,
and listed in full. In one run, normally nothing; anything else changed in
claude.ai after approval, and goes in the report.

## 4. Fonts in code

For each family the design system's tokens name (`type.families`) that the
branch doesn't load yet, wire it as `code.md` §4 "Fonts" says — a package
before files; `next/font`, or Vite's `fonts.css` — with the files from
`project/fonts/` only for a licensed or custom face. A family left `default`
loads nothing. Each package added at the version you checked; an existing one
never changed. One commit.

## 5. Client settings follow the System section

If the System section's **Client settings** line no longer matches the app's
`locale.ts` (`ds-validate` reports it as drift), the review changed it —
design's decision (`review.md` §3): make `locale.ts` follow it, keeping every
export a plain literal. One commit. In one run this was done at review.

## 6. Remove the handoff

Split only: delete `.ttt/setup.json`, by its literal absolute path
(common.md §8). It is in git history if anyone needs it.

## 7. Check the branch

`code.md` §6, every command, plus the repo's own `ds:validate` — which now
reads the System snapshot, so the drift test runs for real. Contrast:

- **Any miss but `label-disable` → stop.** The designer approved tokens that
  passed (`generate.md` §5), so a miss now means the design system changed
  after approval. Report the pair and both ratios for the designer; never
  change a token in code.

A failing check is a stop, reported with the command and its output.

## 8. Commit, push, PR

Commit what's left ("Setup: design system tokens and link"), push, and open
the PR as `code.md` §7 says — its lists from step 1's `pr` in a split Setup.
`git status` must be clean.

The design system's changelog entry keeps `Code pending`: in a split Setup
the finish doesn't publish, so the entry has no PR link, and the next Sync
run finds the PR by its `ds-setup/*` branch once it merges (common.md §6).
In one run, `code.md` §7 step 3 links it.

## 9. Report

`report.md`, as the PR body and in the chat. Under **Gaps**, always: "Code
pending flips to ✓ on the next Sync run after the PR merges", and — if the
System section's Figma row still says pending — "Figma library not built:
the designer re-runs Setup's Figma step".
