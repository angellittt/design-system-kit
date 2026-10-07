# Table

Table shows rows of comparable records.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`density`, `TableSortButton`, `clickable`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Table>
  <TableCaption className="sr-only">Invoices</TableCaption>
  <TableHeader>
    <TableRow><TableHead>Invoice</TableHead><TableHead>Client</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    {rows.length ? rows.map((r) => (
      <TableRow key={r.id}><TableCell>{r.id}</TableCell><TableCell>{r.client}</TableCell><TableCell className="text-right">{r.amount}</TableCell></TableRow>
    )) : (
      <TableRow><TableCell colSpan={3}><Empty><EmptyHeader><EmptyTitle>No invoices yet</EmptyTitle></EmptyHeader></Empty></TableCell></TableRow>
    )}
  </TableBody>
</Table>
```

An empty table is `TableRow` → `TableCell colSpan` → `Empty`, with no wrapper. `containerClassName` styles the scroll container. Selected rows take `data-state="selected"`. For real data tables, use shadcn's data-table pattern with `@tanstack/react-table` **v8** (v9 drops `useReactTable`).

**Do** right-align numbers, show status as a Badge, and keep row actions in a DropdownMenu in the last column.

**Styling map** — generated from `src/components/ui/table.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | w-full — fixed in code |
| base | — | type | text-sm — fixed in code |
| body | [&_tr:last-child] | border width | border-0 — fixed in code |
| caption | — | text | `label-alternative` |
| caption | — | type | text-sm — fixed in code |
| cell | — | padding | `space-2` |
| cell | [&:has([role=checkbox])] | padding | `space-0` |
| container | — | size | w-full — fixed in code |
| footer | — | background | `fill-alternative` |
| footer | — | type | font-medium — fixed in code |
| head | — | text | `label-normal` |
| head | — | size | `space-10` |
| head | — | padding | `space-2` |
| head | — | type | font-medium — fixed in code |
| head | — | type | text-left — fixed in code |
| head | [&:has([role=checkbox])] | padding | `space-0` |
| row | has-aria-expanded | background | `fill-alternative` |
| row | hover | background | `fill-alternative` |
| row | state=selected | background | `fill-alternative` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/table
- Code: `components/ui/table.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `density` (`comfortable` · `compact`) — *Row density*. Dense admin tables and roomy summary tables want different row heights; stock has one. `comfortable` is stock's spacing.
  - `TableSortButton` — *Sortable header*. A header button with the sort arrow, `data-direction` and `type="button"`; put `aria-sort` on the `TableHead`. Sorting the data stays the screen's job.
  - `TableRow clickable` — *Clickable rows* (candidate). Pointer cursor and `data-clickable` for rows that open a record; the row's own handler (and a real link inside) does the opening.
- Client extensions: none
