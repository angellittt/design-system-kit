// design-system-kit 0.9.0 · profile shadcn · kit extension test
import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"

import { Avatar, AvatarFallback, initialsOf } from "@/components/ui/avatar"

/** `tone` and `initialsOf` are kit extensions. Avatar has no event props of its own. */

describe("initialsOf", () => {
  it.each([
    ["Ada Lovelace", "AL"],
    ["grace brewster murray hopper", "GB"],
    ["  Alan   Turing  ", "AT"],
    ["Plato", "P"],
    ["", ""],
  ])("%j -> %j", (name, expected) => {
    expect(initialsOf(name)).toBe(expected)
  })
})

describe("avatar tone", () => {
  it("carries its tone for the styling map", () => {
    const { container } = render(
      <Avatar tone="secondary">
        <AvatarFallback>{initialsOf("Ada Lovelace")}</AvatarFallback>
      </Avatar>
    )
    const root = container.querySelector('[data-slot="avatar"]')
    expect(root?.getAttribute("data-tone")).toBe("secondary")
    expect(container.textContent).toBe("AL")
  })

  it("defaults to no tone (stock fallback)", () => {
    const { container } = render(
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    )
    expect(
      container.querySelector('[data-slot="avatar"]')?.hasAttribute("data-tone")
    ).toBe(false)
  })
})
