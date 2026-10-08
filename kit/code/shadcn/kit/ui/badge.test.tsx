// design-system-kit 0.10.1 · profile shadcn · kit extension test
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Badge } from "@/components/ui/badge"

/** `tone` is a kit extension; it must leave stock's variants and composition alone. */

describe("badge tone", () => {
  it("carries its tone for the styling map", () => {
    render(<Badge tone="positive">Paid</Badge>)
    expect(screen.getByText("Paid").getAttribute("data-tone")).toBe("positive")
  })

  it("has no data-tone without a tone (stock badge)", () => {
    render(<Badge variant="outline">Draft</Badge>)
    expect(screen.getByText("Draft").hasAttribute("data-tone")).toBe(false)
  })

  it("still fires onClick when rendered as a button", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Badge tone="negative" variant="solid" render={<button type="button" />} onClick={onClick}>
        Remove filter
      </Badge>
    )
    await user.click(screen.getByRole("button", { name: "Remove filter" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
