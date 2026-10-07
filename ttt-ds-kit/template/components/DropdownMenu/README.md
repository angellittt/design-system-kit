# DropdownMenu

DropdownMenu shows a short list of actions from a trigger.

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button size="icon-sm" variant="ghost" aria-label="Actions" />}><MoreHorizontal /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Rename</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Items use `radius-inset` so corners nest inside the menu. `variant="destructive"` marks destructive items; put them last.

**Do** keep menus to about eight items.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/dropdown-menu
- Code: `components/ui/dropdown-menu.tsx`
- Kit extensions: none
- Client extensions: none
