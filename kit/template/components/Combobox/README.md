# Combobox

Combobox picks one or more options from a long list by typing to filter it.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field>
  <FieldLabel htmlFor="assignee">Assignee</FieldLabel>
  <Combobox items={people}>
    <ComboboxInput id="assignee" placeholder="Search people" />
    <ComboboxContent>
      <ComboboxEmpty>No people found.</ComboboxEmpty>
      <ComboboxList>{(p) => <ComboboxItem key={p} value={p}>{p}</ComboboxItem>}</ComboboxList>
    </ComboboxContent>
  </Combobox>
</Field>
```

**Combobox lives inside an Input Group.** `ComboboxInput` renders its own `InputGroup`, so the frame, focus and invalid state are the Input Group's; put icons or buttons in `InputGroupAddon` inside it rather than wrapping the combobox in another frame.

Multi-select with `multiple`, showing the picks as `ComboboxChips` / `ComboboxChip` around a `ComboboxChipsInput`. Errors via `aria-invalid` on the input. The search field is Field exception 3 — the combobox as a whole goes in a Field. Use Select instead for short lists nobody needs to search.

**Styling map** — generated from `src/components/ui/combobox.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| chip | — | background | `fill-alternative` |
| chip | — | text | `label-normal` |
| chip | — | radius | `radius-sm` |
| chip | — | size | h-[calc(--spacing(5.25))] — fixed in code |
| chip | — | size | w-fit — fixed in code |
| chip | — | padding | `space-1` × 1.5 |
| chip | — | gap | `space-1` |
| chip | — | type | font-medium — fixed in code |
| chip | — | type | text-xs — fixed in code |
| chip | has-data-[slot=combobox-chip-remove] | padding | `space-0` |
| chip-input | — | size | `space-16` |
| chip-input | placeholder | text | `label-assistive` |
| chips | — | border colour | `line-strong` |
| chips | — | radius | `radius-sm` |
| chips | — | size | `space-8` |
| chips | — | padding | `space-1` |
| chips | — | padding | `space-1` × 2.5 |
| chips | — | gap | `space-1` |
| chips | — | type | text-sm — fixed in code |
| chips | dark | background | `line-strong` |
| chips | dark · has-aria-invalid | border colour | `status-negative` |
| chips | dark · has-aria-invalid | ring | `status-negative` |
| chips | focus-within | border colour | `focus-ring` |
| chips | focus-within | ring | `focus-ring` |
| chips | has-aria-invalid | border colour | `status-negative` |
| chips | has-aria-invalid | ring | `status-negative` |
| chips | has-data-[slot=combobox-chip] | padding | `space-1` |
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | border colour | `line-normal` |
| content | — | radius | `radius-lg` |
| content | — | shadow | `shadow-md` |
| content | — | size | max-h-(--available-height) — fixed in code |
| content | — | size | max-w-(--available-width) — fixed in code |
| content | — | size | min-w-[calc(var(--anchor-width)+--spacing(7))] — fixed in code |
| content | — | size | w-(--anchor-width) — fixed in code |
| content | * · slot=input-group | background | `line-strong` |
| content | * · slot=input-group | border colour | `line-strong` |
| content | * · slot=input-group | size | `space-8` |
| content | chips=true | size | min-w-(--anchor-width) — fixed in code |
| empty | — | text | `label-alternative` |
| empty | — | size | w-full — fixed in code |
| empty | — | padding | `space-2` |
| empty | — | type | text-center — fixed in code |
| empty | — | type | text-sm — fixed in code |
| input-group | — | size | w-auto — fixed in code |
| item | — | radius | `radius-inset` |
| item | — | size | `space-4` |
| item | — | size | w-full — fixed in code |
| item | — | padding | `space-1` |
| item | — | padding | `space-1` × 1.5 |
| item | — | padding | `space-8` |
| item | — | gap | `space-2` |
| item | — | type | text-sm — fixed in code |
| item | [&_svg:not([class*='size-'])] | size | `space-4` |
| item | highlighted | background | `fill-alternative` |
| item | highlighted | text | `label-normal` |
| item | not-data-[variant=destructive] · highlighted · ** | text | `label-normal` |
| label | — | text | `label-alternative` |
| label | — | padding | `space-1` × 1.5 |
| label | — | padding | `space-2` |
| label | — | type | text-xs — fixed in code |
| list | — | size | max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] — fixed in code |
| list | — | padding | `space-1` |
| list | empty | padding | `space-0` |
| separator | — | background | `line-normal` |
| separator | — | size | h-px — fixed in code |
| trigger | — | text | `label-alternative` |
| trigger | — | size | `space-4` |
| trigger | [&_svg:not([class*='size-'])] | size | `space-4` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/combobox
- Code: `components/ui/combobox.tsx`
- Kit extensions: none
- Client extensions: none
