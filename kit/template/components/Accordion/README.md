# Accordion

Accordion stacks collapsible sections — FAQs, settings groups, long forms split into steps.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`variant="separated"`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Accordion defaultValue={["shipping"]}>
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping</AccordionTrigger>
    <AccordionContent>Orders ship within two working days.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="returns">
    <AccordionTrigger>Returns</AccordionTrigger>
    <AccordionContent>Return any item within 30 days.</AccordionContent>
  </AccordionItem>
</Accordion>
```

One item is open at a time by default; pass `multiple` to let several stay open. Base UI animates the panel height on `--accordion-panel-height`; under reduced motion the height changes instantly. The trigger is a button with `aria-expanded`, and arrow keys move between triggers.

**Don't** hide anything a person needs to finish the task inside a closed item.

**Styling map** — generated from `src/components/ui/accordion.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | w-full — fixed in code |
| content | — | size | h-(--accordion-panel-height) — fixed in code |
| content | — | padding | `space-0` |
| content | — | padding | `space-1` × 2.5 |
| content | — | type | text-sm — fixed in code |
| content | — | easing | `ease-standard` |
| content | [&_a] · hover | text | `label-normal` |
| content | ending-style | size | `space-0` |
| content | starting-style | size | `space-0` |
| trigger | — | radius | `radius-lg` |
| trigger | — | padding | `space-1` × 2.5 |
| trigger | — | type | font-medium — fixed in code |
| trigger | — | type | text-left — fixed in code |
| trigger | — | type | text-sm — fixed in code |
| trigger | ** · slot=accordion-trigger-icon | text | `label-alternative` |
| trigger | ** · slot=accordion-trigger-icon | size | `space-4` |
| trigger | disabled | text | `label-disable` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/accordion
- Code: `components/ui/accordion.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `variant` (`flush` · `separated`) — *Divider rows*. Stock draws divider rows only; `separated` sets each item in its own bordered card for FAQ-style lists where items read as separate answers. `flush` is stock's look and the default, so opting in changes nothing until a screen asks for `separated`.
- Client extensions: none
