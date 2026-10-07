# Card

Card groups related content and actions on a raised surface.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`variant`, `interactive`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Revenue</CardTitle>
    <CardDescription>Last 30 days</CardDescription>
    <CardAction><Button variant="ghost" size="sm">Export</Button></CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button variant="secondary" size="sm">View report</Button></CardFooter>
</Card>
```

`size="sm"` tightens the spacing for stat tiles and dense grids. An image as the first or last child runs edge to edge. `CardFooter` is a band separated from the content.

**Don't** nest cards. A whole card that links somewhere puts the link on its title, not an `onClick` on the card.

**Styling map** — generated from `src/components/ui/card.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | background | `background-elevated` |
| base | — | text | `label-normal` |
| base | — | border colour | `line-normal` |
| base | — | radius | `radius-lg` |
| base | — | padding | py-(--card-spacing) — fixed in code |
| base | — | gap | gap-(--card-spacing) — fixed in code |
| base | — | type | text-sm — fixed in code |
| base | * · [img:first-child] | radius | rounded-t-lg — fixed in code |
| base | * · [img:last-child] | radius | rounded-b-lg — fixed in code |
| base | has-[>img:first-child] | padding | `space-0` |
| base | has-data-[slot=card-footer] | padding | `space-0` |
| base | size=sm · has-data-[slot=card-footer] | padding | `space-0` |
| content | — | padding | px-(--card-spacing) — fixed in code |
| description | — | text | `label-neutral` |
| description | — | type | text-sm — fixed in code |
| footer | — | background | `fill-alternative` |
| footer | — | radius | rounded-b-lg — fixed in code |
| footer | — | padding | p-(--card-spacing) — fixed in code |
| header | — | radius | rounded-t-lg — fixed in code |
| header | — | padding | px-(--card-spacing) — fixed in code |
| header | — | gap | `space-1` |
| header | [.border-b] | padding | pb-(--card-spacing) — fixed in code |
| title | — | type | font-heading — fixed in code |
| title | — | type | font-medium — fixed in code |
| title | — | type | leading-snug — fixed in code |
| title | — | type | text-base — fixed in code |
| title | size=sm | type | text-sm — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/card
- Code: `components/ui/card.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `variant` (`flat` · `raised`) — *Raised / flat*. Stock has one surface treatment; `raised` adds `shadow-sm` for cards that sit on a busy ground, `flat` (the default) is stock's look.
  - `interactive` — *Hover lift*. For a card that is itself the target (a project tile): pointer cursor and a reduced-motion-safe lift on hover. Pair it with a real link or button inside, or `role` and `tabIndex` for keyboard users.
- Client extensions: none
