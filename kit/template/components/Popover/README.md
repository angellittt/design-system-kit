# Popover

Popover shows rich, interactive content anchored to a trigger.

```tsx
<Popover><PopoverTrigger render={<Button variant="outline" />}>Filters</PopoverTrigger><PopoverContent>…</PopoverContent></Popover>
```

**Do** use for small forms and pickers.
**Don't** use for plain hints; use Tooltip.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/popover
- Code: `components/ui/popover.tsx`
- Kit extensions: none
- Client extensions: none
