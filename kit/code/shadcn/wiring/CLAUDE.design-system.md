<!-- design-system-kit 0.10.2 · profile shadcn · wiring: CLAUDE.md design-system section.
     Setup appends this to the repo's CLAUDE.md and fills every {{…}}; Sync keeps it
     current. Commands are written for npm: Setup rewrites them for the repo's package
     manager. Agreed component rules from accepted proposals go under "Component rules".
     Delete this comment when filling. -->

# Design system

**{{CLIENT_NAME}} is the source of truth; shadcn is the scaffolding.** The look
comes from the design system ({{DESIGN_SYSTEM_URL}}): brand rules, the Tailwind
names to build with ("Using in code"), and every component's docs and preview.
If a component renders differently from its preview, fix the port — don't adjust
the CSS to taste. Deviations go to the tracker: {{TRACKER_URL}}.

## Usage rules

- **Use the stock component** from `{{UI_ALIAS}}`. A kit or client extension
  needs a stated reason — a capability stock doesn't offer. Don't fork a
  component to style it.
- **Components are code-owned, tokens are design-owned.** Token changes come
  down from the design system (`/ds-sync pull`); component changes are made
  here and published back (`/ds-sync publish`).
- **Errors pair an icon and a word with colour**, and are written as fixes
  ("Use at least 8 characters", not "Invalid"). Sentence case; no emoji.
- Wrap anything that scales or slides in `motion-safe:`.

{{CLIENT_USAGE_RULES}}

## Styling

- Use **only** the Tailwind names in the design system's "Using in code": every
  semantic token is a utility of the same name (`text-label-strong`,
  `bg-status-positive-soft`); text styles are `{{TYPE_CLASS_PREFIX}}<style>`;
  `p-4` is `space-4`. No hex, no arbitrary colours (`bg-[#…]`), no default
  palette classes (`bg-zinc-…`).
- **Naming clash:** shadcn's `secondary` and `accent` are neutral greys. The
  brand ones are `brand-secondary` and `brand-accent`.
- **Generated, never hand-edited:** `{{TOKENS_OUT}}` and `.ttt/` (the token
  snapshot, the System snapshot, the config). A token change is a design
  change: log a deviation rather than editing a value here.

## Locale defaults

Locale, week start and date format live in `@/lib/locale` ({{CLIENT_NAME}}:
`{{LOCALE}}`, weeks start {{WEEK_START}}, {{DATE_FORMAT_DESCRIPTION}}).
`DatePicker` and `Calendar` default to them; pass a prop to override one
instance. Import a date-fns locale only there, and keep the exports plain
literals. If they disagree with the design system's System section,
`npm run ds:validate` warns and the tests fail (`scripts/ds-drift.test.mjs`):
fix whichever side is out of date.

## Component rules

- **Field:** `Field` → `FieldLabel` → control → `FieldDescription` /
  `FieldError`; `data-invalid` on the Field, `aria-invalid` on the control.
  Wire `aria-describedby` to the error's id by hand, and focus the first invalid
  control on a failed submit — Field does neither.
- **Loading buttons:** spinner, `disabled` and `aria-busy` together —
  `<Button disabled={saving} aria-busy={saving}>{saving && <Spinner />}Save</Button>`.

{{AGREED_COMPONENT_RULES}}

**Superseded by stock — don't reintroduce:** `input.tsx`'s `InputGroup` (use
`input-group.tsx`), `InputMessage` (`FieldDescription` / `FieldError`),
`TableEmpty` (`TableCell colSpan` → `Empty`), Tabs `pill`/`underline`
(`TabsList variant="default" | "line"`), Card `compact` (`size="sm"`).

The design system's inventory says which components exist: `validated` ones are
agreed but not in code yet — don't import them.

## Gotchas already paid for

- **`outline-none` kills focus rings** (Tailwind v4). Focus comes from one
  `:focus-visible` rule in the global CSS.
- **Base UI sets `aria-disabled`, not `disabled`,** on Tabs and Accordion
  triggers — style them with `aria-disabled:`.
- **Renamed event props type-check:** a Radix-style `onSelect` builds and never
  fires; Base UI's is `onClick`. Click it in the browser after primitive changes.
- **Sonner's stylesheet outranks utilities:** anything it sets needs `!` in
  `sonner.tsx`.
- **Next.js:** run `npm run build:safe`, not `build`, beside a dev server
  (both write `.next`). Restart the dev server after changing the Tailwind
  plugin or PostCSS config.
- **`data-slot` stays on the element its classes are applied to** — the styling
  maps read the TSX.
- `@tanstack/react-table` stays on v8 (DataTable); v9 drops `useReactTable`.

## Tooling

The kit's tools run from the design-system-kit Claude Code plugin (`/ds-sync`),
not from this repo. The repo carries one: `scripts/ds-validate.mjs` with
`scripts/ds-drift.test.mjs`, its CI check. Fix kit files in the kit.
