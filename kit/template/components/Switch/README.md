# Switch

Switch applies a setting immediately.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field orientation="horizontal">
  <FieldContent>
    <FieldLabel htmlFor="public">Public board</FieldLabel>
    <FieldDescription>Anyone with the link can read it.</FieldDescription>
  </FieldContent>
  <Switch id="public" />
</Field>
```

`size` `sm` · `default`. Label the setting, not the state ("Dark mode", not "On").

**Don't** use it for choices that need a Save button — that's a Checkbox.

**Styling map** — generated from `src/components/ui/switch.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-full` |
| base | checked | background | `primary-normal` |
| base | dark · invalid | border colour | `status-negative` |
| base | dark · invalid | ring | `status-negative` |
| base | dark · unchecked | background | `line-strong` |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` |
| base | size=default | size | h-[18.4px] — fixed in code |
| base | size=default | size | w-[32px] — fixed in code |
| base | size=sm | size | h-[14px] — fixed in code |
| base | size=sm | size | w-[24px] — fixed in code |
| base | unchecked | background | `line-strong` |
| thumb | — | background | `background-normal` |
| thumb | — | radius | `radius-full` |
| thumb | dark · checked | background | `on-primary` |
| thumb | dark · unchecked | background | `label-normal` |
| thumb | size=default | size | `space-4` |
| thumb | size=sm | size | `space-3` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/switch
- Code: `components/ui/switch.tsx`
- Kit extensions: none
- Client extensions: none
