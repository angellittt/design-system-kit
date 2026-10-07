# Skeleton

Skeleton holds the shape of content while it loads — cards, table rows, lists.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<div aria-busy="true">
  <Skeleton className="h-4 w-48" />
  <Skeleton className="mt-2 h-4 w-32" />
</div>
```

Size it with classes to match the content it stands in for. Mark the loading region `aria-busy` until content arrives. The pulse stops under reduced motion. Installed with Sidebar and documented here for direct use.

**Styling map** — generated from `src/components/ui/skeleton.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | background | `fill-alternative` |
| base | — | radius | `radius-md` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/skeleton
- Code: `components/ui/skeleton.tsx`
- Kit extensions: none
- Client extensions: none
