# Pull — design → code

design-system-kit 0.2.0

Brings the design system's design-owned values into the repo: the token
snapshot, the generated token file and assets. One PR, or none if nothing
changed. Code never changes a token here.

`kit/procedures/common.md` §1–§5 have already run: the config validates,
versions are checked, and you've read the live design system's index.

## 1. Read what design changed

1. Read from the live design system: `project/design-system.json`,
   `project/tokens.json`, `project/03-changelog.md`, and any asset record or
   file under `project/assets/` and `project/fonts/`.
2. From the changelog, list the entries newer than the repo's `lastSynced`
   (`.ttt/design-system.json`).

## 2. Design-owned only — or stop

Pull carries **design-owned** things only: tokens, brand assets and fonts.
Classify every change since `lastSynced`:

| Change | Pull? |
|---|---|
| A token added, removed, renamed, or its value changed | yes |
| A logo, icon or font file added or replaced | yes |
| A token's usage text only (including its "Used by" list) | no code change — usage text isn't in generated code |
| A component README, preview, styling map, status, or `index.d.ts` | **stop** |
| A new component, part, variant or behaviour described anywhere | **stop** |

**Stop** on anything in the last two rows: components are code-owned, so a
design-side change to one is a component proposal (the Components skill), not
a sync. Report what you found and which entries; pull nothing.

A token **rename or removal** that the generated code still references is
also a stop: say which components use it (`ds-styling-maps --all`), because
code has to move first.

## 3. Snapshot and regenerate

On a new branch from an up-to-date `main` (`ds-sync/pull-<YYYY-MM-DD>`):

1. Write the design system's `project/tokens.json` to the repo's `tokensIn`
   (default `.ttt/tokens.json`) **byte for byte** — this snapshot is the only
   thing that ever writes it.
2. Regenerate the token file:

   ```bash
   node scripts/ds-tokens.mjs
   ```

3. Copy changed assets to where the repo keeps them (fonts: the folder the
   framework's font loader reads; logos and icons: where the repo already
   has them). If the repo has no place for a new kind of asset, list it in
   Gaps rather than inventing one.

## 4. Did any value actually change?

The generated token file is the resolved mapping, so its diff is the
resolved-value diff:

```bash
git diff --stat -- <tokensOut> <asset paths>
git diff -U0 -- <tokensOut> | grep '^[-+]' | grep -v '^[-+][-+]' | grep -v 'Snapshot synced'
```

- Only the header line ("Snapshot synced: …") changed, and no asset changed →
  **nothing changed**. Say so, discard the branch, open no PR. (A snapshot
  whose only differences are usage text lands here — that's expected.)
- Anything else → those lines are the "Values changed" for the report: name
  each token and its old → new value per theme.

## 5. Check contrast

```bash
npm run ds:contrast
```

- Passing, or misses listed under `contrast.intentional` with a reason → go on.
- **Any other miss is a deviation for design**: log a ClickUp task in the
  tracker (pair, both ratios per theme, the minimum), add its link to the
  report — and still open the PR. **Never change a token in code** to make a
  pair pass; tokens are design-owned.

## 6. Validate, test, build

```bash
npm run ds:validate
npm run typecheck
npm test
npm run build:safe      # or npm run build when no dev server is running
```

A token change regenerates the token file and **no component file**. If a
component file changed, or the build fails, stop and report — that's a
mapping problem (profile), not a pull.

## 7. lastSynced, branch, PR

1. Set `.ttt/design-system.json` → `lastSynced` to the system clock
   (`date -u +%Y-%m-%dT%H:%M:%SZ`).
2. Commit the snapshot, token file, assets and `lastSynced` — nothing else.
3. Push and open a PR whose body is the report (`report.md`).
4. In the design system, the changelog entries this pull carries keep
   "Code pending" until the PR merges; flip them to ✓ then (common.md §6).
   Pull itself publishes nothing else to the design system.
