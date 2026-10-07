# InputGroup

Input Group puts an icon, button, text or spinner beside a control inside one frame — search boxes, prefixed URLs, a field with a clear button.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<InputGroup>
  <InputGroupAddon><SearchIcon /></InputGroupAddon>
  <InputGroupInput aria-label="Search boards" placeholder="Search boards" />
</InputGroup>

<InputGroup>
  <InputGroupAddon><InputGroupText>example.com/</InputGroupText></InputGroupAddon>
  <InputGroupInput aria-label="Board address" />
  <InputGroupAddon align="inline-end"><InputGroupButton size="xs" onClick={copy}>Copy</InputGroupButton></InputGroupAddon>
</InputGroup>
```

The **group** is the frame: it carries the border, radius and focus treatment, and the control inside is bare — so the focus ring belongs to the whole control. `InputGroupAddon` takes `align`: `inline-start` (default) · `inline-end` · `block-start` · `block-end`. `InputGroupButton` is an action inside the frame, `InputGroupText` a static prefix or suffix, `InputGroupTextarea` the multi-line control.

A search or filter with no visible label is Field exception 1 — give it an `aria-label`. **Don't** put a bare `Input` inside — use `InputGroupInput`, or the frame is drawn twice.

**Styling map** — generated from `src/components/ui/input-group.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | border colour | `line-strong` |
| base | — | radius | `radius-sm` |
| base | — | size | `space-0` |
| base | — | size | `space-8` |
| base | — | size | w-full — fixed in code |
| base | dark | background | `line-strong` |
| base | dark · has-[[data-slot][aria-invalid=true]] | ring | `status-negative` |
| base | dark · has-disabled | background | `line-strong` |
| base | has-[[data-slot][aria-invalid=true]] | border colour | `status-negative` |
| base | has-[[data-slot][aria-invalid=true]] | ring | `status-negative` |
| base | has-[[data-slot=input-group-control]:focus-visible] | border colour | `focus-ring` |
| base | has-[[data-slot=input-group-control]:focus-visible] | ring | `focus-ring` |
| base | has-[>[data-align=block-end]] | size | h-auto — fixed in code |
| base | has-[>[data-align=block-end]] · [&>input] | padding | `space-3` |
| base | has-[>[data-align=block-start]] | size | h-auto — fixed in code |
| base | has-[>[data-align=block-start]] · [&>input] | padding | `space-3` |
| base | has-[>[data-align=inline-end]] · [&>input] | padding | `space-1` × 1.5 |
| base | has-[>[data-align=inline-start]] · [&>input] | padding | `space-1` × 1.5 |
| base | has-[>textarea] | size | h-auto — fixed in code |
| base | has-disabled | background | `line-strong` |
| addon | — | text | `label-alternative` |
| addon | — | size | h-auto — fixed in code |
| addon | — | padding | `space-1` × 1.5 |
| addon | — | gap | `space-2` |
| addon | — | type | font-medium — fixed in code |
| addon | — | type | text-sm — fixed in code |
| addon | [&>kbd] | radius | `radius-xs` |
| addon | [&>svg:not([class*='size-'])] | size | `space-4` |
| addon | align=block-end | size | w-full — fixed in code |
| addon | align=block-end | padding | `space-1` × 2.5 |
| addon | align=block-end | padding | `space-2` |
| addon | align=block-end · [.border-t] | padding | `space-2` |
| addon | align=block-end · group-has-[>input] | padding | `space-2` |
| addon | align=block-start | size | w-full — fixed in code |
| addon | align=block-start | padding | `space-1` × 2.5 |
| addon | align=block-start | padding | `space-2` |
| addon | align=block-start · [.border-b] | padding | `space-2` |
| addon | align=block-start · group-has-[>input] | padding | `space-2` |
| addon | align=inline-end | padding | `space-2` |
| addon | align=inline-start | padding | `space-2` |
| button | — | gap | `space-2` |
| button | — | type | text-sm — fixed in code |
| button | size=icon-sm | size | `space-8` |
| button | size=icon-sm | padding | `space-0` |
| button | size=icon-sm · has-[>svg] | padding | `space-0` |
| button | size=icon-xs | radius | `radius-sm` |
| button | size=icon-xs | size | `space-6` |
| button | size=icon-xs | padding | `space-0` |
| button | size=icon-xs · has-[>svg] | padding | `space-0` |
| button | size=xs | radius | `radius-sm` |
| button | size=xs | size | `space-6` |
| button | size=xs | padding | `space-1` × 1.5 |
| button | size=xs | gap | `space-1` |
| button | size=xs · [&>svg:not([class*='size-'])] | size | `space-1` × 3.5 |
| control | — | border width | border-0 — fixed in code |
| control | — | radius | rounded-none — fixed in code |
| control | — | padding | `space-2` |
| text | — | text | `label-alternative` |
| text | — | gap | `space-2` |
| text | — | type | text-sm — fixed in code |
| text | [&_svg:not([class*='size-'])] | size | `space-4` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/input-group
- Code: `components/ui/input-group.tsx`
- Kit extensions: none
- Client extensions: none
