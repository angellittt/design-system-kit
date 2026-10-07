# Pagination

Pagination moves between pages of a long table or list.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=1">1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
  </PaginationContent>
</Pagination>
```

`isActive` marks the current page (`aria-current="page"`). The landmark is named "Pagination". A rows-per-page selector isn't part of Pagination — it's a Select beside it.

**Styling map** — generated from `src/components/ui/pagination.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | w-full — fixed in code |
| content | — | gap | `space-0.5` |
| ellipsis | — | size | `space-8` |
| ellipsis | [&_svg:not([class*='size-'])] | size | `space-4` |
| link | — | padding | `space-1` × 1.5 |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/pagination
- Code: `components/ui/pagination.tsx`
- Kit extensions: none
- Client extensions: none
