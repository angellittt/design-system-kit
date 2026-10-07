# Empty

Empty fills a page, table, list or search result that has nothing to show yet.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><InboxIcon /></EmptyMedia>
    <EmptyTitle>No invoices yet</EmptyTitle>
    <EmptyDescription>Invoices appear here once a project is billed.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button>Create invoice</Button></EmptyContent>
</Empty>
```

In a table, Empty sits in a full-width cell with no wrapper: `TableRow` → `TableCell colSpan` → `Empty`.

**Do** give the title a fact and the description a next step ("No invoices match that filter" / "Try a client or project name"). **Don't** use Empty for loading — that's Skeleton or Spinner.

**Styling map** — generated from `src/components/ui/empty.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-xl` |
| base | — | size | `space-0` |
| base | — | size | w-full — fixed in code |
| base | — | padding | `space-6` |
| base | — | gap | `space-4` |
| base | — | type | text-balance — fixed in code |
| base | — | type | text-center — fixed in code |
| content | — | size | `space-0` |
| content | — | size | max-w-sm — fixed in code |
| content | — | size | w-full — fixed in code |
| content | — | gap | `space-1` × 2.5 |
| content | — | type | text-balance — fixed in code |
| content | — | type | text-sm — fixed in code |
| description | — | text | `label-alternative` |
| description | — | type | text-sm/relaxed — fixed in code |
| description | [&>a:hover] | text | `primary-normal` |
| header | — | size | max-w-sm — fixed in code |
| header | — | gap | `space-2` |
| icon | variant=icon | background | `fill-alternative` |
| icon | variant=icon | text | `label-normal` |
| icon | variant=icon | radius | `radius-lg` |
| icon | variant=icon | size | `space-8` |
| icon | variant=icon · [&_svg:not([class*='size-'])] | size | `space-4` |
| title | — | type | font-heading — fixed in code |
| title | — | type | font-medium — fixed in code |
| title | — | type | text-sm — fixed in code |
| title | — | type | tracking-tight — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/empty
- Code: `components/ui/empty.tsx`
- Kit extensions: none
- Client extensions: none
