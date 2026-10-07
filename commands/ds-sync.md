---
description: Sync the design system with code or Figma — pull (design → code) or publish (code → design system → Figma)
argument-hint: pull | publish
---

Mode: `$ARGUMENTS`

If the mode is empty, or anything other than `pull` or `publish`, reply with
exactly this and do nothing else — no tools, no reads:

```
/ds-sync pull     design → code: snapshot the design system's tokens and assets into this repo as a PR
/ds-sync publish  code → design system → Figma: bundle, previews, styling maps, types, statuses, then the Figma library
```

Otherwise, use the design-system-kit `sync` skill in `$ARGUMENTS` mode, in the
current repo. Follow the skill and its `kit/procedures/common.md` exactly,
including stopping where they say to stop, and end with the report.
