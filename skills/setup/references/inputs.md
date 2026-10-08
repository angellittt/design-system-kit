# Inputs — ask for every one, guess none

design-system-kit 0.4.0

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
| 2 | **Brand colours** — primary, secondary, accent | `#rrggbb` each, with the brand's name for it (e.g. "Tomato") | Each lands exactly on its ramp's documented step: primary and secondary on **50**, accent on **60** (the template's usage text says where). The name goes in the brand book only — ramps are named by role, never by hue. |
| 3 | **Neutral tint** | `#rrggbb` (a tinted grey, or the hue to lean toward), or `none` | `none` keeps TTT's cool grey. A tint shifts every neutral step's hue, with at most a whisper of chroma. |
| 4 | **Fonts** | a family name for each of display, sans and mono, or `default`; plus the font files (woff2) with weight range and style | `default` keeps the system stack. Every family named needs its files: the design system serves them, and the code step wires them into `next/font`. Ask for the licence if it isn't a Google or open font. |
| 5 | **Logo** | SVG files (primary, and any mono or mark versions) | Goes in the design system's Logos asset group. |
| 6 | **Brand guidelines** | a file or link, or "none" | The source for the brand book's principles, voice, logo usage and icon rules. With "none", ask for 3–5 principles and a line on voice; sections with no answer keep the template's "TTT default" passage, and the report lists them. |
| 7 | **Locale** | BCP 47 tag, e.g. `en-US`, `fr-CA` | `ds-validate` checks it. |
| 8 | **Week start** | Sunday … Saturday | Always stated, never derived from the locale. |
| 9 | **Date format** | e.g. `DD/MM/YYYY`, or "the locale's" | `""` in config when the locale's own pattern is wanted. |
| 10 | **Radius character** | `sharp` (½ the template's radii), `default`, `soft` (1½×), or exact px per radius token | `radius-full` stays a pill; `radius-inset` follows `radius-lg` minus `space-1`. |
| 11 | **Motion character** | `calm` (no overshoot), `default`, `playful` (more overshoot) | Changes `ease-expressive`; durations stay. Reduced motion still removes scale and spring. |
| 12 | **Status colours** | `separate` (default): positive, cautionary, negative each as `#rrggbb` or `default` (TTT's green, amber, red) — or `reuse`: map each status to a brand ramp (`brand-primary`, `brand-secondary`, `brand-accent`) | Reuse removes the separate status ramps. Separate keeps each its own hue — safer when a brand colour is red or green but means something else. |
| 13 | **Kit extensions** | opt-in, from the profile's catalog | See below. Default is none: stock is preferred (contract, Component layers). |
| 14 | **Client-added ramps** | for each: a role name, `#rrggbb`, the step it lands on (default 50), and why no standard ramp can supply it | Usually "none". Named by role (`data`, not `plum`) — the token tool refuses a hue name. Each one is recorded in the System section. |

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
