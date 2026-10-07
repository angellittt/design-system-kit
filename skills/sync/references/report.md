# Report — how every Sync run ends

design-system-kit 0.2.0

The skill writes the report itself (common.md §10). It goes in the chat and,
when there is a PR, as the PR body. A run that stopped still reports: say
where and why under Gaps, and "none" for what didn't happen.

It ends with exactly these headings, in this order. Write "none" under any
that are empty — never drop a heading.

```markdown
## What changed
## Values changed (old → new)
## Deviations logged
## Visible preview differences
## Gaps
```

## What goes under each

**What changed**
- pull: the snapshot, the token file, assets, `lastSynced`; the branch and PR;
  the result of `ds:validate`, `ds:contrast` (pairs × themes, failing,
  intentional), typecheck, tests, build.
- publish: every design-system path sent (and what was regenerated but
  byte-identical, so not sent); statuses changed; previews written; the
  preview check (count × themes, errors); the design-system version
  published; Figma changes and their read-back.

**Values changed (old → new)**
- Every token value per theme, every status (`validated → implemented`),
  every version (kit, profile, React), every setting, every Figma binding —
  as `old → new`. Usage-text-only changes are listed as such, not as values.

**Deviations logged**
- Each ClickUp task: what, where, and its link. "none" if none.

**Visible preview differences**
- What a designer would see change: from the preview check's computed-style
  comparison, plus redrawn icons and new previews. "none" if the comparison
  found none.

**Gaps**
- Every warning from `ds:validate`; every version mismatch from common.md §2;
  every decision the contract or profile didn't cover; every manual step left
  — always including "publish the Figma library" after a Figma change, and
  "flip Code pending to ✓ when the PR merges" while the PR is open.
