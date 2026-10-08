# Inputs — ask for every one, guess none

design-system-kit 0.10.0

Everything Setup generates comes from these answers. **Never fill one in
yourself** — not from the repo, the client's website, a logo's colours or "a
sensible default". If an answer is missing or unclear, ask again; if the
person doesn't know, stop and report which inputs are outstanding. Where the
kit has a default (status ramps, radius, motion, fonts), the person still has
to *choose* it — "use the default" is an answer; silence isn't.

Ask in one message, grouped as below, with the options spelled out. Then
read the answers back as a single summary and get a "yes" before generating.

## The inputs

| # | Input | Format | Notes |
|---|---|---|---|
| 1 | **Client name** | text | Becomes the design system's title. The **namespace** (the bundle's JavaScript global, PascalCase, e.g. `Acme`) is derived from it — show it and confirm. |
| 2 | **Brand colours** — primary, secondary, accent | `#rrggbb` each, with the brand's name for it (e.g. "Tomato"); or `{ "hex", "step" }` when the designer places one on another step | Each lands exactly on its ramp's usual step — primary and secondary on **50**, accent on **60** (the template's usage text says where) — unless it would squeeze one side of the ramp there (a dark navy on a mid step); then the tool puts it on the step its lightness matches, stretching the darkest or lightest step to reach a colour beyond the whole ladder, and the tokens that were the colour (`secondary-normal`) move with it (`generate.md` §1). The designer can also name a step: `{ "hex", "step" }`. Only near-black or near-white, or a colour pinned to a step that can't hold it, stops the tool with three same-hue options. The name goes in the brand book only — ramps are named by role, never by hue. |
| 3 | **Neutral tint** | `#rrggbb` (a tinted grey, or the hue to lean toward), or `none` | `none` keeps TTT's cool grey. A tint shifts every neutral step's hue, with at most a whisper of chroma. |
| 4 | **Fonts** | a family name for each of display, sans and mono, or `default`; plus the font files (woff2) with weight range and style | `default` keeps the system stack. Every family named needs its files: the design system serves them, and the code step wires them into `next/font`. Ask for the licence if it isn't a Google or open font. |
| 5 | **Logo** | SVG files (primary, and any mono or mark versions) | Goes in the design system's Logos asset group. |
| 6 | **Brand guidelines** | a file or link, or "none" | The source for the brand book's principles, voice, logo usage and icon rules. With "none", ask for 3–5 principles and a line on voice; sections with no answer keep the template's "TTT default" passage, and the report lists them. |
| 7 | **Locale** | BCP 47 tag, e.g. `en-US`, `fr-CA` | `ds-validate` checks it. |
| 8 | **Week start** | Sunday … Saturday | Always stated, never derived from the locale. |
| 9 | **Date format** | the typed-entry pattern: day, month and year, numeric, one separator — e.g. `DD/MM/YYYY`, `YYYY-MM-DD` — or "the locale's" | It is what DatePicker parses, not how dates are displayed: a display style such as "14 Nov 2026" is a voice rule for the brand book. `""` when the locale's own pattern is wanted. Locale, week start and date format seed the app's `locale.ts` and the System section's Client settings line. |
| 10 | **Radius character** | `sharp` (½ the template's radii), `default`, `soft` (1½×), or exact px per radius token | `radius-full` stays a pill; `radius-inset` follows `radius-lg` minus `space-1`. |
| 11 | **Motion character** | `calm` (no overshoot), `default`, `playful` (more overshoot) | Changes `ease-expressive`; durations stay. Reduced motion still removes scale and spring. |
| 12 | **Status colours** (ask what each means — below) | `separate` (default): positive, cautionary, negative each as `#rrggbb` (or `{ "hex", "step" }`, as for brand colours) or `default` (TTT's green, amber, red) — or `reuse`: map each status to a brand ramp (`brand-primary`, `brand-secondary`, `brand-accent`) | Reuse removes the separate status ramps. Separate keeps each its own hue — safer when a brand colour is red or green but means something else. |
| 13 | **Kit extensions** | opt-in, from the profile's catalog | See below. Default is none: stock is preferred (contract, Component layers). |
| 14 | **Client-added ramps** | for each: a role name, `#rrggbb`, the step it lands on (default 50), and why no standard ramp can supply it | Usually "none". Named by role (`data`, not `plum`) — the token tool refuses a hue name. Each one is recorded in the System section. |
| 15 | **Cover** | a tagline (the brand's own line, or "use the summary"), and a motif: `grid` (plus marks), `dots`, `lines` or `none` | Propose the motif from the brand book (a site-plan or blueprint brand → grid; editorial → lines) and say why; the reason is recorded in the cover. Everything else on the cover comes from the tokens. |

## Status colours — ask what each one means

A status ramp isn't a palette slot: components hard-wire what it means.

| Status | What it colours |
|---|---|
| `negative` | every error and every destructive action: invalid fields (Input, Textarea, Select, Combobox, Checkbox, RadioGroup, Switch, Field's error text), the destructive Button and DropdownMenu item, destructive Badge and Alert |
| `cautionary` | warnings: Alert and Badge `tone="cautionary"` (Semantic colour extension) |
| `positive` | success and confirmation: Alert and Badge `tone="positive"` (Semantic colour extension) |

So before a brand colour goes on a status ramp — proposed from a brand pack,
or offered by the person — ask what it **means** in the brand, quoting the
row above: "Coral would colour every error and every Delete button. Is that
what coral means for you?" A brand often reserves a colour for something
else: attention or highlights, a category, a campaign. On Districtly, coral
marked "attention moments" (hearing dates, comment windows), not errors.

- It means the status → put it on the ramp.
- It means something else → keep that status's default (or another colour
  that does mean it), and give the meaning a home of its own: a client-added
  ramp named for the role (row 14, e.g. `attention`), or the accent. Say in
  the brand book what the colour is for, so nobody "fixes" it back later.

Ask per colour; one colour can be right for one status and wrong for
another. Record the answer's reason in the brand book's colour section.

## Offering kit extensions

Read the profile's **Kit extensions** table and offer each row as one line:
the capability, the component, and the reason it exists — taken from that
component's template README ("Kit extensions: opt-in …" in
`kit/template/components/<Component>/README.md`). Mark *candidates* as such:
they're proven on one client so far. For example:

> - **Row density** (Table) — dense admin tables and roomy summary tables
>   want different row heights; stock has one. *Proven.*
> - **Clickable rows** (Table) — pointer cursor for rows that open a record.
>   *Candidate.*

Ask which to include. Nothing is included unless named; "none" is a fine
answer.

## Write them down

Save the confirmed answers as `inputs.json` in the scratch folder — the token
tool reads it (`generate.md` §1) and the report repeats it:

```json
{
  "client": "Acme",
  "namespace": "Acme",
  "brand": { "primary": "#2f4bda", "secondary": "#0f9d8a", "accent": "#f5a524" },
  "brandNames": { "primary": "Ultramarine", "secondary": "Lagoon", "accent": "Saffron" },
  "neutralTint": "none",
  "fonts": {
    "display": "default", "sans": "Inter", "mono": "default",
    "files": [{ "family": "Inter", "file": "fonts/Inter-Variable.woff2", "weight": "100 900", "style": "normal" }]
  },
  "logo": ["logo.svg", "logo-mono.svg"],
  "guidelines": "path/or/link, or none",
  "settings": { "locale": "en-CA", "weekStartsOn": 1, "dateFormat": "YYYY-MM-DD" },
  "radius": "default",
  "motion": "default",
  "status": { "mode": "separate", "positive": "default", "cautionary": "default", "negative": "#d92d20" },
  "extensions": ["Row density", "Count pill"],
  "clientRamps": []
}
```

`weekStartsOn` is a number, 0 = Sunday. Paths are where the files are on this
machine.
