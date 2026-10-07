# Popover

Popover holds a small interactive panel anchored to its trigger — a share link, filters, a quick edit.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" size="sm" />}>Share</PopoverTrigger>
  <PopoverContent align="start">
    <PopoverHeader>
      <PopoverTitle>Share this board</PopoverTitle>
      <PopoverDescription>Anyone with the link can view.</PopoverDescription>
    </PopoverHeader>
    …
    <PopoverClose render={<Button variant="outline" size="sm" />}>Done</PopoverClose>
  </PopoverContent>
</Popover>
```

Base UI moves focus in and closes on Escape or an outside click. `PopoverClose` wraps your own close button. There is no `PopoverAnchor` — the positioner takes an `anchor` prop instead.

**Do** keep it to one task. **Don't** use it for plain hints (Tooltip) or command lists (DropdownMenu).

**Styling map** — generated from `src/components/ui/popover.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | border colour | `line-normal` |
| content | — | radius | `radius-lg` |
| content | — | shadow | `shadow-md` |
| content | — | size | `space-1` × 72 |
| content | — | padding | `space-1` × 2.5 |
| content | — | gap | `space-1` × 2.5 |
| content | — | type | text-sm — fixed in code |
| description | — | text | `label-neutral` |
| header | — | gap | `space-0.5` |
| header | — | type | text-sm — fixed in code |
| title | — | type | font-medium — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/popover
- Code: `components/ui/popover.tsx`
- Kit extensions: none
- Client extensions: none
