# DropdownMenu

Dropdown Menu lists commands for an object behind a button — the "⋯" on a row or card.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost" aria-label="Actions" />}>
    <MoreHorizontalIcon />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Board</DropdownMenuLabel>
      <DropdownMenuItem onClick={rename}>Rename <DropdownMenuShortcut>R</DropdownMenuShortcut></DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuCheckboxItem checked={showArchived} onCheckedChange={setShowArchived}>Show archived</DropdownMenuCheckboxItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onClick={remove}>Delete board</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Two Base UI rules bite here:

- **`DropdownMenuLabel` must sit inside a `DropdownMenuGroup`** — it is `Menu.GroupLabel`, and on its own it throws.
- **Items take `onClick`, not `onSelect`.** `onSelect` is a valid DOM attribute, so it type-checks and silently never fires.

`variant="destructive"` goes last, after a separator. `inset` lines an item up with siblings that have an icon. Submenus are `DropdownMenuSub` + `DropdownMenuSubTrigger` + `DropdownMenuSubContent`, and open on the inline-end side (left in right-to-left). Keep to about eight items.

**Styling map** — generated from `src/components/ui/dropdown-menu.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| checkbox-item | — | radius | `radius-inset` |
| checkbox-item | — | padding | `space-1` |
| checkbox-item | — | padding | `space-1` × 1.5 |
| checkbox-item | — | padding | `space-8` |
| checkbox-item | — | gap | `space-1` × 1.5 |
| checkbox-item | — | type | text-sm — fixed in code |
| checkbox-item | [&_svg:not([class*='size-'])] | size | `space-4` |
| checkbox-item | focus | background | `fill-alternative` |
| checkbox-item | focus | text | `label-normal` |
| checkbox-item | focus · ** | text | `label-normal` |
| checkbox-item | inset | padding | `space-1` × 7 |
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | border colour | `line-normal` |
| content | — | radius | `radius-lg` |
| content | — | shadow | `shadow-md` |
| content | — | size | `space-1` × 32 |
| content | — | size | max-h-(--available-height) — fixed in code |
| content | — | size | w-(--anchor-width) — fixed in code |
| content | — | padding | `space-1` |
| item | — | radius | `radius-inset` |
| item | — | padding | `space-1` |
| item | — | padding | `space-1` × 1.5 |
| item | — | gap | `space-1` × 1.5 |
| item | — | type | text-sm — fixed in code |
| item | [&_svg:not([class*='size-'])] | size | `space-4` |
| item | dark · variant=destructive · focus | background | `status-negative` |
| item | focus | background | `fill-alternative` |
| item | focus | text | `label-normal` |
| item | inset | padding | `space-1` × 7 |
| item | not-data-[variant=destructive] · focus · ** | text | `label-normal` |
| item | variant=destructive | text | `status-negative` |
| item | variant=destructive · * · [svg] | text | `status-negative` |
| item | variant=destructive · focus | background | `status-negative` |
| item | variant=destructive · focus | text | `status-negative` |
| label | — | text | `label-alternative` |
| label | — | padding | `space-1` |
| label | — | padding | `space-1` × 1.5 |
| label | — | type | font-medium — fixed in code |
| label | — | type | text-xs — fixed in code |
| label | inset | padding | `space-1` × 7 |
| radio-item | — | radius | `radius-inset` |
| radio-item | — | padding | `space-1` |
| radio-item | — | padding | `space-1` × 1.5 |
| radio-item | — | padding | `space-8` |
| radio-item | — | gap | `space-1` × 1.5 |
| radio-item | — | type | text-sm — fixed in code |
| radio-item | [&_svg:not([class*='size-'])] | size | `space-4` |
| radio-item | focus | background | `fill-alternative` |
| radio-item | focus | text | `label-normal` |
| radio-item | focus · ** | text | `label-normal` |
| radio-item | inset | padding | `space-1` × 7 |
| separator | — | background | `line-normal` |
| separator | — | size | h-px — fixed in code |
| shortcut | — | text | `label-alternative` |
| shortcut | — | type | text-xs — fixed in code |
| shortcut | — | type | tracking-widest — fixed in code |
| shortcut | focus | text | `label-normal` |
| sub-content | — | background | `background-elevated` |
| sub-content | — | text | `label-normal` |
| sub-content | — | border colour | `line-normal` |
| sub-content | — | radius | `radius-lg` |
| sub-content | — | shadow | `shadow-lg` |
| sub-content | — | size | min-w-[96px] — fixed in code |
| sub-content | — | size | w-auto — fixed in code |
| sub-content | — | padding | `space-1` |
| sub-trigger | — | radius | `radius-inset` |
| sub-trigger | — | padding | `space-1` |
| sub-trigger | — | padding | `space-1` × 1.5 |
| sub-trigger | — | gap | `space-1` × 1.5 |
| sub-trigger | — | type | text-sm — fixed in code |
| sub-trigger | [&_svg:not([class*='size-'])] | size | `space-4` |
| sub-trigger | focus | background | `fill-alternative` |
| sub-trigger | focus | text | `label-normal` |
| sub-trigger | inset | padding | `space-1` × 7 |
| sub-trigger | not-data-[variant=destructive] · focus · ** | text | `label-normal` |
| sub-trigger | open | background | `fill-alternative` |
| sub-trigger | open | text | `label-normal` |
| sub-trigger | popup-open | background | `fill-alternative` |
| sub-trigger | popup-open | text | `label-normal` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/dropdown-menu
- Code: `components/ui/dropdown-menu.tsx`
- Kit extensions: none
- Client extensions: none
