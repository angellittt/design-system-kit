# Report — how every Setup run ends

design-system-kit 0.4.1

The skill writes the report itself (common.md §10). It goes in the chat and,
once there is a PR, as the PR body (with `code.md` §7's lists before
the headings). A run that stopped still reports: say where and why under
Gaps, and "none" for what didn't happen.

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
- Prerequisites and pre-flight: each finding as ready / adaptable / blocked.
- The confirmed inputs (from `inputs.json`), in one list.
- Tokens: the ramps generated (brand hex and the step it landed on), the
  contrast result (pairs × themes, failing, intentional).
- The branch: components installed (stock, kit extensions), stock files left
  alone, wiring, packages added (with the components that need them), and
  every check's result.
- The design system: its link, the files published, the preview check
  (count × themes, errors), `ds:validate` and `ds:contrast`.
- The review: when it was approved, and what changed in claude.ai before
  approval.
- Figma: the file, the variables, styles and components created, and the
  read-back result — or that it wasn't reached and why.
- The PR link.

**Values changed (old → new)**
- Every template value Setup replaced: each ramp (placeholder → generated),
  radius, easing, font families — as `old → new`.
- Every contrast adjustment: `token` (theme) `{old step}` → `{new step}`.
- Every value the designer changed in claude.ai during review.

**Deviations logged**
- Each ClickUp task logged (common.md §7). Usually "none" — Setup stops on a
  contrast failure rather than logging it.

**Visible preview differences**
- First run: "none — first build". List any preview that rendered with an
  error or looked broken (it is reported, never edited).

**Gaps**
- Every input outstanding, every stop and its reason.
- Every brand-book section that kept a "TTT default" passage for lack of
  guidelines.
- The shared grounds and raw-value semantic tokens from the token report.
- Every `ds:validate` warning.
- Every decision the contract or profile didn't cover.
- Always, when they apply: **publish the Figma library**; **share the design
  system with the team**; "Code pending flips to ✓ on the next Sync run
  after the PR merges".
