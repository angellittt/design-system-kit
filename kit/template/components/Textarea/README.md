# Textarea

Textarea takes multi-line text — notes, descriptions, comments.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field>
  <FieldLabel htmlFor="notes">Notes</FieldLabel>
  <Textarea id="notes" aria-describedby="notes-help" />
  <FieldDescription id="notes-help">Visible to everyone on the project.</FieldDescription>
</Field>
```

Grows with its content (CSS `field-sizing: content`) from a minimum height; pass `rows` for a fixed height in dense forms. It wears Input's frame — the same border, radius and focus treatment — so a multi-line field sits beside a single-line one without looking like a different control.

**Styling map** — generated from `src/components/ui/textarea.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | border colour | `line-strong` |
| base | — | radius | `radius-sm` |
| base | — | size | `space-16` |
| base | — | size | w-full — fixed in code |
| base | — | padding | `space-1` × 2.5 |
| base | — | padding | `space-2` |
| base | — | type | text-base — fixed in code |
| base | dark | background | `line-strong` |
| base | dark · disabled | background | `line-strong` |
| base | dark · invalid | border colour | `status-negative` |
| base | dark · invalid | ring | `status-negative` |
| base | disabled | background | `line-strong` |
| base | focus-visible | border colour | `focus-ring` |
| base | focus-visible | ring | `focus-ring` |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` |
| base | md | type | text-sm — fixed in code |
| base | placeholder | text | `label-assistive` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/textarea
- Code: `components/ui/textarea.tsx`
- Kit extensions: none
- Client extensions: none
