// design-system-kit 0.6.1 · profile shadcn · kit extension test
import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

/** `variant` is a kit extension; it must not change how items open. */

function Faq(props: React.ComponentProps<typeof Accordion>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="a">
        <AccordionTrigger>First question</AccordionTrigger>
        <AccordionContent>First answer</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second question</AccordionTrigger>
        <AccordionContent>Second answer</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe.each(["flush", "separated"] as const)("%s accordion", (variant) => {
  it("toggles an item open and closed on click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Faq variant={variant} onValueChange={onValueChange} />)
    const trigger = screen.getByRole("button", { name: "First question" })

    expect(trigger).toHaveAttribute("aria-expanded", "false")
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(onValueChange).toHaveBeenLastCalledWith(["a"], expect.anything())

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
    expect(onValueChange).toHaveBeenLastCalledWith([], expect.anything())
  })

  it("opens from the keyboard", async () => {
    const user = userEvent.setup()
    render(<Faq variant={variant} />)
    await user.tab()
    const trigger = screen.getByRole("button", { name: "First question" })
    expect(trigger).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })

  it("carries its variant for the styling map", () => {
    const { container } = render(<Faq variant={variant} />)
    expect(
      container
        .querySelector('[data-slot="accordion"]')
        ?.getAttribute("data-variant")
    ).toBe(variant)
  })
})

describe("accordion default", () => {
  it("is flush, matching stock's divider rows", () => {
    const { container } = render(<Faq />)
    expect(
      container
        .querySelector('[data-slot="accordion"]')
        ?.getAttribute("data-variant")
    ).toBe("flush")
  })

  it("does not open a disabled item", async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <AccordionItem value="a" disabled>
          <AccordionTrigger>Locked</AccordionTrigger>
          <AccordionContent>Hidden</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    const trigger = screen.getByRole("button", { name: "Locked" })
    expect(trigger).toHaveAttribute("aria-disabled", "true")
    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })
})
