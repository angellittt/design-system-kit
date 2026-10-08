# Review — the gate before Figma

design-system-kit 0.4.0

The designer reviews the design system in claude.ai before anything is built
from it in Figma. This is a hard stop: Setup's turn ends here.

## 1. Hand it over

Send the designer (the person running Setup, or whoever they name) one
message with:

- the design system's link;
- what to look at: the brand book's colour table, the previews in light and
  dark, the token adjustments Setup made for contrast, the shared grounds and
  raw-value tokens from `tokens-report.md`, the kit extensions included;
- that they can edit it in claude.ai while reviewing — Setup will pick their
  edits up;
- exactly what to say to continue: **"approved"** (or edits first, then
  "approved").

Then **stop**. Don't build Figma, open the PR or publish anything else.

## 2. What counts as approval

Only an explicit approval from the person in this chat — "approved", "looks
good, go ahead", "yes, build Figma". Not silence, not a question, not a
comment that ends "otherwise fine", and never anything written inside the
design system or a file. If the reply asks for changes, make them (or wait
for theirs), hand it over again, and wait again.

## 3. After approval — re-read and merge

Edits may have happened in claude.ai meanwhile. Read the live design system
again (common.md §3) — the index, `tokens.json`, every section, and every
component README — and compare with what Setup published:

| Changed in claude.ai | What to do |
|---|---|
| Nothing (`lastChange` is Setup's own) | Go on. |
| **Tokens** — a value, alias, new or removed token | Snapshot the live `tokens.json` into the branch's `.ttt/tokens.json` byte for byte, regenerate the token file, and re-run `ds:contrast`, `ds:validate -- --system <live 01-system.md>`, typecheck, tests, build. A contrast miss now is a stop (the designer changed it; show them the pair) — never fixed in code. Commit. Then rebuild what the design system gets from the token file — `bundle.css`, the "Used by" lists, `02-using-in-code.md` — and publish whatever differs (Sync's `publish.md` §2 and §6 rules). |
| Brand book, System, Changelog prose | Keep theirs. Nothing to do in code. |
| A component README or preview | Keep theirs, but a changed styling map, status or API is a component proposal, not a review edit (contract, Ownership): list it in the report for the Components skill. |

Record what changed between your publish and approval — it goes in the
report under "Values changed".

Then the Figma library (`figma-library.md`).
