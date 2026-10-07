# Sheet

Sheet slides a panel in from an edge for record details, filters or edit forms without leaving the page.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Filters</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Narrow the list by status and owner.</SheetDescription>
    </SheetHeader>
    …
    <SheetFooter><SheetClose render={<Button />}>Apply</SheetClose></SheetFooter>
  </SheetContent>
</Sheet>
```

`side` `top` · `right` · `bottom` · `left`; width is set per use with a class. Focus is trapped while open, Escape closes it, and focus returns to the trigger. The slide is reduced-motion safe. Installed with Sidebar and documented here for direct use.

**Styling map** — generated from `src/components/ui/sheet.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | shadow | `shadow-lg` |
| content | — | gap | `space-4` |
| content | — | type | text-sm — fixed in code |
| content | side=bottom | size | h-auto — fixed in code |
| content | side=left | size | h-full — fixed in code |
| content | side=left | size | w-3/4 — fixed in code |
| content | side=left · sm | size | max-w-sm — fixed in code |
| content | side=right | size | h-full — fixed in code |
| content | side=right | size | w-3/4 — fixed in code |
| content | side=right · sm | size | max-w-sm — fixed in code |
| content | side=top | size | h-auto — fixed in code |
| description | — | text | `label-alternative` |
| description | — | type | text-sm — fixed in code |
| footer | — | padding | `space-4` |
| footer | — | gap | `space-2` |
| header | — | padding | `space-4` |
| header | — | gap | `space-0.5` |
| overlay | — | background | `material-dimmer` |
| title | — | text | `label-normal` |
| title | — | type | font-heading — fixed in code |
| title | — | type | font-medium — fixed in code |
| title | — | type | text-base — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/sheet
- Code: `components/ui/sheet.tsx`
- Kit extensions: none
- Client extensions: none
