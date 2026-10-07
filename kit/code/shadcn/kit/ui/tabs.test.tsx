// design-system-kit 0.1.1 · profile shadcn · kit extension test
import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Tabs,
  TabsContent,
  TabsCount,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

/** TabsCount is a kit extension; a count inside a tab must not change how it selects. */

function Inbox(props: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs defaultValue="open" {...props}>
      <TabsList>
        <TabsTrigger value="open">
          Open <TabsCount>4</TabsCount>
        </TabsTrigger>
        <TabsTrigger value="closed">
          Closed <TabsCount>12</TabsCount>
        </TabsTrigger>
        <TabsTrigger value="archived" disabled>
          Archived
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">Open items</TabsContent>
      <TabsContent value="closed">Closed items</TabsContent>
      <TabsContent value="archived">Archived items</TabsContent>
    </Tabs>
  )
}

describe("tabs with counts", () => {
  it("selects a tab on click and calls onValueChange", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Inbox onValueChange={onValueChange} />)
    await user.click(screen.getByRole("tab", { name: /Closed/ }))
    expect(onValueChange).toHaveBeenCalledWith("closed", expect.anything())
    expect(screen.getByRole("tab", { name: /Closed/ })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(screen.getByText("Closed items")).toBeVisible()
  })

  it("selects a tab when its count is clicked", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Inbox onValueChange={onValueChange} />)
    await user.click(screen.getByText("12"))
    expect(onValueChange).toHaveBeenCalledWith("closed", expect.anything())
  })

  it("moves between tabs with the arrow keys", async () => {
    const user = userEvent.setup()
    render(<Inbox />)
    await user.tab()
    expect(screen.getByRole("tab", { name: /Open/ })).toHaveFocus()
    await user.keyboard("{ArrowRight}")
    expect(screen.getByRole("tab", { name: /Closed/ })).toHaveFocus()
  })

  it("does not select a disabled tab", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Inbox onValueChange={onValueChange} />)
    const archived = screen.getByRole("tab", { name: "Archived" })
    expect(archived).toHaveAttribute("aria-disabled", "true")
    await user.click(archived)
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("renders the count as part of the tab's name", () => {
    render(<Inbox />)
    expect(screen.getByRole("tab", { name: "Open 4" })).toBeTruthy()
  })
})
