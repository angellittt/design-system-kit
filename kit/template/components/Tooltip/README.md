# Tooltip

Tooltip names an icon or adds a one-line hint, on hover and focus.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Tooltip>
  <TooltipTrigger render={<Button size="icon" variant="outline" aria-label="Copy link" />}>
    <CopyIcon />
  </TooltipTrigger>
  <TooltipContent>Copy link</TooltipContent>
</Tooltip>
```

One `TooltipProvider` sits at the app root. The chip uses the inverse tokens. An icon-only trigger still needs its own `aria-label`.

**Don't** put interactive or essential content in a tooltip — touch users may never see it.

**Styling map** — generated from `src/components/ui/tooltip.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| arrow | — | background | `inverse-background` |
| arrow | — | radius | rounded-[2px] — fixed in code |
| arrow | — | size | `space-1` × 2.5 |
| content | — | background | `inverse-background` |
| content | — | text | `inverse-label` |
| content | — | radius | `radius-md` |
| content | — | size | max-w-xs — fixed in code |
| content | — | size | w-fit — fixed in code |
| content | — | padding | `space-1` × 1.5 |
| content | — | padding | `space-3` |
| content | — | gap | `space-1` × 1.5 |
| content | — | type | text-xs — fixed in code |
| content | ** · slot=kbd | radius | `radius-sm` |
| content | has-data-[slot=kbd] | padding | `space-1` × 1.5 |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/tooltip
- Code: `components/ui/tooltip.tsx`
- Kit extensions: none
- Client extensions: none
