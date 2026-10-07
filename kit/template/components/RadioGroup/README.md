# RadioGroup

Radio Group picks exactly one option from a short list.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<FieldSet>
  <FieldLegend>Plan</FieldLegend>
  <RadioGroup defaultValue="team">
    <Field orientation="horizontal">
      <RadioGroupItem value="solo" id="solo" />
      <FieldLabel htmlFor="solo">Solo</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="team" id="team" />
      <FieldLabel htmlFor="team">Team</FieldLabel>
    </Field>
  </RadioGroup>
</FieldSet>
```

Give the group a visible heading (`FieldLegend`). Arrow keys move between items (Base UI roving focus). Two to six options; more than that is a Select.

**Styling map** — generated from `src/components/ui/radio-group.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | w-full — fixed in code |
| base | — | gap | `space-2` |
| indicator | — | size | `space-4` |
| item | — | background | `on-primary` |
| item | — | border colour | `line-strong` |
| item | — | radius | `radius-full` |
| item | — | size | `space-2` |
| item | — | size | `space-4` |
| item | checked | background | `primary-normal` |
| item | checked | text | `on-primary` |
| item | checked | border colour | `primary-normal` |
| item | dark | background | `line-strong` |
| item | dark · checked | background | `primary-normal` |
| item | dark · invalid | border colour | `status-negative` |
| item | dark · invalid | ring | `status-negative` |
| item | invalid | border colour | `status-negative` |
| item | invalid | ring | `status-negative` |
| item | invalid · checked | border colour | `primary-normal` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/radio-group
- Code: `components/ui/radio-group.tsx`
- Kit extensions: none
- Client extensions: none
