# Checkbox

Checkbox turns one independent option on or off, applied when the form is submitted.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field orientation="horizontal">
  <Checkbox id="digest" defaultChecked />
  <FieldLabel htmlFor="digest">Send me the weekly digest</FieldLabel>
</Field>

<Checkbox indeterminate aria-label="Select all rows" />
```

Base UI props pass through (`checked`, `onCheckedChange`, `disabled`, `required`, `name`). `indeterminate` is its own boolean prop, not a `checked` value, and shows a dash. A checkbox that selects table rows is Field exception 2 — `aria-label` names the row.

**Don't** use a checkbox to apply something instantly — that's a `Switch`.

**Styling map** — generated from `src/components/ui/checkbox.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | border colour | `line-strong` |
| base | — | radius | rounded-[4px] — fixed in code |
| base | — | size | `space-4` |
| base | checked | background | `primary-normal` |
| base | checked | text | `on-primary` |
| base | checked | border colour | `primary-normal` |
| base | dark | background | `line-strong` |
| base | dark · checked | background | `primary-normal` |
| base | dark · indeterminate | background | `primary-normal` |
| base | dark · invalid | border colour | `status-negative` |
| base | dark · invalid | ring | `status-negative` |
| base | indeterminate | background | `primary-normal` |
| base | indeterminate | text | `on-primary` |
| base | indeterminate | border colour | `primary-normal` |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` |
| base | invalid · checked | border colour | `primary-normal` |
| indicator | — | type | text-current — fixed in code |
| indicator | [&>svg] | size | `space-1` × 3.5 |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/checkbox
- Code: `components/ui/checkbox.tsx`
- Kit extensions: none
- Client extensions: none
