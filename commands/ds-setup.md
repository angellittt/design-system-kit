---
description: Set up a design system for a new project — in one run, or split between a dev (dev, then finish) and a designer (design)
argument-hint: "[dev | design | finish]"
---

Phase: `$ARGUMENTS`

If the phase is anything other than empty, `dev`, `design` or `finish`, reply
with exactly this and do nothing else — no tools, no reads:

```
/ds-setup          everything in one run: pre-flight, inputs, tokens, code branch, design system, review, Figma, PR
/ds-setup dev      a dev: pre-flight, the inputs final from day one, the code branch on the kit's default look
/ds-setup design   the designer, on that branch: brand inputs, tokens, the design system (yours), review, Figma
/ds-setup finish   a dev, once the designer is done: the design system onto the branch, then the PR
```

Then check one thing: if the current repo has `.ttt/design-system.json`
**without** a `"setup": "awaiting-design"` key, Setup has finished here —
reply with exactly this and do nothing else:

```
This repo already has a design system (.ttt/design-system.json). Use /ds-sync pull or /ds-sync publish.
```

Otherwise, use the design-system-kit `setup` skill in the current repo, in
the phase given (none: one run, or — if a split Setup is under way — ask
whether this is the design phase or the finish). Read the skill's
`references/phases.md` first: it says whether this phase can run here. Follow
the skill and its `kit/procedures/common.md` exactly — every step of the
phase in order, asking a round at a time, stopping where they say to stop (a
missing prerequisite, a blocked pre-flight, a missing input, a failed
contrast check, the review gate) — and end with the report and the phase's
handoff.
