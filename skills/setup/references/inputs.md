# Inputs — ask for every one, guess none

design-system-kit 0.12.0

Everything Setup generates comes from these answers. **Never fill one in
yourself** — not from the repo, the client's website, a logo's colours or "a
sensible default". If an answer is missing or unclear, ask again; if the
person doesn't know, stop and report which inputs are outstanding. Where the
kit has a default (status ramps, radius, motion, fonts), the person still has
to *choose* it — "use the default" is an answer; silence isn't.

The design team rarely has the whole brand on day one: a project often starts
generic and takes on its style once the client approves UI samples. So every
answer is one of three kinds, and the person says which:

- **Decided** — final, as given.
- **Provisional · default** — "start generic": the kit's default, to be
  replaced once the style is chosen.
- **Provisional · extracted** — Claude proposed it from a client resource the
  person handed over, and the person accepted it for now (below).

Provisional is an answer, not a gap: Setup runs on it, and the design system
lists it (`01-system.md`, **Provisional**) so nobody mistakes the generic look
for the final one. It changes later with `/ds-sync restyle`, which regenerates
what the input drives the same way Setup does. Not every input can wait —
"Lock now, or provisional", below.

Ask a round at a time (below), with the options spelled out and each input
marked *lock now* or *can be provisional*. Then read the answers back as a
single summary — each with its kind, and an extracted one with its source —
and get a "yes" before generating.

## Rounds

