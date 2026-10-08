# DatePicker

Date Picker enters a single date or a date range, by picking from a calendar or typing.

> Preview from the kit's code — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field>
  <FieldLabel htmlFor="due">Due date</FieldLabel>
  <DatePicker id="due" value={date} onChange={setDate} />
  <FieldDescription>{hintFor()}</FieldDescription>
</Field>

<DatePicker mode="range" value={range} onChange={setRange} onValidationChange={setError} />
```

- **Modes** single and range. A range uses two inputs; the end can't precede the start.
- **Client settings.** Locale, week start and date format default to the app's `@/lib/locale` (app-owned; the System section records the same decision) — never from a locale imported in the component. A set `dateFormat` overrides the locale's own pattern; otherwise the pattern comes from the locale. Pass `locale` or `dateFormat` to override one instance.
- **Typed input.** The pattern is spelled for people by `hintFor()` — show it as the Field description. Invalid dates set `aria-invalid` and report a message through `onValidationChange`, worded as a fix ("Use MM/DD/YYYY — for example 00/00/0000"); show it as the `FieldError`. Typing updates the calendar; picking updates the input and clears the error. When you set `value` yourself (a form reset), the input shows it at once and drops its error; clear any message you hold from `onValidationChange` too. Overflowing dates (13/40/2026) are rejected rather than rolled forward.
- The calendar opens on the selected month, is keyboard-navigable (arrows, Page Up/Down for months) and is the stock `Calendar`. The date input is Field exception 3 — the picker as a whole goes in a Field.

Stock shadcn has a Calendar but no Date Picker component, only a documented composition of Calendar and Popover. The kit ships that composition as one file, so a project that doesn't opt in has Calendar alone.

**Styling map** — generated from `src/components/ui/date-picker.tsx`, `src/components/ui/calendar.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | gap | `space-2` |
| button | — | border width | border-0 — fixed in code |
| button | — | size | min-w-(--cell-size) — fixed in code |
| button | — | size | size-auto — fixed in code |
| button | — | size | w-full — fixed in code |
| button | — | gap | `space-1` |
| button | — | type | font-normal — fixed in code |
| button | — | type | leading-none — fixed in code |
| button | [&>span] | type | text-xs — fixed in code |
| button | dark · hover | text | `label-normal` |
| button | range-end=true | background | `primary-normal` |
| button | range-end=true | text | `on-primary` |
| button | range-end=true | radius | rounded-(--cell-radius) — fixed in code |
| button | range-end=true | radius | rounded-r-(--cell-radius) — fixed in code |
| button | range-middle=true | background | `fill-alternative` |
| button | range-middle=true | text | `label-normal` |
| button | range-middle=true | radius | rounded-none — fixed in code |
| button | range-start=true | background | `primary-normal` |
| button | range-start=true | text | `on-primary` |
| button | range-start=true | radius | rounded-(--cell-radius) — fixed in code |
| button | range-start=true | radius | rounded-l-(--cell-radius) — fixed in code |
| button | selected-single=true | background | `primary-normal` |
| button | selected-single=true | text | `on-primary` |
| calendar | — | size | `space-4` |
| calendar | — | size | size-(--cell-size) — fixed in code |
| calendar | — | type | text-center — fixed in code |
| calendar-button-next | — | size | size-(--cell-size) — fixed in code |
| calendar-button-next | — | padding | `space-0` |
| calendar-button-previous | — | size | size-(--cell-size) — fixed in code |
| calendar-button-previous | — | padding | `space-0` |
| calendar-caption-label | — | radius | rounded-(--cell-radius) — fixed in code |
| calendar-caption-label | — | gap | `space-1` |
| calendar-caption-label | — | type | font-medium — fixed in code |
| calendar-caption-label | — | type | text-sm — fixed in code |
| calendar-caption-label | [&>svg] | text | `label-alternative` |
| calendar-caption-label | [&>svg] | size | `space-1` × 3.5 |
| calendar-day | — | radius | rounded-(--cell-radius) — fixed in code |
| calendar-day | — | size | h-full — fixed in code |
| calendar-day | — | size | w-full — fixed in code |
| calendar-day | — | padding | `space-0` |
| calendar-day | — | type | text-center — fixed in code |
| calendar-day | [&:first-child[data-selected=true]_button] | radius | rounded-l-(--cell-radius) — fixed in code |
| calendar-day | [&:last-child[data-selected=true]_button] | radius | rounded-r-(--cell-radius) — fixed in code |
| calendar-day | [&:nth-child(2)[data-selected=true]_button] | radius | rounded-l-(--cell-radius) — fixed in code |
| calendar-disabled | — | text | `label-disable` |
| calendar-dropdown | — | background | `background-elevated` |
| calendar-dropdown-root | — | radius | rounded-(--cell-radius) — fixed in code |
| calendar-dropdowns | — | size | h-(--cell-size) — fixed in code |
| calendar-dropdowns | — | size | w-full — fixed in code |
| calendar-dropdowns | — | gap | `space-1` × 1.5 |
| calendar-dropdowns | — | type | font-medium — fixed in code |
| calendar-dropdowns | — | type | text-sm — fixed in code |
| calendar-month | — | size | w-full — fixed in code |
| calendar-month | — | gap | `space-4` |
| calendar-month-caption | — | size | h-(--cell-size) — fixed in code |
| calendar-month-caption | — | size | w-full — fixed in code |
| calendar-month-caption | — | padding | px-(--cell-size) — fixed in code |
| calendar-month-grid | — | size | w-full — fixed in code |
| calendar-months | — | gap | `space-4` |
| calendar-nav | — | size | w-full — fixed in code |
| calendar-nav | — | gap | `space-1` |
| calendar-outside | — | text | `label-alternative` |
| calendar-outside | selected | text | `label-alternative` |
| calendar-range-end | — | background | `fill-alternative` |
| calendar-range-end | — | radius | rounded-r-(--cell-radius) — fixed in code |
| calendar-range-end | after | background | `fill-alternative` |
| calendar-range-end | after | size | `space-4` |
| calendar-range-middle | — | radius | rounded-none — fixed in code |
| calendar-range-start | — | background | `fill-alternative` |
| calendar-range-start | — | radius | rounded-l-(--cell-radius) — fixed in code |
| calendar-range-start | after | background | `fill-alternative` |
| calendar-range-start | after | size | `space-4` |
| calendar-root | — | size | w-fit — fixed in code |
| calendar-today | — | background | `fill-alternative` |
| calendar-today | — | text | `label-normal` |
| calendar-today | — | radius | rounded-(--cell-radius) — fixed in code |
| calendar-today | selected=true | radius | rounded-none — fixed in code |
| calendar-week | — | size | w-full — fixed in code |
| calendar-week-number | — | text | `label-alternative` |
| calendar-week-number | — | type | text-[0.8rem] — fixed in code |
| calendar-week-number-header | — | size | w-(--cell-size) — fixed in code |
| calendar-weekday | — | text | `label-alternative` |
| calendar-weekday | — | radius | rounded-(--cell-radius) — fixed in code |
| calendar-weekday | — | type | font-normal — fixed in code |
| calendar-weekday | — | type | text-[0.8rem] — fixed in code |
| day-picker | — | sets --cell-radius | `radius-md` |
| day-picker | — | background | `background-normal` |
| day-picker | — | padding | `space-2` |
| popover-content | — | size | w-auto — fixed in code |
| popover-content | — | padding | `space-2` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn Calendar + Popover (documented composition) + kit typed input
- Code: `components/ui/` date-picker.tsx, calendar.tsx (date-picker.tsx is a kit file; calendar.tsx is stock)
- Kit extensions: opt-in, chosen at the design review:
  - The whole component, with *Typed date entry* (candidate) — stock is a calendar in a popover and nothing else, so a date two years out costs a dozen clicks, and screens that add typing re-implement the parse, the format hint and the error wording, each slightly differently. The extension owns all three, takes the pattern from the client's settings rather than hardcoding one, and round-trips the parse. `typed={false}` leaves the calendar button alone.
- Client extensions: none
