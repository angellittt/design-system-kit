# Badge

Badge labels a status or category in a small pill.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`tone`, `soft` / `solid`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Badge>New</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="destructive">Overdue</Badge>
<Badge variant="outline">Archived</Badge>
<Badge render={<a href="/tags/beta" />}>Beta</Badge>
```

**Variants** `default` · `secondary` · `destructive` · `outline` · `ghost` · `link`. A badge rendered as a link (`render`) takes the hover state.

**Do** pair a status colour with a word — colour never says "error" or "paid" alone. **Don't** use a badge as a button; it isn't one.

**Styling map** — generated from `src/components/ui/badge.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | rounded-4xl — fixed in code |
| base | — | size | `space-5` |
| base | — | size | w-fit — fixed in code |
| base | — | padding | `space-0.5` |
| base | — | padding | `space-2` |
| base | — | gap | `space-1` |
| base | — | type | font-medium — fixed in code |
| base | — | type | text-xs — fixed in code |
| base | [&>svg] | size | `space-3` |
| base | dark · invalid | ring | `status-negative` |
| base | has-data-[icon=inline-end] | padding | `space-1` × 1.5 |
| base | has-data-[icon=inline-start] | padding | `space-1` × 1.5 |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` |
| base | variant=default | background | `primary-normal` |
| base | variant=default | text | `on-primary` |
| base | variant=default · [a] · hover | background | `primary-normal` |
| base | variant=destructive | background | `status-negative` |
| base | variant=destructive | text | `status-negative` |
| base | variant=destructive · [a] · hover | background | `status-negative` |
| base | variant=destructive · dark | background | `status-negative` |
| base | variant=ghost · dark · hover | background | `fill-alternative` |
| base | variant=ghost · hover | background | `fill-alternative` |
| base | variant=ghost · hover | text | `label-alternative` |
| base | variant=link | text | `primary-normal` |
| base | variant=outline | text | `label-normal` |
| base | variant=outline | border colour | `line-normal` |
| base | variant=outline · [a] · hover | background | `fill-alternative` |
| base | variant=outline · [a] · hover | text | `label-alternative` |
| base | variant=secondary | background | `fill-normal` |
| base | variant=secondary | text | `label-normal` |
| base | variant=secondary · [a] · hover | background | `fill-normal` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/badge
- Code: `components/ui/badge.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `tone` (`neutral` · `primary` · `secondary` · `accent` · `positive` · `cautionary` · `negative`) with `variant` `soft` · `solid` — *Semantic colour*. Stock's variants are about emphasis, not meaning, so status lists end up colouring badges by hand. `tone` picks the meaning and `soft` (tinted ground, coloured text) or `solid` (fill with its `on-*` foreground) picks the loudness. Stock's variants keep working and ignore `tone`.
- Client extensions: none
