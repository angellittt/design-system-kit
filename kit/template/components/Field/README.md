# Field

Field wraps a form control with its label, help text and error, wired for accessibility.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (the `FieldError` icon) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Field data-invalid={error ? true : undefined}>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input
    id="email"
    aria-invalid={!!error}
    aria-describedby={error ? "email-error" : "email-help"}
  />
  <FieldDescription id="email-help">We never share it.</FieldDescription>
  {error && <FieldError id="email-error">{error}</FieldError>}
</Field>
```

Every form control sits inside a Field. Use `FieldSet` + `FieldLegend` for groups of radios or checkboxes, `orientation="horizontal"` for settings rows with a Switch, and `FieldContent` for a label and description beside a control.

**Two things Field does not do for you:**

- **Wire `aria-describedby` by hand.** Field generates no ids, so give the `FieldError` (or `FieldDescription`) an id and point the control at it. Nothing warns you if you forget.
- **Move focus on a failed submit.** `FieldError` is announced, but a keyboard user is left on the submit button. Focus the first invalid control yourself.

**Exceptions** — a control may sit outside a Field only if:

1. It has no visible label by design (toolbar search, column filter, inline cell edit) — give it an `aria-label`. A placeholder is never the label.
2. It selects rows in a table or list — `aria-label` naming the row, or "Select all rows".
3. It's part of a composite (Combobox's search, Date Picker's input, Slider thumbs) — the composite itself goes in a Field.
4. It's a third-party embed (payment card fields) — vendor labelling, checked with the accessibility tools.

**Do** write errors as fixes: "Use at least 8 characters", not "Invalid".

**Styling map** — generated from `src/components/ui/field.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | w-full — fixed in code |
| base | — | gap | `space-2` |
| base | invalid=true | text | `status-negative` |
| base | orientation=responsive · [&>.sr-only] | size | w-auto — fixed in code |
| base | orientation=responsive · @md · * | size | w-auto — fixed in code |
| base | orientation=responsive · * | size | w-full — fixed in code |
| base | orientation=vertical · [&>.sr-only] | size | w-auto — fixed in code |
| base | orientation=vertical · * | size | w-full — fixed in code |
| content | — | gap | `space-0.5` |
| content | — | type | leading-snug — fixed in code |
| description | — | text | `label-alternative` |
| description | — | type | font-normal — fixed in code |
| description | — | type | leading-normal — fixed in code |
| description | — | type | text-left — fixed in code |
| description | — | type | text-sm — fixed in code |
| description | [&>a:hover] | text | `primary-normal` |
| description | group-has-data-horizontal | type | text-balance — fixed in code |
| error | — | text | `status-negative` |
| error | — | gap | `space-1` |
| error | — | type | font-normal — fixed in code |
| error | — | type | text-sm — fixed in code |
| group | — | size | w-full — fixed in code |
| group | — | gap | `space-5` |
| group | * · slot=field-group | gap | `space-4` |
| group | slot=checkbox-group | gap | `space-3` |
| label | — | size | w-fit — fixed in code |
| label | — | gap | `space-2` |
| label | — | type | font-medium — fixed in code |
| label | — | type | leading-snug — fixed in code |
| label | — | type | text-sm — fixed in code |
| label | * · slot=field | padding | `space-1` × 2.5 |
| label | dark · has-data-checked | background | `primary-normal` |
| label | dark · has-data-checked | border colour | `primary-normal` |
| label | has-[>[data-slot=field]] | radius | `radius-lg` |
| label | has-[>[data-slot=field]] | size | w-full — fixed in code |
| label | has-[>[data-slot=field]] · has-[:focus-visible] | border colour | `focus-ring` |
| label | has-[>[data-slot=field]] · has-[:focus-visible] | ring | `focus-ring` |
| label | has-[>[data-slot=field]] · not-has-[:disabled,[data-disabled]] · hover | background | `fill-alternative` |
| label | has-data-checked | background | `primary-normal` |
| label | has-data-checked | border colour | `primary-normal` |
| legend | — | type | font-medium — fixed in code |
| legend | variant=label | type | text-sm — fixed in code |
| legend | variant=legend | type | text-base — fixed in code |
| separator | — | size | `space-5` |
| separator | — | type | text-sm — fixed in code |
| separator-content | — | background | `background-normal` |
| separator-content | — | text | `label-alternative` |
| separator-content | — | size | w-fit — fixed in code |
| separator-content | — | padding | `space-2` |
| set | — | gap | `space-4` |
| set | has-[>[data-slot=checkbox-group]] | gap | `space-3` |
| set | has-[>[data-slot=radio-group]] | gap | `space-3` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/field
- Code: `components/ui/field.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - Error icon on `FieldError` — *Error icon* (candidate). Stock renders the message in `status-negative` and nothing else, so an error relies on colour unless each caller remembers an icon. The extension renders the alert icon inside `FieldError` itself.
- Client extensions: none
