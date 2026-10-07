# Tooltip

Tooltip names or briefly explains a control on hover and focus.

```tsx
<Tooltip><TooltipTrigger render={<Button size="icon" variant="ghost" aria-label="Copy" />}><Copy /></TooltipTrigger><TooltipContent>Copy link</TooltipContent></Tooltip>
```

Styled as an inverse chip. Wrap the app once in `TooltipProvider`.

**Don't** put essential information or interactive content in a tooltip.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/tooltip
- Code: `components/ui/tooltip.tsx`
- Kit extensions: none
- Client extensions: none
