# ToggleGroup

Toggle Group sets one or several related options from a row of toggles: a view switcher, text alignment, formatting.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<ToggleGroup variant="outline" spacing={0} value={view} onValueChange={setView} aria-label="View">
  <ToggleGroupItem value="list" aria-label="List"><ListIcon /></ToggleGroupItem>
  <ToggleGroupItem value="grid" aria-label="Grid"><LayoutGridIcon /></ToggleGroupItem>
</ToggleGroup>

<ToggleGroup multiple value={marks} onValueChange={setMarks} aria-label="Formatting">
  <ToggleGroupItem value="bold" aria-label="Bold"><BoldIcon /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic"><ItalicIcon /></ToggleGroupItem>
</ToggleGroup>
```

`value` is always an array — `["grid"]` for a single choice; add `multiple` to allow several. `variant` and `size` set on the group apply to every item (Toggle's variants and sizes). `spacing` is the gap in spacing steps (default 2); `spacing={0}` joins the items into one segmented control. `orientation="vertical"` stacks them. Arrow keys move between items; the group needs an `aria-label` naming what it sets.

A single-choice group can be emptied by pressing its pressed item again. When one option must always be chosen, ignore an empty `value` in `onValueChange`.

**Do** use a joined (`spacing={0}`) outline group for switching views of the same content. **Don't** use it to move between different content — that's Tabs.

**Styling map** — generated from `src/components/ui/toggle-group.tsx` on 2026-10-08. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-md` |
| base | — | size | w-fit — fixed in code |
| base | — | gap | gap-[--spacing(var(--gap))] — fixed in code |
| base | size=sm | radius | `radius-sm` |
| item | horizontal · spacing=0 · first | radius | rounded-l-md — fixed in code |
| item | horizontal · spacing=0 · last | radius | rounded-r-md — fixed in code |
| item | spacing=0 | radius | rounded-none — fixed in code |
| item | spacing=0 | padding | `space-2` |
| item | spacing=0 · has-data-[icon=inline-end] | padding | `space-1` × 1.5 |
| item | spacing=0 · has-data-[icon=inline-start] | padding | `space-1` × 1.5 |
| item | vertical · spacing=0 · first | radius | rounded-t-md — fixed in code |
| item | vertical · spacing=0 · last | radius | rounded-b-md — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/toggle-group
- Code: `components/ui/toggle-group.tsx` (uses toggle.tsx's variants)
- Kit extensions: none
- Client extensions: none
