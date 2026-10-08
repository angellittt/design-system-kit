// design-system-kit 0.5.2 · profile shadcn · kit extension test
import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSortButton,
} from "@/components/ui/table"

/**
 * TableSortButton and density are kit extensions. These cover what they own:
 * firing the caller's click, reflecting the sort state, and never submitting
 * a surrounding form. The sort order itself is the caller's job.
 */

function SortableTable() {
  const [direction, setDirection] = React.useState<"asc" | "desc" | false>(
    false
  )
  const next = () =>
    setDirection((d) => (d === "asc" ? "desc" : d === "desc" ? false : "asc"))
  const ariaSort =
    direction === "asc"
      ? "ascending"
      : direction === "desc"
        ? "descending"
        : "none"
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead aria-sort={ariaSort}>
            <TableSortButton
              active={!!direction}
              direction={direction}
              onClick={next}
            >
              Name
            </TableSortButton>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Ada</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe("sortable header", () => {
  it("fires onClick when clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<TableSortButton onClick={onClick}>Name</TableSortButton>)
    await user.click(screen.getByRole("button", { name: "Name" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is operable by keyboard", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<TableSortButton onClick={onClick}>Name</TableSortButton>)
    await user.tab()
    expect(screen.getByRole("button", { name: "Name" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("reflects the direction on the button and aria-sort on the header", async () => {
    const user = userEvent.setup()
    render(<SortableTable />)
    const button = screen.getByRole("button", { name: "Name" })
    const header = screen.getByRole("columnheader")

    expect(header).toHaveAttribute("aria-sort", "none")
    expect(button).not.toHaveAttribute("data-active")
    expect(button).not.toHaveAttribute("data-direction")

    await user.click(button)
    expect(header).toHaveAttribute("aria-sort", "ascending")
    expect(button).toHaveAttribute("data-active")
    expect(button).toHaveAttribute("data-direction", "asc")

    await user.click(button)
    expect(header).toHaveAttribute("aria-sort", "descending")
    expect(button).toHaveAttribute("data-direction", "desc")
  })

  it("does not submit a surrounding form", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <TableSortButton>Name</TableSortButton>
      </form>
    )
    await user.click(screen.getByRole("button", { name: "Name" }))
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

describe("table extensions", () => {
  it("sets density once on the container", () => {
    const { container } = render(
      <Table density="compact">
        <TableBody>
          <TableRow>
            <TableCell>Ada</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(
      container
        .querySelector('[data-slot="table-container"]')
        ?.getAttribute("data-density")
    ).toBe("compact")
  })

  it("marks clickable rows only when asked", () => {
    render(
      <Table>
        <TableBody>
          <TableRow clickable>
            <TableCell>Clickable</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Plain</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText("Clickable").closest("tr")).toHaveAttribute(
      "data-clickable"
    )
    expect(screen.getByText("Plain").closest("tr")).not.toHaveAttribute(
      "data-clickable"
    )
  })
})
