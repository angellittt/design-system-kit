# Card

Card groups related content and actions on a raised surface.

```tsx
<Card>
  <CardHeader><CardTitle>Revenue</CardTitle><CardDescription>Last 30 days</CardDescription></CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button variant="secondary" size="sm">View report</Button></CardFooter>
</Card>
```

`variant` `raised` (default, `shadow-sm` + border) or `flat` (border only, dense grids). `interactive` adds a hover lift; pair it with a link or `onClick` + `tabIndex={0}`. `size="sm"` tightens padding for stat tiles.

**Don't** nest cards inside cards.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/card
- Code: `components/ui/card.tsx`
- Kit extensions: `variant` (`raised`, `flat`), `interactive`, `size`
- Client extensions: none
