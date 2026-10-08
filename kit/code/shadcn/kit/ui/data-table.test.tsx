// design-system-kit 0.9.0 · profile shadcn · kit extension test
import { describe, expect, it } from "vitest"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ColumnDef } from "@tanstack/react-table"

import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableViewOptions,
  dataTableSelectColumn,
  useDataTable,
} from "@/components/ui/data-table"

/**
 * DataTable is a kit file. These cover what it owns: wiring TanStack's
 * sorting, selection, pagination and visibility to the parts' handlers and
 * attributes. TanStack's own row models aren't re-tested.
 */

type Invoice = { id: string; client: string; amount: number }

const invoices: Invoice[] = [
  { id: "INV-001", client: "Northwind", amount: 1200 },
  { id: "INV-002", client: "Contoso", amount: 860 },
  { id: "INV-003", client: "Fabrikam", amount: 2450 },
]

const columns: ColumnDef<Invoice>[] = [
  dataTableSelectColumn<Invoice>(),
  { accessorKey: "id", header: "Invoice", meta: { label: "Invoice" } },
  {
    accessorKey: "client",
    header: ({ column }) => (
      <DataTableColumnHeader column={column}>Client</DataTableColumnHeader>
    ),
    meta: { label: "Client" },
  },
  { accessorKey: "amount", header: "Amount", meta: { label: "Amount" } },
]

function Invoices({ data = invoices, pageSize }: { data?: Invoice[]; pageSize?: number }) {
  const table = useDataTable({ data, columns, pageSize, getRowId: (r) => r.id })
  return (
    <>
      <DataTableViewOptions table={table} />
      <DataTable table={table} />
      <DataTablePagination table={table} pageSizes={[]} />
    </>
  )
}

const bodyRows = () => screen.getAllByRole("row").slice(1)
const clientCells = () =>
  bodyRows().map((r) => within(r).getAllByRole("cell")[2].textContent)

describe("sorting", () => {
  it("sorts on the header button; aria-sort only on the sorted column", async () => {
    render(<Invoices />)
    const head = screen.getByRole("columnheader", { name: "Client" })
    expect(head).not.toHaveAttribute("aria-sort")

    const button = within(head).getByRole("button", { name: "Client" })
    expect(button).toHaveAttribute("type", "button")
    await userEvent.click(button)
    expect(head).toHaveAttribute("aria-sort", "ascending")
    expect(button).toHaveAttribute("data-direction", "asc")
    expect(clientCells()).toEqual(["Contoso", "Fabrikam", "Northwind"])
    expect(screen.getByRole("columnheader", { name: "Invoice" })).not.toHaveAttribute("aria-sort")

    await userEvent.click(button)
    expect(head).toHaveAttribute("aria-sort", "descending")
    expect(clientCells()).toEqual(["Northwind", "Fabrikam", "Contoso"])
  })
})

describe("selection", () => {
  it("selects a row, marks it selected and counts it", async () => {
    render(<Invoices />)
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[1])
    expect(bodyRows()[1]).toHaveAttribute("data-state", "selected")
    expect(bodyRows()[0]).not.toHaveAttribute("data-state")
    expect(screen.getByText("1 of 3 row(s) selected")).toBeInTheDocument()
  })

  it("select all is indeterminate with some selected, and selects the page", async () => {
    render(<Invoices />)
    const all = screen.getByRole("checkbox", { name: "Select all" })
    await userEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0])
    expect(all).toHaveAttribute("aria-checked", "mixed")
    await userEvent.click(all)
    expect(screen.getByText("3 of 3 row(s) selected")).toBeInTheDocument()
  })
})

describe("pagination", () => {
  it("moves between pages and disables the ends", async () => {
    render(<Invoices pageSize={2} />)
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: "Next page" }))
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument()
    expect(bodyRows()).toHaveLength(1)
    expect(screen.getByRole("button", { name: "Last page" })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: "First page" }))
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument()
  })
})

describe("columns menu", () => {
  it("hides a column, and lists only hideable data columns", async () => {
    render(<Invoices />)
    await userEvent.click(screen.getByRole("button", { name: "Columns" }))
    const items = await screen.findAllByRole("menuitemcheckbox")
    expect(items.map((i) => i.textContent)).toEqual(["Invoice", "Client", "Amount"])
    await userEvent.click(screen.getByRole("menuitemcheckbox", { name: "Amount" }))
    expect(screen.queryByRole("columnheader", { name: "Amount" })).not.toBeInTheDocument()
  })
})

describe("empty", () => {
  it("shows Empty in one cell spanning the visible columns", () => {
    render(<Invoices data={[]} />)
    const cell = screen.getByRole("cell")
    expect(cell).toHaveAttribute("colspan", "4")
    expect(within(cell).getByText("No results")).toBeInTheDocument()
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument()
  })
})
