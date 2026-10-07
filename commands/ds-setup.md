---
description: Set up a design system for a new project — tokens, code branch, claude.ai Design System, review, Figma library, PR
argument-hint: (no arguments)
---

First check one thing: if the current repo already has
`.ttt/design-system.json`, it has been set up — reply with exactly this and
do nothing else:

```
This repo already has a design system (.ttt/design-system.json). Use /ds-sync pull or /ds-sync publish.
```

Otherwise, use the design-system-kit `setup` skill in the current repo.
Follow the skill and its `kit/procedures/common.md` exactly — every step in
order, stopping where they say to stop (a missing prerequisite, a blocked
pre-flight, a missing input, a failed contrast check, the review gate) — and
end with the report.

`$ARGUMENTS` is ignored; Setup asks for everything it needs.
