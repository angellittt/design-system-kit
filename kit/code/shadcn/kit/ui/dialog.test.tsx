// design-system-kit 0.9.0 · profile shadcn · kit extension test
import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

/** `size` is a kit extension; it must not change how the dialog opens or closes. */

function Example({
  size,
  onOpenChange,
}: {
  size?: "sm" | "default" | "lg"
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogContent size={size}>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>Change how the app behaves.</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

describe.each(["sm", "default", "lg"] as const)("%s dialog", (size) => {
  it("opens from its trigger and carries data-size", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Example size={size} onOpenChange={onOpenChange} />)
    await user.click(screen.getByRole("button", { name: "Open settings" }))
    const dialog = await screen.findByRole("dialog", { name: "Settings" })
    expect(onOpenChange).toHaveBeenLastCalledWith(true, expect.anything())
    expect(dialog.getAttribute("data-size")).toBe(size)
  })

  it("closes from the close button", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Example size={size} onOpenChange={onOpenChange} />)
    await user.click(screen.getByRole("button", { name: "Open settings" }))
    await screen.findByRole("dialog")
    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything())
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  it("closes on Escape", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Example size={size} onOpenChange={onOpenChange} />)
    await user.click(screen.getByRole("button", { name: "Open settings" }))
    await screen.findByRole("dialog")
    await user.keyboard("{Escape}")
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything())
  })
})

describe("dialog default size", () => {
  it("is default when no size is passed", async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole("button", { name: "Open settings" }))
    const dialog = await screen.findByRole("dialog")
    expect(dialog.getAttribute("data-size")).toBe("default")
  })
})
