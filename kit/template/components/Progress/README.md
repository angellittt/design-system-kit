# Progress

Progress shows how far a measurable task has got — uploads, imports, multi-step completion.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Progress value={64} aria-label="Upload progress" />

<Progress value={64}>
  <ProgressLabel>Importing invoices</ProgressLabel>
  <ProgressValue />
</Progress>
```

A bare `Progress` needs an `aria-label`; with a `ProgressLabel`, the label names it. `ProgressValue` prints the percentage. Determinate only — when progress can't be measured, use Spinner or Skeleton. The indicator's slide is reduced-motion safe.

**Styling map** — generated from `src/components/ui/progress.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | gap | `space-3` |
| indicator | — | background | `primary-normal` |
| indicator | — | size | h-full — fixed in code |
| label | — | type | font-medium — fixed in code |
| label | — | type | text-sm — fixed in code |
| track | — | background | `fill-alternative` |
| track | — | radius | `radius-full` |
| track | — | size | `space-1` |
| track | — | size | w-full — fixed in code |
| value | — | text | `label-alternative` |
| value | — | type | text-sm — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/progress
- Code: `components/ui/progress.tsx`
- Kit extensions: none
- Client extensions: none
