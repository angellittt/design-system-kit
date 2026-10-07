# Jelly → kit classification

Every difference between Jelly (`angellittt/design-team-demo` @ `38601d3`) and stock shadcn `base-nova`, plus Jelly's scripts, wiring and tests, labelled with the contract's layers. Nothing moves until the **Needs a decision** table is answered.

**Layers** — **baseline**: any client would want it (bug, accessibility gap, stock gap, wiring to tokens); goes into `kit/code/shadcn/stock`. **kit extension**: opt-in capability; goes into `kit/code/shadcn/kit`. **client**: stays in Jelly. **kit file**: a script, wiring or harness file that is generic and goes to the kit (with the fix named, if any). **none**: not a Jelly change — the shadcn CLI's install rewrite, or Jelly carrying older stock code. The kit takes today's stock for these.

**How stock was read.** Stock is `https://ui.shadcn.com/r/styles/base-nova/<name>.json`, fetched 2026-10-07. The registry is not versioned, so this is today's stock, not stock at the profile's pinned CLI version (see Gaps in the PR). Provenance was checked with `git log --follow -p` per file: Table, Sonner and Textarea match today's registry at their first commit, so drift is small. Most other files were hand-merged onto older radix-era files in `a92d0b0`, so where Jelly lacks a class that stock has, the kit keeps stock's either way.

**Rule used throughout:** Jelly's measurements (44px controls, the 48/40/32/24 button scale, 22px checkbox and radio, sidebar 248px, all `duration-[…ms]` timings, `font-[650]`, `text-[13px]`/`[15px]`, tracking values) are **client**, because new projects start from stock base-nova sizes.

## Classification

