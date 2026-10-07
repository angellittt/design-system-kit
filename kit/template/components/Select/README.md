# Select

Select chooses one option from a list in a popup.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field>
  <FieldLabel htmlFor="region">Region</FieldLabel>
  <Select defaultValue="eu" items={regions}>
    <SelectTrigger id="region"><SelectValue placeholder="Choose a region" /></SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {regions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
      </SelectGroup>
    </SelectContent>
  </Select>
</Field>
```

`size` `sm` · `default` on the trigger. `SelectGroup` + `SelectLabel` + `SelectSeparator` for grouped lists; items sit inside a group so their corners nest in the popup. Pass `items` so `SelectValue` shows the label, not the raw value. Long lists scroll with `SelectScrollUpButton` / `SelectScrollDownButton`.

**Do** use it for six or more options; fewer is a RadioGroup, so the choices stay visible. A long list people need to search is a Combobox.

**Styling map** — generated from `src/components/ui/select.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | border colour | `line-normal` |
| content | — | radius | `radius-lg` |
| content | — | shadow | `shadow-md` |
| content | — | size | `space-1` × 36 |
| content | — | size | max-h-(--available-height) — fixed in code |
| content | — | size | w-(--anchor-width) — fixed in code |
| group | — | padding | `space-1` |
| item | — | radius | `radius-inset` |
| item | — | size | `space-4` |
| item | — | size | w-full — fixed in code |
| item | — | padding | `space-1` |
| item | — | padding | `space-1` × 1.5 |
| item | — | padding | `space-8` |
| item | — | gap | `space-1` × 1.5 |
| item | — | type | text-sm — fixed in code |
| item | [&_svg:not([class*='size-'])] | size | `space-4` |
| item | * · [span] · last | gap | `space-2` |
| item | focus | background | `fill-alternative` |
| item | focus | text | `label-normal` |
| item | not-data-[variant=destructive] · focus · ** | text | `label-normal` |
| item-text | — | gap | `space-2` |
| label | — | text | `label-alternative` |
| label | — | padding | `space-1` |
| label | — | padding | `space-1` × 1.5 |
| label | — | type | text-xs — fixed in code |
| scroll-down-button | — | background | `background-elevated` |
| scroll-down-button | — | size | w-full — fixed in code |
| scroll-down-button | — | padding | `space-1` |
| scroll-down-button | [&_svg:not([class*='size-'])] | size | `space-4` |
| scroll-up-button | — | background | `background-elevated` |
| scroll-up-button | — | size | w-full — fixed in code |
| scroll-up-button | — | padding | `space-1` |
| scroll-up-button | [&_svg:not([class*='size-'])] | size | `space-4` |
| separator | — | background | `line-normal` |
| separator | — | size | h-px — fixed in code |
| trigger | — | text | `label-alternative` |
| trigger | — | border colour | `line-strong` |
| trigger | — | radius | `radius-md` |
| trigger | — | size | `space-4` |
| trigger | — | size | w-fit — fixed in code |
| trigger | — | padding | `space-1` × 2.5 |
| trigger | — | padding | `space-2` |
| trigger | — | gap | `space-1` × 1.5 |
| trigger | — | type | text-sm — fixed in code |
| trigger | [&_svg:not([class*='size-'])] | size | `space-4` |
| trigger | * · slot=select-value | gap | `space-1` × 1.5 |
| trigger | dark | background | `line-strong` |
| trigger | dark · hover | background | `line-strong` |
| trigger | dark · invalid | border colour | `status-negative` |
| trigger | dark · invalid | ring | `status-negative` |
| trigger | invalid | border colour | `status-negative` |
| trigger | invalid | ring | `status-negative` |
| trigger | placeholder | text | `label-assistive` |
| trigger | size=default | size | `space-8` |
| trigger | size=sm | radius | `radius-sm` |
| trigger | size=sm | size | `space-1` × 7 |
| value | — | type | text-left — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/select
- Code: `components/ui/select.tsx`
- Kit extensions: none
- Client extensions: none
