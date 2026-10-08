# Publish — code → design system

design-system-kit 0.4.1

Sends what the code is now — components, previews, generated documentation,
statuses — to the design system, then hands off to `figma.md`.
`kit/procedures/common.md` applies throughout; §4 (owner only) decides
whether this can run at all.

## 1. Preconditions — all of them, or stop

- On `main`, up to date with the remote, **clean working tree**. Publishing
  from a branch publishes code nobody has merged.
- `npm run ds:validate -- --system <scratch>/01-system.md` passes (common.md §1).
- `npm run ds:contrast` passes, or every miss is listed under
  `contrast.intentional`.
- This session is the design system's owner (common.md §4).
- You've read the live index and noted `lastChange` (common.md §3).

## 2. Generate — with the kit's tools only

Work in a scratch folder (`<out>`), never in the repo's tracked files.
Everything the design system calls generated comes from these commands —
never hand-edit their output.

```bash
node scripts/ds-build-bundle.mjs --check          # toolchain pins; stop if they don't match
node scripts/ds-build-bundle.mjs <out>/components # bundle.js + bundle.css
node scripts/ds-styling-maps.mjs --all > <out>/maps.md
node scripts/ds-styling-maps.mjs --using-in-code <out>/02-using-in-code.md
node scripts/ds-types.mjs <out>/components/index.d.ts
```

- **React libraries**: run `node scripts/ds-pack-react.mjs <out>/components/lib`
  only when the installed `react` version differs from the index's
  `libraries[].version`. When it runs, update those `version` fields.
- **Types**: also run `node scripts/ds-types.mjs --check <live index.d.ts>`
  against the design system's current `components/index.d.ts`. Unchanged →
  don't send it.
- **"Used by" lists**: on the live `project/tokens.json` you read:

  ```bash
  node scripts/ds-styling-maps.mjs --used-by <live tokens.json> <out>/tokens.json
  ```

  Then confirm that **only usage text** changed (strip every `usage` and
  compare); a value change here means design changed a token since your
  read — stop and pull first.
- Compare every generated file with the live one; send only what changed
  (`cmp`). Byte-identical output is not re-sent.

## 3. Component READMEs

For each component in `componentFiles` (and each single-file component in the
UI folder):

1. Replace the README's `**Styling map** — generated from …` block (up to the
   `**Contract**` line) with the newly generated one, verbatim.
2. **Status `validated` → `implemented` only when the generated map matches
   the agreed intent** — the README's own description of the component and
   any agreed rules (the parts, states, tokens it promises). Read the map
   against them, row by row:
   - matches → set `Status: implemented`, and remove the preview banner;
   - misses (a promised state has no row, a part uses a different token, a
     promised part doesn't exist) → **log a deviation** (ClickUp), leave the
     status `validated`, and change the banner to say which intent it misses
     and link the deviation (contract, Status).
3. **New stock parts** (a part or variant that ships with the stock component —
   e.g. `AvatarGroup`, Button `xs`): document them in that component's
   README; no proposal needed (contract, "Stock parts").
4. **Superseded kit extensions** (stock gained the capability): move the call
   sites to the stock API in code first; then in the README's contract block
   write "`<extension>` superseded by stock (`<stock API>`)" and drop it from
   the extensions list; add a changelog entry saying "superseded by stock".
5. Fix any README prose the code change made untrue (an example that no
   longer compiles, a prop that moved). Don't rewrite the rest.

## 4. Previews

- Every component that becomes `implemented` and has no `preview.html` gets
  one: line 1 `<!-- @dsCard group="<Group>" height=<n> -->`, rendering the
  component from `window.<namespace>` with its main variants, sizes and
  states, in the stock API the code uses.
- Banners (in the README, after the summary sentence) follow the contract:
  - "Preview from stock — not yet in this codebase; final look may differ slightly once built." — a `validated` stock component;
  - "Preview from the kit's code — not yet in this codebase; final look may differ slightly once built." — a `validated` component previewed from a kit file;
  - "No preview yet — waiting on code." — TTT-built parts with no code yet;
  - none once `implemented`.
- **Never change a preview to work around a code problem.** If the new bundle
  breaks a preview, the preview shows the breakage, a deviation is logged, and
  the code gets fixed.
- **Check every preview** against the new bundle before publishing: serve the
  bundle, `bundle.css`, the React libraries and each preview (wrapped with
  those loaded and `data-theme` set) from a local static server, load each in
  light and dark, and require zero `error` events and zero `console.error`.
  Compare computed colour, background, border, radius and height on every
  `[data-slot]` element against the same preview on the live bundle; every
  difference goes in "Visible preview differences".

## 5. System section and changelog

- `project/01-system.md`: Versions (profile, kit) as the repo records them,
  the component counts (implemented · validated), Open deviations as links.
- `project/03-changelog.md`: one entry for this publish-back (common.md §6),
  `Code pending` until the PR that carries this code is merged (if it already
  is, `✓`), and `Figma pending` until `figma.md` reads its changes back.
  Flip marks on earlier entries this publish completes.

## 6. Publish

1. Re-read the live index (common.md §3). If `lastChange` moved, merge first.
2. Publish the changed files in one call; the index (with a new `lastChange`)
   last. `components/index.d.ts` needs `contentType: "text/plain"`.
3. Read back a sample of what you sent — the bundle, one README, the
   changelog — and compare with your files.

Then go to `figma.md`: the **Tokens** part first (it should find nothing —
pull pushes token changes; anything it finds goes in Gaps), then the
**Components** part. Without a connector, Figma marks stay `pending` and the
report says so (`figma.md` §0).
