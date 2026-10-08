# ButtonGroup

Button Group joins related buttons into one control: a split button, pager arrows, a toolbar section.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<ButtonGroup aria-label="Invoice actions">
  <Button variant="outline">Send</Button>
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More send options" />}>
      <ChevronDownIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">…</DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>

<ButtonGroup>
  <ButtonGroupText>https://</ButtonGroupText>
  <Input aria-label="Domain" placeholder="example.com" />
</ButtonGroup>
```

The group joins its direct children (Button, Input, SelectTrigger, ButtonGroupText): inner corners squared, shared borders collapsed. `orientation="vertical"` stacks them. Nest groups for a toolbar — nested groups get a gap between them. `ButtonGroupSeparator` draws a line between buttons that have no border of their own (`secondary`, `ghost`); `ButtonGroupText` is a static label or prefix, and takes `render` to be a `Label`. The group has `role="group"`; give it an `aria-label` when its purpose isn't obvious from the buttons.

**Do** group buttons that act on the same thing, and keep one variant across the group. **Don't** use a button group as a single choice — that's ToggleGroup — or to put unrelated actions side by side.

**Styling map** — generated from `src/components/ui/button-group.tsx` on 2026-10-08. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | w-fit — fixed in code |
| base | [&>[data-slot=select-trigger]:not([class*='w-'])] | size | w-fit — fixed in code |
| base | has-[>[data-slot=button-group]] | gap | `space-2` |
| base | has-[select[aria-hidden=true]:last-child] · [&>[data-slot=select-trigger]:last-of-type] | radius | rounded-r-md — fixed in code |
| base | orientation=horizontal · [&>[data-slot]:not(:has(~[data-slot]))] | radius | rounded-r-md! — fixed in code |
| base | orientation=horizontal · [&>[data-slot]~[data-slot]] | radius | rounded-l-none — fixed in code |
| base | orientation=horizontal · * · slot | radius | rounded-r-none — fixed in code |
| base | orientation=vertical · [&>[data-slot]:not(:has(~[data-slot]))] | radius | rounded-b-md! — fixed in code |
| base | orientation=vertical · [&>[data-slot]~[data-slot]] | radius | rounded-t-none — fixed in code |
| base | orientation=vertical · * · slot | radius | rounded-b-none — fixed in code |
| separator | — | background | `line-strong` |
| separator | horizontal | size | w-auto — fixed in code |
| separator | vertical | size | h-auto — fixed in code |
| text | — | background | `fill-alternative` |
| text | — | radius | `radius-md` |
| text | — | padding | `space-1` × 2.5 |
| text | — | gap | `space-2` |
| text | — | type | font-medium — fixed in code |
| text | — | type | text-sm — fixed in code |
| text | [&_svg:not([class*='size-'])] | size | `space-4` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/button-group
- Code: `components/ui/button-group.tsx`
- Kit extensions: none
- Client extensions: none
