# DataTable

Data Table shows records that people sort, select, page through and filter. It's a Table driven by `@tanstack/react-table`.

> Preview from the kit's code — not yet in this codebase; final look may differ slightly once built.

```tsx
const columns: ColumnDef<Invoice>[] = [
  dataTableSelectColumn<Invoice>(),
  { accessorKey: "id", header: "Invoice", meta: { label: "Invoice" } },
  {
    accessorKey: "client",
    header: ({ column }) => <DataTableColumnHeader column={column}>Client</DataTableColumnHeader>,
    meta: { label: "Client" },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => <div className="text-right">{money(row.original.amount)}</div>,
    meta: { label: "Amount" },
  },
]

const table = useDataTable({ data: invoices, columns, getRowId: (r) => r.id })

<div className="flex items-center gap-2">
  <Input
    aria-label="Filter clients"
    placeholder="Filter clients…"
    value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
    onChange={(e) => table.getColumn("client")?.setFilterValue(e.target.value)}
  />
  <DataTableViewOptions table={table} />
</div>
<DataTable table={table} />
<DataTablePagination table={table} />
```

- **The screen owns the data.** `useDataTable` is `useReactTable` with shadcn's data-table guide's setup: client-side sorting, filtering, paging (10 rows unless `pageSize` says otherwise) and selection, state kept for you. For server-side data, call `useReactTable` yourself with `manualSorting`, `manualFiltering` and `manualPagination` (and `rowCount`); every part takes any TanStack table. Stay on TanStack **v8** — v9 drops `useReactTable`.
- **Parts.** `DataTable` draws the header and rows with Table (`density` and `containerClassName` pass through). `DataTableColumnHeader` makes a column sortable with Table's `TableSortButton` — plain text when the column can't sort — and the sorted column's `TableHead` gets `aria-sort`. `dataTableSelectColumn()` adds the checkbox column, which selects the current page. `DataTablePagination` shows the selected count, rows per page (`pageSizes`, default 10 · 20 · 50; `[]` hides it), page N of M, and first, previous, next and last. `DataTableViewOptions` is the Columns menu for showing and hiding columns; it lists each column by `meta.label`.
- **Rows.** A selected row takes `data-state="selected"`. With no rows, one cell spanning every column holds an Empty ("No results", or your own through `empty`). Use `getRowId` so selection follows the record, not its position.
- **Words.** Every visible string can be overridden through `strings` on the part that shows it (e.g. `rowsPerPage` on `DataTablePagination`), and the checkbox labels through `dataTableSelectColumn(strings)`.

Stock shadcn has no Data Table component, only a guide that builds one from Table and TanStack on every screen. The kit ships that guide's parts as one file. It uses Table's kit file for the sortable header, so choosing DataTable brings that file in too.

**Do** right-align numbers, show status as a Badge, keep row actions in a DropdownMenu in the last column, and give every column a `meta.label`. **Don't** use DataTable for a short read-only list with no sorting or paging — plain Table is lighter.

**Styling map** — generated from `src/components/ui/data-table.tsx` on 2026-10-08. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| pagination | — | text | `label-alternative` |
| pagination | — | gap | `space-2` |
| pagination | — | gap | `space-6` |
| pagination | — | type | font-medium — fixed in code |
| pagination | — | type | text-sm — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn data-table guide (Table + `@tanstack/react-table` v8) + kit parts
- Code: `components/ui/data-table.tsx` (a kit file; it uses table.tsx's kit file for `TableSortButton`)
- Kit extensions: opt-in, chosen at the design review:
  - The whole component, *Data table* (candidate) — every list screen otherwise rewrites the guide's column header, select-all checkbox, pager and columns menu, each a little differently and without `aria-sort` or labelled icon buttons. The kit file owns those parts; the screen keeps the data, the columns and the choice between client-side and server-side.
- Client extensions: none
