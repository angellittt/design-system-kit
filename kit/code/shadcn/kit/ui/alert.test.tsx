// design-system-kit 0.5.2 · profile shadcn · kit extension test
import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Alert,
  AlertDescription,
  AlertDismiss,
  AlertTitle,
} from "@/components/ui/alert"

/**
 * Dismiss, urgent and tone are kit extensions, so these cover what they own:
 * emitting onDismiss, labelling the control, *not* hiding itself (the
 * application decides whether a dismissal is remembered), the role, and the
 * tone hook for the styling map.
 */

describe("dismissible alert", () => {
  it("emits onDismiss when the button is clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert tone="cautionary">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDismiss onDismiss={onDismiss} />
      </Alert>
    )
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it("is reachable and operable by keyboard", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert tone="negative">
        <AlertTitle>Something broke</AlertTitle>
        <AlertDismiss onDismiss={onDismiss} />
      </Alert>
    )
    await user.tab()
    expect(screen.getByRole("button", { name: "Dismiss" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it("does not hide itself — the app owns that", async () => {
    const user = userEvent.setup()
    render(
      <Alert tone="info">
        <AlertTitle>Still here</AlertTitle>
        <AlertDismiss onDismiss={() => {}} />
      </Alert>
    )
    await user.click(screen.getByRole("button", { name: "Dismiss" }))
    expect(screen.getByText("Still here")).toBeTruthy()
  })

  it("takes a caller's label for the control", () => {
    render(
      <Alert>
        <AlertTitle>Notice</AlertTitle>
        <AlertDismiss onDismiss={() => {}} label="Dismiss notice" />
      </Alert>
    )
    expect(screen.getByRole("button", { name: "Dismiss notice" })).toBeTruthy()
  })

  it("Escape does not dismiss — an alert is not a dialog", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Alert tone="cautionary">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDismiss onDismiss={onDismiss} />
      </Alert>
    )
    await user.tab()
    await user.keyboard("{Escape}")
    expect(onDismiss).not.toHaveBeenCalled()
  })
})

describe("alert semantics", () => {
  it("is not an alert role by default", () => {
    render(
      <Alert tone="info">
        <AlertTitle>Just information</AlertTitle>
      </Alert>
    )
    expect(screen.queryByRole("alert")).toBeNull()
  })

  it("takes role=alert only when marked urgent", () => {
    render(
      <Alert tone="negative" urgent>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Update the card to continue.</AlertDescription>
      </Alert>
    )
    expect(screen.getByRole("alert")).toBeTruthy()
  })

  it("carries its tone as a data attribute for the styling map", () => {
    const { container } = render(
      <Alert tone="positive">
        <AlertTitle>Saved</AlertTitle>
      </Alert>
    )
    expect(
      container.querySelector('[data-slot="alert"]')?.getAttribute("data-tone")
    ).toBe("positive")
  })

  it("keeps stock's variant API working without a tone", () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Stock call site</AlertTitle>
      </Alert>
    )
    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).not.toBeNull()
    expect(alert).not.toHaveAttribute("data-tone")
  })
})
