{{CLIENT_NAME}} is {{ONE_SENTENCE_BRAND_SUMMARY}}

<!-- TEMPLATE: lines marked {{…}} are filled by Skill 1 from the client's brand inputs. Sections marked "TTT default" are kept unless the client's guidelines say otherwise. Remove this comment when the system is generated. -->

## Principles

{{3–5 PRINCIPLES FROM THE BRAND GUIDELINES, each one sentence: what to do, and what to avoid}}

TTT default: start every screen in neutrals (`background-normal`, `background-alternative`, `label-*`, `fill-normal`), add colour only for meaning, and keep brand moments to one per view.

## Voice

{{VOICE AND TONE FROM THE BRAND GUIDELINES}}

TTT default, unless the guidelines differ:

- Sentence case everywhere ("Create project", not "Create Project").
- Buttons are verbs: "Send invite", "Save draft", "Delete project".
- Errors say how to fix the problem, not just that it happened.
- No emoji in UI copy.

## Colour

The palette has three brand roles plus neutrals and status. Each role has a primitive ramp; components only ever use the semantic tokens.

| Role | Brand colour | Lands on |
|---|---|---|
| Brand primary | {{NAME}} {{HEX}} | `brand-primary-50` |
| Brand secondary | {{NAME}} {{HEX}} | `brand-secondary-50` |
| Brand accent | {{NAME}} {{HEX}} | `brand-accent-60` |
| Neutral | {{NAME OR "cool grey"}} | `neutral-*` |

- **Primary** — `primary-normal` for the main action, selected states, slider range, active tab. Hover `primary-strong`. Text `primary-text`, tints `primary-soft`. Foreground on the fill: `on-primary`.
- **Secondary** — `secondary-normal` for toggles on, progress and info. Text `secondary-text`, tints `secondary-soft`, foreground `on-secondary`.
- **Accent** — `accent-normal` for "new" markers and featured moments, one per view. Text `accent-text`, tints `accent-soft`, foreground `on-accent`.
- **Neutrals** — `background-normal` (page), `background-alternative` (shells, sidebars), `background-elevated` (cards, menus, dialogs), `fill-normal` (tracks, secondary buttons, neutral badges), `fill-alternative` (hover), `line-normal` (decorative dividers), `line-strong` (control borders, 3:1).
- **Text** — `label-normal` body, `label-strong` headlines that must win, `label-neutral` descriptions, `label-alternative` helper text and metadata, `label-assistive` placeholders only, `label-disable` disabled.
- **Status** — `status-positive`, `status-cautionary`, `status-negative`, each with a `-soft` ground. Status is never signalled by colour alone: always add an icon and a word.

Every text token's usage note states the contrast it must meet. Skill 1 checks them in Light and Dark.

## Typography

| Role | Family | Used for |
|---|---|---|
| Display | {{DISPLAY FAMILY}} | `display-1` … `title-3` only |
| Sans | {{SANS FAMILY}} | `heading-1` … `caption-2` |
| Mono | {{MONO FAMILY}} | `code`: token names, IDs, hex values |

TTT default: `body-1` is the default text style; switch to `body-1-reading` for paragraphs longer than three lines. Keep each style's letter-spacing. Only `caption-2` may be uppercase.

## Space, shape and depth

- **Spacing** — 4px scale, `space-1` 4 → `space-16` 64. Default control gap `space-4`, card padding `space-6`, sections `space-8`–`space-16`.
- **Radius** — `radius-xs` checkboxes, `radius-sm` fields and small buttons, `radius-md` buttons and selects, `radius-lg` cards and menus, `radius-inset` items inside a `radius-lg` menu, `radius-xl` dialogs, `radius-full` pills. Nested corners shrink by the padding. {{ADJUST VALUES TO THE BRAND: sharper or softer}}
- **Depth** — `shadow-xs` fields, `shadow-sm` resting cards, `shadow-md` menus and tooltips, `shadow-lg` hovered cards, `shadow-xl` dialogs.

## Motion

{{BRAND MOTION CHARACTER, if any}}

TTT default: 120ms colour changes, 200ms hovers and presses, 300ms toggles and dialog entrance; nothing loops or moves on its own. `prefers-reduced-motion` removes every scale and slide; state still changes instantly.

## States and focus

TTT default, required for every system:

- **Hover** — lighten or darken fills (`primary-strong`, `fill-strong`) or lift.
- **Disabled** — `fill-alternative` ground, `label-disable` text, no shadow.
- **Focus** — a 2px solid `focus-ring` outline with 2px offset on every focusable control. Never removed, never replaced by colour alone.
- **Errors** — `status-negative` border, message in `status-negative` with an alert icon.

## Iconography

{{ICON LIBRARY: profile default unless the brand specifies one}}

TTT default: one icon library per system, outline style, inheriting `currentColor` from its text token. 16px in small controls, 18–20px in icon buttons, 24px standalone. No emoji as icons.

## Logo

{{LOGO USAGE FROM THE BRAND GUIDELINES; logo files go in the Logos asset group}}

## Components

Components come from the library named in the System section's profile and are restyled only through tokens. Compose screens from Card, Button, form controls, Tabs and Table before writing custom UI, and keep custom UI on the profile's mapped names: no hex values.

Each component's status, extensions and styling map are on its own page. This system's settings and choices are in the **System** section; the rules every TTT design system follows live in the kit.
