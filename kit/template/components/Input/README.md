# Input

A text field is a composition, not a component: a `Field` around `FieldLabel` + `Input` + `FieldDescription` or `FieldError`.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field data-invalid={error ? true : undefined}>
  <FieldLabel htmlFor="name">Project name</FieldLabel>
  <Input id="name" placeholder="e.g. Spring launch" aria-invalid={!!error} aria-describedby="name-help" />
  <FieldDescription id="name-help">Shown to your whole team.</FieldDescription>
</Field>
```

- Errors are driven by `aria-invalid` on the input and `data-invalid` on the Field; `aria-describedby` is wired by hand (see Field).
- Always a visible label — placeholders (`label-assistive`) are examples only. The exceptions are in Field.
- For an icon, prefix or button inside the frame, use `InputGroup`, not a wrapper around `Input`.
- `Label` (`label.tsx`) is the plain label for controls outside a Field; inside one, use `FieldLabel`.

**Do** write errors as fixes: "Use at least 8 characters", not "Invalid".

**Styling map** — generated from `src/components/ui/input.tsx`, `src/components/ui/label.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | border colour | `line-strong` |
| base | — | radius | `radius-sm` |
| base | — | size | `space-0` |
| base | — | size | `space-8` |
| base | — | size | w-full — fixed in code |
| base | — | padding | `space-1` |
| base | — | padding | `space-1` × 2.5 |
| base | — | type | text-base — fixed in code |
| base | dark | background | `line-strong` |
| base | dark · disabled | background | `line-strong` |
| base | dark · invalid | border colour | `status-negative` |
| base | dark · invalid | ring | `status-negative` |
| base | disabled | background | `line-strong` |
| base | file | text | `label-normal` |
| base | file | border width | border-0 — fixed in code |
| base | file | size | `space-6` |
| base | file | type | font-medium — fixed in code |
| base | file | type | text-sm — fixed in code |
| base | focus-visible | border colour | `focus-ring` |
| base | focus-visible | ring | `focus-ring` |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` |
| base | md | type | text-sm — fixed in code |
| base | placeholder | text | `label-assistive` |
| label | — | gap | `space-2` |
| label | — | type | font-medium — fixed in code |
| label | — | type | leading-none — fixed in code |
| label | — | type | text-sm — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/input + shadcn/label
- Code: `components/ui/` input.tsx, label.tsx
- Kit extensions: none
- Client extensions: none
