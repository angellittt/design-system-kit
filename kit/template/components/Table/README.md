# Table

Table shows rows of comparable records.

```tsx
<Table density="comfortable">
  <TableHeader><TableRow><TableHead><TableSortButton direction={sort.name} onClick={…}>Name</TableSortButton></TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
  <TableBody>{rows.length ? rows.map(r => <TableRow key={r.id}>…</TableRow>) : <TableEmpty colSpan={2}>Nothing here yet.</TableEmpty>}</TableBody>
</Table>
```

`density` `comfortable` or `compact`. Sorting the data is the consumer's job; for real data tables use shadcn's data-table pattern with `@tanstack/react-table` v8.

**Do** right-align numbers, show status as a `Badge`, keep row actions in a `DropdownMenu` in the last column.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/table
- Code: `components/ui/table.tsx`
- Kit extensions: `density`, TableEmpty, TableSortButton
- Client extensions: none