| Component or file | Difference | Layer | Reason |
|---|---|---|---|
| **All components** | `@/registry/base-nova/…` → `@/components/ui/…` imports; `IconPlaceholder` → lucide icons; `cn-*` marker classes (`cn-menu-target`, `cn-font-heading`, `cn-rtl-flip`, `cn-calendar-*`, `cn-toast`) absent | none | shadcn CLI install rewrite (icon library `lucide`, aliases) |
| All components | JSDoc and inline comments naming Jelly or brand colours ("Jelly Dialog", "3px Tomato bar", "turns Mustard", "Ghost White") | client | Documents Jelly's choices |
| All popups (DropdownMenu, Select, Popover, Tooltip, AlertDialog, Dialog, Sheet) | Open/close animations wrapped in `motion-safe:` | baseline | Contract's reduced-motion rule. Combobox was missed; the kit adds it there too |
| Skeleton · Progress | `animate-pulse` → `motion-safe:animate-pulse`; indicator `transition-all` → `motion-safe:transition-all` | baseline | Reduced-motion rule |
| Spinner | `motion-reduce:[animation-duration:2.4s]` | baseline | Contract's loading-indicator exception: keep turning, slowed |
| Button · Checkbox · Switch · RadioGroup · Slider · Tabs · Badge · Accordion · Sidebar MenuButton · Select trigger | Removed `outline-none` and `focus-visible:ring-*` / `border-ring` utilities, plus `group-has-[:focus-visible]/field-label:*`, in favour of the single global `:focus-visible` rule; inset `-outline-offset-2` where a parent clips (Accordion trigger, TableRow) | baseline | Profile's Focus rule; `outline-none` breaks the outline in Tailwind v4 (CLAUDE.md gotcha) |
| Dialog · AlertDialog | Overlay `bg-black/10` → `bg-dimmer` | baseline | Literal colour → `material-dimmer` token |
| Dialog · AlertDialog | `supports-backdrop-filter:backdrop-blur-xs` removed | client | "Jelly dims, does not blur" |
| DropdownMenu · Select · Popover · Combobox · Card | Hairline `ring-1 ring-foreground/10` → `border border-border` | baseline | Foreground-at-10% literal → `line-normal` token |
| Tooltip | `bg-foreground text-background` (+ arrow) → `bg-inverse text-inverse-foreground` | baseline | Template's `inverse-background` role ("tooltips, toasts and other inverse chips") |
| Slider | Thumb `bg-white` → `bg-background` | baseline | Literal → token |
| Button | `link` variant `text-primary` → `text-primary-text` | baseline | Template's text-safe role for primary-coloured text (4.5:1) |
| Accordion | Panel uses `h-(--accordion-panel-height) transition-[height] data-starting-style:h-0 data-ending-style:h-0` instead of `animate-accordion-down/up` | baseline | tw-animate's accordion keyframes read a Radix variable and do nothing under Base UI (profile, Animations) |
| Accordion | `"use client"` added | baseline | Explicit client boundary; harmless |
| Tabs · Accordion | `disabled:pointer-events-none disabled:opacity-50` → `disabled:cursor-not-allowed disabled:text-label-disable` | baseline (fixed) | Intent is baseline, but `disabled:` never matches: Base UI sets `aria-disabled`. Kit uses `aria-disabled:` with the token |
| DropdownMenu | SubContent `side="right"` → `side="inline-end"` | baseline | Submenus open on the correct side in RTL. Jelly also dropped the chevron's RTL flip; the kit keeps stock's |
| Popover | `PopoverClose` wrapper exported | baseline | Stock gap: Base UI ships `Popover.Close`; base-nova doesn't wrap it |
| Dialog | Popup `max-h-[calc(100vh-2*--spacing(5))] overflow-auto` | baseline | Stock gap: tall content runs off-screen with no scroll |
| Dialog | DialogHeader `pr-10` | baseline | Stock gap: long title runs under the close button |
| Sidebar | Mobile Sheet `data-[side=left]:w-(--sidebar-width) data-[side=right]:w-(--sidebar-width)` | baseline | Stock bug: Sheet's `data-[side]:w-3/4` beats the width class, so `SIDEBAR_WIDTH_MOBILE` is ignored |
| Checkbox | Renders `<Minus>` and `data-indeterminate:bg-primary` when indeterminate | baseline | Stock gap: indeterminate shows a tick and no fill |
| Slider | Control gets `data-slot="slider-control"` | baseline | Stock gap: every part carries a `data-slot` (styling maps key on it) |
| Input | Props type `React.ComponentProps<"input">` → `React.ComponentProps<typeof InputPrimitive>` | baseline | Types match the Base UI primitive actually rendered |
| Pagination · Breadcrumb | `aria-label` `"pagination"`/`"breadcrumb"` → `"Pagination"`/`"Breadcrumb"` | baseline | Accessible names in sentence case |
| Breadcrumb | Link `rounded-xs` | baseline | Gives the global focus outline a rounded shape |
| Table | `containerClassName` prop on the scroll wrapper | baseline | Stock gap: the scroll container can't be styled |
| Table | TableRow `hover:bg-muted/50` → `hover:bg-accent` | baseline | Profile maps `accent` to the hover highlight (`fill-alternative`); stock uses a translucent literal |
| Alert | AlertDescription `group-has-[>svg]/alert:col-start-2` | baseline | Pins description to the text column when an icon is present |
| Calendar | `locale` defaults to `dsLocale`; new `weekStartsOn` defaults to `dsWeekStartsOn` (`@/lib/ds-settings`) | baseline | Wires stock to the contract's client settings |
| Calendar | `disabled` `text-muted-foreground opacity-50` → `text-label-disable opacity-100` | baseline | Disabled role token instead of an opacity hack |
| DatePicker | `defaultMonth` follows the typed or selected value | baseline | Bug fix: the documented composition opens on today's month |
| DatePicker | `locale` default from `dsLocale` in `DatePicker`, `patternFor`, `hintFor`, `parseTyped` | baseline (fixed) | Reads client settings; but ignores `settings.dateFormat`, which the contract says overrides the locale pattern. Kit fixes this |
| Table | `density` prop (`comfortable`/`compact`), `data-density`, `group/table` | kit extension | Profile: Row density |
| Table | `TableSortButton` | kit extension | Profile: Sortable header. Its `duration-[220ms]` becomes a duration token |
| Tabs | `TabsCount` companion part | kit extension | Profile: Count pill |
| Card | `variant` `raised`/`flat` (cva, `data-variant`) | kit extension | Profile: Raised / flat |
| Card | `interactive` prop: pointer, `motion-safe:` lift and press | kit extension | Profile: Hover lift |
| Dialog | `size` prop (`sm`/`default`/`lg`, cva, `data-size`) | kit extension | Profile: Width presets |
| Accordion | `variant` prop `separated`/`flush`; flush rows `border-b` | kit extension | Profile: Divider rows. Kit uses stock's `not-last:border-b` |
| Badge | `tone` axis (neutral/primary/secondary/accent/positive/negative via `--t-*`) with `soft`/`solid`; `data-tone` plumbing | kit extension | Profile: Semantic colour. Kit keeps stock's `variant` values alongside |
| Avatar | `tone` prop (`avatarVariants`, `--t-solid`/`--t-on`, `data-tone`) | kit extension | Profile: Semantic colour |
| Avatar | `initialsOf()` helper | kit extension | Profile: Initials |
| Alert | `urgent` prop; `role="alert"` only when urgent | kit extension | Profile: Urgent-only interruption (candidate) |
| Alert | `AlertDismiss` (ghost icon Button, overridable `aria-label`, emits `onDismiss`, never hides itself) | kit extension | Profile: Dismiss button (candidate). Its `hover:bg-black/5` is client (breaks the guardrail); kit uses a token |
| Field | FieldError renders `<CircleAlert aria-hidden>` before the message | kit extension | Profile: Error icon (candidate) |
| DatePicker | Typed entry: `patternFor`/`hintFor`, `parseTyped` with overflow rejection, typed `Input`s with two-way sync, `aria-invalid`, `onValidationChange`, range end-before-start rule, `typed` opt-out, `strings` overrides | kit extension | Profile: Typed date entry (candidate) |
| DatePicker | `PopoverContent width="auto" showArrow={false}` | client | Depends on Jelly-only Popover props; kit uses `className` |
| Badge | `variant="pop"` and neutral+pop compound | client | Declared Jelly client extension |
| Card | `variant="pop"` and its interactive compound | client | Declared Jelly client extension |
| Badge · Avatar · Alert | Tone values: positive → `secondary-soft`, negative → `primary-soft`, info → `brand-secondary-soft`; brand solids with `on-primary` ink; default Avatar `tone="primary"` | client | Status reuses brand ramps; one ink. Kit uses `status-*-soft` and a neutral default |
| Badge | Stock `default`/`secondary`/`destructive`/`outline`/`ghost`/`link` variants and `[a]:hover:*` removed; `aria-invalid:*` removed | client | Jelly's API replaces stock's; kit keeps stock's variants |
| Badge | `h-6 px-3 rounded-full font-[650] tracking-[0.0252em]`; icon padding rules removed | client | Jelly's 24px pill |
| Button | `border-2`, `font-[650] tracking-[0.0145em]`, radius moved to sizes, `gap-2` on base | client | Jelly type, border and radius |
| Button | Sizes `h-6/8/10/12`, `rounded-sm`/`rounded-md`, `text-[11px]/[13px]/sm/base`; icon-size padding and button-group rounding removed | client | Jelly's 48/40/32/24 scale |
| Button | `icon*` sizes `size-6/8/10/12 rounded-full`, `motion-safe:hover:rotate-[-8deg] hover:scale-[1.06] active:scale-[.9]`; default×icon compound | client | Round tilting icon buttons |
| Button | `default`: `border-line-pop shadow-pop-sm`, hover lift and press-flat | client | Ink sticker with offset shadow |
| Button | `transition-[…] motion-safe:duration-[220ms] ease-expressive`; `active:scale-[.96]` replaces stock `active:translate-y-px` | client | Squish easing and press personality |
| Button | Disabled `bg-muted text-label-disable` instead of `opacity-50` | client | Different disabled look |
| Button | `aria-invalid:*` and `aria-expanded:*` removed; secondary/outline/ghost/destructive hovers restyled | client | Restyle. Kit keeps stock's invalid and open states |
| Button | `destructive` outlined with `hover:bg-primary-soft` | client | Correct only because Jelly's negative is Tomato |
| Checkbox · RadioGroup | 22px controls, `border-[1.5px] bg-background`, ink checked border, ink dot, squish press, pop-in indicator, filled disabled look, invalid ring removed | client | Jelly measurements and personality |
| RadioGroup | `grid gap-2` → `flex flex-col gap-3`; `data-horizontal:*` classes | client | Jelly spacing. The horizontal classes are dead code (Base UI emits no orientation) |
| Switch | 48×28 / 38×22, `bg-brand-secondary` + ink inset, stretchy absolute thumb, `opacity-45` disabled | client | Pacific fill and Jelly personality |
| Switch | All `aria-invalid:*` removed | client | Jelly drop (likely accidental). Kit keeps stock's |
| Slider | `h-6` control, 8px `bg-secondary` track, 24px ink thumb with pop shadow and squash, `opacity-45`; thumb hit-area `after:-inset-2` dropped | client | Jelly measurements and personality |
| Progress | `h-2 bg-secondary` track, `bg-brand-secondary` indicator, 360ms expressive, mono value | client | Pacific bar, Jelly type |
| Input · Textarea · InputGroup | `h-11`, `rounded-sm`, `border-[1.5px]`, `bg-background`, `text-[15px]`, hover border, `shadow-[0_0_0_3px_var(--secondary-soft)]` focus glow, primary-soft invalid glow, filled disabled look, `file:h-6` removed | client | Jelly's 44px field and Pacific glow. Note `text-[15px]` makes iOS zoom on focus |
| InputGroup | InputGroupInput `h-full` and border/shadow resets; addon `pl-3`/`pr-3` | client | Only needed to undo Jelly Input's frame |
| Combobox | Chips `min-h-11 border-[1.5px] bg-background rounded-sm`, glow focus, pill chips, `h-10` items, `p-1` popup | client | Declared: Combobox keeps Input's `radius-sm`; 44px control. The extra `p-1` doubles stock's list padding |
| Select | `size` prop removed; trigger `h-11 w-full min-w-[200px] border-[1.5px] bg-background text-[15px]`, hover border, filled disabled, border-only invalid | client | Jelly's 44px control |
| Select | Chevron rotates on open (`motion-safe`, 220ms expressive); `alignItemWithTrigger` → `false`; `sideOffset` 6; `h-10` items with inline indicator; selected item `font-[650] text-primary-text`; uppercase 11px label; `select-viewport` slot | client | Jelly look and behaviour |
| Select · DropdownMenu | Popup `overflow-y-auto` → `overflow-hidden` | client | Jelly change; regresses long menus (they can't scroll) |
| DropdownMenu | `h-9 px-3` items, `cursor-pointer`, quiet leading icon, forced `[&_svg]:size-4`, left-side indicators, uppercase label, `mx-2` separator, mono shortcut, `min-w-[200px]`, `sideOffset` 6 | client | Jelly measurements and look |
| DropdownMenu | `inset` prop removed from items and labels | client | Follows Jelly's left indicators. Kit keeps stock's |
| DropdownMenu | Destructive `focus:bg-primary-soft` | client | Status reuses the brand ramp. Kit keeps stock's destructive tint |
| DropdownMenu · Select · Popover · Combobox · AlertDialog | `duration-100` removed; `ease-expressive` on open; `slide-in-from-*` removed | client | Squish easing; zoom-and-fade only |
| Popover | `width` prop (default 280), viewport clamp, `p-4`, title row with close, `font-[650]` title, `sideOffset` 8 | client | Jelly measurements |
| Tooltip | `delay` 200, `sideOffset` 8, `max-w-60`, `py-2 text-[13px] font-medium`, `shadow-md`; Kbd-in-tooltip rules removed; `fade-in-0` dropped from delayed-open | client | Jelly timing and chip look. Kit keeps Kbd support |
| AlertDialog | `ring-1` → `shadow-xl`; `gap-3 p-6`, 420/360px widths | client | "Quieter than Dialog" elevation, Jelly measurements |
| Dialog | `border-2 border-line-pop shadow-pop-md`; `gap-3 p-6`; 360/480/640px size values; 360ms expressive; display-face `text-2xl` title; `text-[15px]` description; footer band, `showCloseButton` and link styling removed | client | Ink pop, Jelly measurements and type |
| Accordion | `separated` default: `rounded-lg border bg-card`, open `border-2 border-line-pop shadow-pop-sm`; rotating chevron chip turning `bg-brand-accent`; `px-5 py-4` padding; Tomato hover; 360ms expressive; `text-[15px]` panel; link and paragraph styling removed | client | Brand personality |
| Tabs | Pill list `rounded-full bg-secondary p-1`; trigger heights, weight, Tomato 3px underline springing in; TabsCount `text-[11px] font-bold`, Tomato when active; `text-[15px]` panel | client | Brand look |
| Tabs | Vertical orientation and icon-in-tab handling removed | client | Jelly uses neither. Kit keeps stock's |
| Card | `rounded-lg` (stock `rounded-xl`); spacing 6/4; root `p-(--card-spacing)` padding model (drops edge-to-edge images and footer band); `text-[18px]` title, `text-[15px]` description; 220ms expressive | client | Jelly look and measurements |
| Avatar | `size-7/10/14`; root clip with `border-2 border-line-pop`; display-face initials; AvatarGroupCount restyle | client | Jelly sizes and ink ring. Root clipping also clips AvatarBadge; kit keeps stock's |
| Table | Bordered elevated container; per-cell borders; sticky `bg-sidebar` header with `text-xs font-semibold`; footer `bg-sidebar`; `52/40px` density values; `mono` cell prop; caption styling removed | client | Jelly table look |
| Table | Selected (`data-[state=selected]`) and expanded row states removed; checkbox-column `pr-0` and cell `whitespace-nowrap` removed | client | Jelly drops, unneeded. Kit keeps stock's |
| Sonner | Inverse-chip toast via `--inverse-*` and `!` utilities; 5000ms; Jelly icon set at 18px (warning and error share `CircleAlert`); Tomato action button with squish; inverse-tone icon colours | client | Jelly toast look. The `!`-override technique goes in the profile as a gotcha |
| Calendar | Outlined `today` in `primary-text`; range middle `bg-primary-soft` | client | Look change from stock |
| Calendar | DayButton `rounded-(--cell-radius)` and rotate/scale resets | client | Only because Jelly's icon buttons are round and tilt (declared) |
| Sidebar | Width 248px; MenuButton `gap-3 p-3 h-11`, `size-[18px]` icons, `font-semibold`, elevated active pill; collapse-width transition removed | client | Jelly measurements |
| Pagination | Active link `secondary`; `rounded-md!` | client | Only needed because icon buttons are round |
| Breadcrumb · Empty · Label · Field · Progress | `font-semibold` page/title/label, `text-xs` captions, tracking values, Empty `rounded-lg` and `text-label-assistive` icon | client | Jelly type |
| Separator | JSDoc only | client | Comment only |
| Spinner | JSX collapsed onto one line | client | Formatting |
| Button | `data-variant` / `data-size` attributes | none | Radix-era stock holdover |
| Sheet | tw-animate `slide-in-from-*` instead of Base UI `data-starting-style` transitions; reflowed signatures | none | Older stock carried over. Kit takes today's, keeping the `motion-safe:` guard |
| Slider | `"use client"`, `React.useMemo` on values, `absolute` indicator, prop order | none | Radix-era stock holdover |
| Tabs · Accordion · Dialog · Card | Stock now has `aria-disabled:` states and `cn-font-heading`, which Jelly lacks | none | Added to the registry after install |
| Tooltip · Avatar · Checkbox · InputGroup | Jelly lacks: Tooltip arrow `translate-y-[calc(-50%-2px)]`; AvatarBadge `bg-blend-color`; Checkbox `group-has-disabled/field:opacity-50`; InputGroup `in-data-[slot=combobox-content]:*` | none | Either drift or a Jelly drop; the kit takes today's stock either way |
| **scripts/ds-tokens.mjs** | Whole script: config-driven paths, ramps, scales, motion and type read from the snapshot, the shadcn mapping table | kit file | No brand names in code |
| scripts/ds-tokens.mjs | `ALIAS_COLORS` maps `brand-secondary-foreground` and `brand-accent-foreground` to `on-primary` | client | Jelly's single ink. Kit maps them to `on-secondary`/`on-accent` per the profile; the template has both tokens |
| scripts/ds-tokens.mjs | Doesn't emit Tailwind's spacing base from `space-1`, or the profile's `positive`/`cautionary`/`negative` (+`-soft`) names | kit file (fixed) | The profile says the generator does both. Jelly's `space-1` is 4px, so its spacing is unaffected |
| scripts/ds-pack-react.mjs | Whole script; reads the lockfile | kit file | Generic |
| scripts/ds-build-bundle.mjs | Whole script; namespace, aliases and paths from config; `PINS` | kit file | Generic; pins are the profile's tested range |
| scripts/ds-styling-maps.mjs | Whole script | kit file | Generic. Comment example `var(--line-pop)` gets a neutral token. tsconfig comment stripping uses a line regex; kit shares `readJsonc` from the builder |
| scripts/ds-types.mjs | Whole script | kit file | Generic. Comment "(Jelly: sonner's `toast`)" reworded; same `readJsonc` fix |
| scripts/__fixtures__/ | `run.mjs` and the `minimal/` Acme repo | kit file | Generic by design. The "didn't leak this repo's tokens" assertion names `jl-t-`; kit asserts a neutral sentinel instead |
| src/styles/globals.css | Tailwind + tw-animate + `shadcn/tailwind.css` imports, `@source`, token-file import, `dark` custom variant on `[data-theme="dark"]`, base layer | kit file | Theme block wiring. `@source` path depends on where the CSS lives (adaptable) |
| src/styles/globals.css | `:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px }` | kit file | Profile's Focus rule. Comment "Jelly focus" reworded |
| src/components/theme-provider.tsx | next-themes with `attribute="data-theme"`, system default, `disableTransitionOnChange` | kit file | Profile's Theme switching. Comment names Jelly |
| src/app/layout.tsx | `next/font` loading Bricolage Grotesque, Figtree, JetBrains Mono as `--font-display/sans/mono` | client | The fonts are Jelly's. The variable pattern is in the profile; the kit documents it, doesn't ship a layout |
| src/lib/ds-settings.ts | Reads `settings`, exports `dsLocale`, `dsLocaleTag`, `dsWeekStartsOn`, `dsDateFormat`, fails loudly on an unregistered locale | kit file | Generic. Kit ships it as a template: `LOCALES` holds `en-US` and Setup adds the client's locale. The `../../.ttt` import assumes `src/lib` (adaptable) |
| src/lib/ds-settings.ts | `LOCALES = { "en-US": enUS }` | client | Jelly's locale registry |
| .ttt/design-system.json | Keys: `designSystem`, `tracker`, `schema`, `profile`, `tokensIn`, `tokensOut`, `lastSynced`, `typeClassPrefix`, `settings`, `namespace`, `bundleExtras`, `componentFiles` | kit file | Template with placeholders, plus a new `kitVersion` key |
| .ttt/design-system.json | Values: links, `namespace: "Jelly"`, `typeClassPrefix: "jl-t-"`, settings, `componentFiles` | client | Jelly's values |
| CLAUDE.md · Project Context, Stack | Jelly demo description and stack bullets | client | Repo-specific |
| CLAUDE.md · DS intro | "Jelly is the source of truth; shadcn is the scaffolding", links, connection | kit file | Template with `{{CLIENT_NAME}}` and link placeholders |
| CLAUDE.md · Usage rules | Use the stock component; components code-owned, tokens design-owned; sentence case, no emoji; `motion-safe:` | kit file | Contract rules and TTT defaults |
| CLAUDE.md · Usage rules | "One pop per view"; "Ink on colour" | client | Jelly brand rules. The template's generic "one brand moment per view" covers the first |
| CLAUDE.md · Usage rules | "Errors pair an icon and a word with colour" | kit file | Generic accessibility rule. Jelly's reason ("negative is red like the brand") is dropped |
| CLAUDE.md · Tokens, Styling guardrails | Generated-file table, regenerate command, naming clash, every semantic token as a utility, motion tokens; no hex, arbitrary colours or palette classes | kit file | Profile restated with paths from config |
| CLAUDE.md · Client settings | Settings live in config, read only via `@/lib/ds-settings`, don't import a date-fns locale in a component | kit file | Generic mechanism; Jelly's values become placeholders |
| CLAUDE.md · Replaced by stock | InputGroup/InputGroupIcon, InputMessage, TableEmpty → stock replacements | kit file | The kit's own superseded extensions; any project might reach for them |
| CLAUDE.md · Replaced by stock | "Input's `size` prop went with them… every Input is 44px now" | client | Jelly measurement |
| CLAUDE.md · Component inventory, Gotchas, Publish-back tooling | Inventory authority; `outline-none`, Sonner `!`, `build:safe`, postcss restart, TanStack v8, `@source`, source detection; five-script table, maintenance commitment, fixture | kit file | Generic |
| CLAUDE.md · History | `docs/shadcn-migration.md`, `v0-poc` tag | client | Jelly's history |
| package.json | `ds:*`, `test`, `test:watch`, `typecheck`, `build:safe` scripts | kit file | Generic; part of the wiring template |
| package.json | `"lint": "next lint"`; no ESLint config in the repo | client | Deprecated per the profile. The kit adds a flat config with accessibility rules (new) |
| vitest.config.ts · src/test/setup.ts | jsdom, `@` alias, `cn` alias, jest-dom setup, `src/**/*.test.tsx` | kit file | Harness. Paths are adaptable |
| src/components/ui/alert.test.tsx | Dismiss, urgent role, `data-tone` | kit extension | Tests for the Alert extensions; no Jelly values |
| src/components/ui/date-picker.test.tsx | Pattern and hint per locale, parsing, overflow, validation, range rules | kit extension | Tests for typed date entry; needs a `settings` fixture because the import pulls in `ds-settings` |
| .claude/launch.json · docs/shadcn-migration.md | Dev-server launch config; migration notes | client | Repo-specific |

## Needs a decision

| # | Component or file | Difference | Options | Leaning |
|---|---|---|---|---|
| D1 | Select, Input, Button, DropdownMenu, Combobox items | **Radius roles.** Under the profile mapping, stock's `rounded-lg` is `radius-lg` (12px in the template), and stock puts it on inputs, buttons, select triggers and menu items alike. The template's usage text gives each control a role: `radius-sm` for text fields and menu items, `radius-md` for buttons, select triggers and tooltips, `radius-lg` for popovers and menus, and `radius-inset` for nested items. Jelly applies these roles: Select `rounded-md`, Input `rounded-sm`, menu items `rounded-inset`. | (a) Baseline: the kit's stock applies the template's radius roles. (b) Client: the kit leaves stock's classes and fixes the template's usage text instead. | (a). It wires stock to tokens as the template defines them; otherwise every control renders at 12px. |
| D2 | Select, Input, Textarea placeholder · Popover, Card description | **Label roles.** Stock uses `muted-foreground` (= `label-alternative`) for placeholders and descriptions. The template's usage text says placeholders are `label-assistive` and descriptions are `label-neutral`. Jelly applies these roles. | (a) Baseline: apply the template's roles. (b) Client: keep stock's names. | (a), for the same reason as D1. |
| D3 | 12 places (InputGroup addon, Breadcrumb list, Field/Empty/Dialog description, Combobox chevron, DropdownMenu shortcut, Select chevron, …) | **Same-token renames**, e.g. `text-muted-foreground` → `text-label-alternative`, `bg-popover` → `bg-card`, dropping `focus:text-accent-foreground`. Under the mapping, each resolves to the same token, so nothing renders differently. | (a) Baseline: rename to the semantic name. (b) None: the kit keeps stock's names. | (b). It's churn that makes every future stock update conflict. |
| D4 | Tabs | **Pill/underline `variant` on the root.** The profile lists it as a kit extension, but stock `TabsList variant="default" \| "line"` already gives segmented and underline tabs. | (a) Superseded by stock: drop the extension from the profile and keep `TabsCount` only. (b) Keep it as a kit extension. | (a), per "superseded by stock". |
| D5 | Card | **"Compact"** is in the profile's Card row, but stock Card already ships `size="sm"`. | (a) Superseded by stock: remove "compact" from the profile row. (b) Keep it. | (a). |
| D6 | Alert | **`tone` replaces stock's `variant`** (`default`/`destructive`), so stock call sites break. The profile's Semantic colour row lists Badge and Avatar but not Alert. | (a) Kit extension: add Alert to the row; `tone` sits alongside stock `variant`. (b) Client. | (a). The dismiss and urgent tests already assume it. |
| D7 | Table | **`data-[clickable]:cursor-pointer`** on TableRow, an opt-in clickable-row affordance. It isn't in the profile. | (a) Kit extension (candidate): add it to the profile table. (b) Client. | (a). |
| D8 | Popover | **`showArrow` prop** (default on in Jelly). The code calls it a kit extension, but the profile doesn't list it. | (a) Kit extension (candidate, default off). (b) Client. | (b). It's a look choice, and stock Popover has no arrow. |
| D9 | DropdownMenu, Popover, Tooltip | **Ad-hoc z-index** (`z-55` menus and popover, `z-60` tooltip). Select and Combobox stay at `z-50`. No z-index token exists. | (a) Baseline: a popup-above-dialog stacking fix, which needs a z-index scale in the profile. (b) Client. | (b), unless you know of a stacking bug it fixed. |
| D10 | Sonner | **`theme` from `resolvedTheme`** rather than stock's `theme ?? "system"`. | (a) Baseline: it fixes a mismatch with `data-theme`. (b) Client. | (a) if the toast was ever wrong-themed under "system"; otherwise (b). |
| D11 | DatePicker | **The DatePicker shell itself** (Popover + Calendar + outline icon trigger, single and range modes). It has no registry item; it is shadcn's documented composition. | (a) Baseline: ship it in `stock/` as a stock-gap composition, with typed entry as the extension in `kit/`. (b) Ship the whole thing in `kit/` as one kit extension. | (b). `stock/` should stay "registry + baseline edits". |
| D12 | scripts/ds-tokens.mjs | **Type-class prefix default** is `t-`; the profile says `type-`. | (a) Change the script's default to `type-`. (b) Change the profile to `t-`. | (a). |
| D13 | CLAUDE.md · Field, Loading buttons | **Field composition rules and exceptions; the three-piece loading button.** No Jelly values in either. | (a) Kit file: part of the CLAUDE.md template. (b) Client: agreed component rules, which per the profile are written per client after proposals. | (a) for the Loading-buttons rule and Field's two "does not do for you" warnings, which are stock facts. (b) for the four exceptions, which were agreed for Jelly. |

## Found while classifying (not layers)

Things in Jelly that look like bugs. None of them block the kit, which takes stock's or fixes them as noted above:

- Combobox popup animations aren't wrapped in `motion-safe:`.
- DropdownMenu and Select can't scroll when long (`overflow-hidden` replaced stock's `overflow-y-auto`).
- Tabs and Accordion disabled styles never apply: they use `disabled:`, but Base UI sets `aria-disabled`.
- AvatarBadge is clipped by the Avatar root's `overflow-hidden`.
- DatePicker ignores `settings.dateFormat`.
- Some states were dropped with no Jelly reason: Switch and Button `aria-invalid`, Button `aria-expanded`, Table selected rows, Slider thumb hit area.
- Guardrail slips: `hover:bg-black/5` in AlertDismiss, and `bg-[var(--primary-strong)]`-style arbitrary values where a mapped utility exists.
