# Report — how every Upgrade run ends

design-system-kit 0.10.2

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
- The versions: from (every stamped version found) → to.
- The reconcile: the formatter it used, the count per outcome, and the
  plan's table — every file except `stamp`, which is a count.
- **Needs a dev** (its own sub-heading when not empty): every conflict, as
  the conflicted merge and the kit's file, with what the kit changed there;
  every undocumented customization, with its diff against the kit.
- **Components added** (step 5b): each one asked for, what came with it
  (files, a stock file swapped for its kit extension, packages at their
  versions), and the offer's other components, not taken.
- Each changelog step applied in step 6, by version.
- Checks: `ds:validate`, typecheck, lint, tests, build, formatter — results.
- The branch and PR, and whether it's a draft (open conflicts).

**Values changed (old → new)**
- `kitVersion`, and any token, setting or package version a changelog step
  changed, as `old → new`.

**Deviations logged**
- none, unless a changelog step logged one.

**Visible preview differences**
- What the changelog says changes visibly in a component (e.g. "Sidebar
  items 4px apart"), per component — designers see it after
  `/ds-sync publish`. Customized components may differ from the changelog's
  description; say so.

**Gaps**
- Every `unknown`, `removed` and conflicted file; every undocumented
  customization; components offered and not taken, and any that couldn't be
  added (a file they need is customized); every version
  mismatch common.md §2 found; warnings from `ds:validate`; failures that
  were already on `main`; and the manual steps left — always "`/ds-sync
  publish` after the merge (System section Versions row, changed and added
  components' pages, Figma)".
