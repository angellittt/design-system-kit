// design-system-kit 0.10.2 · profile shadcn · kit extension test
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * `interactive` and `variant` are kit extensions. These check they only add
 * styling: the caller's handlers still fire and stock props still pass through.
 */

describe("interactive card", () => {
  it("still fires the caller's onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Card interactive onClick={onClick} data-testid="card">
        <CardHeader>
          <CardTitle>Project</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>
    )
    await user.click(screen.getByText("Body"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is keyboard operable when the caller makes it a button", async () => {
    const user = userEvent.setup()
    const onKeyDown = vi.fn()
    render(
      <Card interactive role="button" tabIndex={0} onKeyDown={onKeyDown}>
        <CardContent>Open project</CardContent>
      </Card>
    )
    await user.tab()
    expect(screen.getByRole("button", { name: "Open project" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onKeyDown).toHaveBeenCalled()
  })

  it("marks itself for the styling map", () => {
    render(<Card interactive variant="raised" data-testid="card" />)
    const card = screen.getByTestId("card")
    expect(card.getAttribute("data-interactive")).toBe("true")
    expect(card.getAttribute("data-variant")).toBe("raised")
  })

  it("defaults to the stock look: flat, not interactive, stock size", () => {
    render(<Card data-testid="card" />)
    const card = screen.getByTestId("card")
    expect(card.getAttribute("data-variant")).toBe("flat")
    expect(card.hasAttribute("data-interactive")).toBe(false)
    expect(card.getAttribute("data-size")).toBe("default")
  })
})
