# Pull — design → code and Figma

design-system-kit 0.3.0

Brings the design system's design-owned values to their two consumers: the
repo (the token snapshot, the generated token file and assets — one PR, or
none if nothing changed) and the Figma library's variables. Design → code
and design → Figma are one direction, so pull owns both. Code never changes
a token here, and Figma never holds up the code PR.

`kit/procedures/common.md` §1–§6 have already run: the config validates,
versions are checked, you've read the live design system's index, and
pending changelog marks this run can verify are flipped.

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
| A client-added primitive ramp (beyond the standard roles) | yes — `ds:validate` rejects one named by hue and warns if the System section's client-specific choices don't list it (contract, Token tiers) |
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
  **nothing changed** in code. Say so, discard the branch, open no PR — and
  still run step 7, since Figma may be behind. (A snapshot
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
npm run ds:validate -- --system <scratch>/01-system.md   # the live System section
npm run typecheck
npm test
npm run build:safe      # or npm run build when no dev server is running
```

A token change regenerates the token file and **no component file**. If a
component file changed, or the build fails, stop and report — that's a
mapping problem (profile), not a pull. Stop before Figma too: Figma gets
only a snapshot that validates.

## 7. Push the token changes to Figma

Follow `figma.md`'s **Tokens** part (§0, §1, §2, §5) against the design
system's `project/tokens.json` you snapshotted: new variables, changed values
and aliases, removed ones; primitives in Primitives, semantics in Semantic
with Light and Dark, aliased wherever the token aliases.

- Do this even when step 4 found nothing changed in code: Figma can be behind
  on its own (an earlier pull ran without the connector).
- **Connector unavailable, or no editor seat** → say so, skip to step 8, and
  leave every Figma mark this pull carries `pending`. Never block the code
  PR on Figma.
- Read back before any ✓ (`figma.md` §5), then remind the designer to
  **publish the Figma library** — it goes in Gaps.

Figma changes are not in the PR (Figma has no branch); the report says
what changed there.

## 8. lastSynced, branch, PR

1. Set `.ttt/design-system.json` → `lastSynced` to the system clock
   (`date -u +%Y-%m-%dT%H:%M:%SZ`).
2. Commit the snapshot, token file, assets and `lastSynced` — nothing else.
3. Push and open a PR whose body is the report (`report.md`).
4. In the design system, the changelog entries this pull carries keep
   "Code pending" until the PR merges; the next Sync run flips them
   (common.md §6). Their Figma mark becomes ✓ now if step 7 read the change
   back, else stays `pending`. That changelog edit is the only thing pull
   publishes to the design system (owner only, common.md §4; re-read first,
   §3).