A few related questions per message; wait for the answer before the next
round (the skill's "Asking"). Which rounds depends on the phase
(`phases.md`): the dev asks for what is final from day one, the designer for
everything the brand drives.

**Dev phase** — after pre-flight's round and the prerequisites:

| Round | Inputs | Notes |
|---|---|---|
| The client | 1 client name (then confirm the namespace), 7 locale, 8 week start, 9 date format | All lock now. |
| Structure | 12 status **mode**, 13 kit extensions | Status mode: `separate` or `reuse` — a fixed choice. Unsure → `separate`; the colours stay the designer's. Extensions: the catalog as "Offering kit extensions" says. |

Every other input is recorded as *provisional · default* without asking —
the design phase asks for each. Say so in the summary, so nobody reads the
default look as a choice.

**Design phase** — after the designer's prerequisites:

| Round | Inputs | Notes |
|---|---|---|
| Brand material | 6 brand guidelines, and any other client material | First, because everything after can be proposed from it ("Extracting from the client's resources"). Show the dev's decided inputs here too, read-only. |
| Colour | 2 brand colours, 3 neutral tint, 12 status colours (the mode is the dev's), 14 client-added ramps | Proposals from the material, if any, one line each. The meaning question for any colour going on a status ramp. |
| Type and logo | 4 fonts, 5 logo | Files and licences. |
| Character and cover | 10 radius, 11 motion, 15 cover | Radius and motion are fixed choices; the cover motif can be proposed from the guidelines. |

**One run** (`/ds-setup`): the dev's rounds, then the designer's — with the
"Brand material" round asking only for material, since the rest is already
answered.

A round can merge with the next when its answers are already in hand (the
person sent a brand pack up front), and an extracted proposal can answer
several rounds at once — but each input is still confirmed, decided or
provisional, before the summary.

## The inputs

| # | Input | Format | Notes |
|---|---|---|---|
| 1 | **Client name** | text | Becomes the design system's title. The **namespace** (the bundle's JavaScript global, PascalCase, e.g. `Acme`) is derived from it — show it and confirm. |
| 2 | **Brand colours** — primary, secondary, accent | `#rrggbb` each, with the brand's name for it (e.g. "Tomato"); or `{ "hex", "step" }` when the designer places one on another step; or `"default"` while provisional | Each lands exactly on its ramp's usual step — primary and secondary on **50**, accent on **60** (the template's usage text says where) — unless it would squeeze one side of the ramp there (a dark navy on a mid step); then the tool puts it on the step its lightness matches, stretching the darkest or lightest step to reach a colour beyond the whole ladder, and the tokens that were the colour (`secondary-normal`) move with it (`generate.md` §1). The designer can also name a step: `{ "hex", "step" }`. Only near-black or near-white, or a colour pinned to a step that can't hold it, stops the tool with three same-hue options. The name goes in the brand book only — ramps are named by role, never by hue. |
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

## Lock now, or provisional

What decides it is whether a later change only moves **values** — which
`/ds-sync restyle` regenerates and pull carries to code and Figma — or changes
**structure**: tokens or components appearing, disappearing or being renamed,
which code has to move for first.

**Lock now** — these don't wait on the style, and changing them later isn't a
restyle:

| # | Input | Why now |
|---|---|---|
| 1 | Client name and namespace | The namespace is the bundle's global, in the config and every preview. |
| 7–9 | Locale, week start, date format | Product decisions, not style (contract, Client settings). They change later in the app's `locale.ts` and the System section, not by restyle. |
| 12 | Status **mode** — `separate` or `reuse` | Reuse removes the status ramps and re-aliases every token that used them. Unsure → `separate`: its colours can stay provisional. |
| 13 | Kit extensions | Component code, not style. "None" is the usual first answer; one added later is a component change. |

**Can be provisional** — everything else:

| # | Input | Provisional · default means |
|---|---|---|
| 2 | Brand colours | `"default"` for a role: the template's placeholder ramp (primary `#2f4bda`, secondary `#41c8bd`, accent `#f0bf4c`). No brand name; the brand book's colour table says "Provisional". |
| 3 | Neutral tint | `none` — TTT's cool grey. |
| 4 | Fonts | `default` — the system stack, no files. |
| 5 | Logo | none: the cover shows the client's name. |
| 6 | Brand guidelines | the brand book keeps every "TTT default" passage; principles and voice say "Provisional". |
| 10, 11 | Radius, motion | `default`. |
| 12 | Status colours (mode `separate`) | `default` — TTT's green, amber, red. |
| 14 | Client-added ramps | none for now; restyle can add one later. |
| 15 | Cover | the summary as tagline, motif `none`. |

A brand colour left on the template's placeholder is always provisional — the
token tool refuses `"default"` for a brand role that `provisional` doesn't
list.

## Extracting from the client's resources

When the person hands over client material — a brand guide, program PDFs,
illustrations, a deck, a site they name — Claude can **propose** inputs from
it. A proposal isn't a guess: it names its source, and nothing goes in until
the person accepts it.

- **Only what they hand over.** Never the repo, never a site they didn't name,
  never browsing for more.
- **One line per proposal**: the input, the value, the source (file and page,
  or the URL), and why — e.g. "Brand primary `#1f5f8b` — *Volunteer handbook*
  p. 2, the header band and every section title".
- **Colours**: sample them from the artwork (vector fills where there are any;
  otherwise the dominant flat colour, not an anti-aliased edge), and give the
  hex. Name the colour as the material does, if it does. A colour proposed for
  a status ramp still gets the meaning question (below).
- **Principles and voice**: short paraphrases of what the material says or
  shows, each with its page. No quotes longer than a phrase.
- The person answers each one: **decided**, **provisional · extracted**, or
  no. A rejected proposal is a question again, not a default.

**Directions.** When the designer is still choosing between looks — e.g. a
traditional one following another product, or a playful one drawn from the
program's illustrations — propose one set of values per direction, each
sourced, and ask which (if any) Setup should start on. Setup builds one
design system: on the chosen direction (provisional · extracted), or generic
(provisional · default) until the client picks. To compare directions before
choosing, run the token tool once per direction into its own scratch folder
(`generate.md` §1) and show the ramps and contrast results side by side —
nothing is published. The directions not taken go in the report's Gaps, with
their values and sources, for the restyle.

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
tool reads it (`generate.md` §1) and the report repeats it. The dev phase
also saves it as `.ttt/setup.json` → `inputs`, for the design phase
(`phases.md`):

```json
{
  "client": "Acme",
  "namespace": "Acme",
  "brand": { "primary": "#2f4bda", "secondary": "#0f9d8a", "accent": "default" },
  "brandNames": { "primary": "Ultramarine", "secondary": "Lagoon" },
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
  "clientRamps": [],
  "provisional": {
    "brand.primary": "extracted: Volunteer handbook p. 2",
    "brand.secondary": "extracted: Volunteer handbook p. 2",
    "brand.accent": "default",
    "fonts": "default",
    "guidelines": "default"
  }
}
```

`weekStartsOn` is a number, 0 = Sunday. Paths are where the files are on this
machine.

`provisional` lists every provisional input, keyed as in the tables above
(`brand.primary`, `neutralTint`, `fonts`, `logo`, `guidelines`, `radius`,
`motion`, `status.negative`, `clientRamps`, `cover`), each `"default"` or
`"extracted: <source>"`. An input it doesn't list is decided. The token tool
refuses a lock-now key, and the System section's **Provisional** line is
written from it (`generate.md` §3).
