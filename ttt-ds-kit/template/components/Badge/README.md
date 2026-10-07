# Badge

Badge labels status or category in a small pill.

```tsx
<Badge tone="positive">Paid</Badge>
<Badge variant="solid" tone="secondary">Beta</Badge>
```

**Tones** `neutral` · `primary` · `secondary` · `accent` · `positive` · `cautionary` · `negative`. **Variants** `soft` (default: tinted ground, coloured text) · `solid` (brand fill, matching `on-*` foreground).

**Do** pair status tones with a word; colour never carries meaning alone.
**Don't** use badges as buttons.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/badge
- Code: `components/ui/badge.tsx`
- Kit extensions: `tone`
- Client extensions: none
