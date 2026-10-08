---
description: Sync the design system with code or Figma — pull (design → code and Figma), publish (code → design system → Figma) or restyle (new brand inputs → design system → code and Figma)
argument-hint: pull | publish | restyle
---

Mode: `$ARGUMENTS`

If the mode is empty, or anything other than `pull`, `publish` or `restyle`, reply with
exactly this and do nothing else — no tools, no reads:

```
/ds-sync pull     design → code and Figma: tokens and assets into this repo as a PR, token changes to the Figma variables
/ds-sync publish  code → design system → Figma: bundle, previews, styling maps, types, statuses, then the Figma library
/ds-sync restyle  new brand inputs (usually the provisional ones) → regenerated tokens, designer approval, design system, then pull
```

Otherwise, use the design-system-kit `sync` skill in `$ARGUMENTS` mode, in the
current repo. Follow the skill and its `kit/procedures/common.md` exactly,
including stopping where they say to stop, and end with the report.
