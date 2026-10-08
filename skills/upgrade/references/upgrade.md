# Upgrade — the steps

design-system-kit 0.10.1

`$KIT` is the plugin root. "The app" is the app's folder (common.md); every
command runs there, with the repo's package manager and pinned toolchain
(common.md §9).

## 1. Versions

Read `kitVersion` from `.ttt/design-system.json`, the plugin's version, and
the version stamped in every kit file the repo carries (the first lines of
each file: `design-system-kit <version> · …`). Files carry their own
version: an upgrade restamps only what it touched, so a repo on 0.8.1 can
hold files stamped 0.8.0, and that's correct.

- `kitVersion` equals the plugin's, and no file is stamped older → nothing
  to reconcile. Run steps 2 and 5's dry run anyway: if the plan lists
  components available but not in the repo, go to step 5b (the offer) — a
  repo already on the kit's version adds components this way, on a branch
  `ds-add/<YYYY-MM-DD>`, and skips steps 3 and 6. If nothing is available, or
  the user takes none, say so and stop (no branch, no PR).
- The repo is **newer** than the plugin → stop: update the plugin first
  (`kit/README.md`, Install → Updating).
- `schema` or `profile` differ from the kit's → stop: that's a migration.

Then say what's about to happen in one message: from which version(s) to
which, and the changelog headlines in between (step 3).

## 2. The kit's history

The reconcile needs the kit file each repo file started from, and the plugin
holds only its own version. Clone the kit, with its release tags, into the
scratch folder (`<out>`):

```
git clone --quiet <repository from $KIT/.claude-plugin/plugin.json> <out>/kit-src
```

Every release is tagged `v<version>` at the merge that released it. If a
version a file is stamped with has no tag, the tool reports that file as
`unknown`; list it under Gaps.

## 3. The changelog

Read `$KIT/kit/README.md` → **Changes**: every entry after the repo's
`kitVersion`, up to the plugin's, and each "Upgrading a <version> repo"
paragraph. Split their steps into:

- **file steps** — "replace `x.tsx` with 0.8.1's", "copy the 0.5.0 scripts":
  the reconcile (step 5) does these, and does them without losing client
  changes. Don't copy files by hand.
- **other steps** — rerun `ds-tokens`, add a key to the config, change a call
  site (e.g. a Combobox anchor), paste a lint block, merge a CSS block, add a
  package. Do these in step 6, in version order.
- **design-system steps** — "`/ds-sync publish` refreshes …": these happen
  after the PR merges; they go under Gaps as manual steps.

## 4. Branch

On a new branch from an up-to-date `main`: `ds-upgrade/<to-version>` (`ds-add/<YYYY-MM-DD>` when the repo is already on the kit's version and only components are being added). The
working tree must be clean; if it isn't, stop and say what's uncommitted.

## 5. Reconcile the kit files

Dry run first:

```
node $KIT/kit/tools/ds-upgrade.mjs --kit-src <out>/kit-src --to <plugin version> --out <out>/upgrade
```

It finds every stamped kit file in the app, takes the kit file it came from
(the stamp's version and kind: stock, kit extension, wiring, kit file), runs
both through the repo's own Prettier (honouring its `.prettierignore`), and
sorts each into:

| Outcome | Meaning | Action |
|---|---|---|
| `stamp` | the client didn't change it; neither did the kit | restamped |
| `replace` | the client didn't change it; the kit did | the kit's new file |
| `keep` | the client changed it; the kit didn't | the client's file, restamped |
| `merge` | both changed it, in different places | three-way merge, restamped |
| `conflict` | both changed the same lines | **left as is**, old stamp kept |
| `unknown` | no base to compare with | left; a dev decides |
| `removed` | gone from the kit | left; the changelog says why |
| `obsolete` | a kit test file (the kit's tests stay in the kit) | delete it |
| `app-owned` | a seed the app owns (`locale.ts`, Vite's `fonts.css`) | never touched |

Read `<out>/upgrade/plan.md` in full. Every `keep`, `merge` and `conflict`
carries the client's customization as a diff against its base. Then check
each against the design system: a customization that the component's README
lists under **Client extensions** is recorded; one that isn't is
**undocumented drift** — list it under Gaps with its file and a one-line
summary, so a dev records it as a client extension or drops it. Don't decide
for them.

## 5b. Offer what's new

The plan's **Available in the kit, not in this repo** lists components the
kit has and this repo doesn't. Offer them **once, in one message, before
writing** — the way Setup offers kit extensions (`skills/setup/references/inputs.md`,
"Offering kit extensions"): one line each, by component name, with what it's
for (the first sentence of `kit/template/components/<Component>/README.md`),
*candidate* when the profile's Kit extensions table marks it so, and what it
brings with it (the next paragraph). For example:

> The kit now has components this repo doesn't. Add any to this upgrade?
> - **Toggle** — turns one option on or off from a button: bold, pin, show archived.
> - **DataTable** — records people sort, select, page through and filter. *Candidate.* Brings Table's kit file (replacing the stock one) and `@tanstack/react-table`.

What a component brings: a dry run with `--add <names>` says, before anyone
answers — run it with every available name and read **Components added**:
files it needs from the component folder, a stock file swapped for its kit
extension, packages to add, and anything **not added** because a file it
needs is customized (say why in the offer; it can't be taken until a dev
resolves that).

Nothing is added unless named; "none" is a fine answer. Ask with the
session's question tool when it has one (multi-select, one option per
component); otherwise ask in chat and wait.

## 5c. Write

With the chosen names (omit `--add` for none):

```
node $KIT/kit/tools/ds-upgrade.mjs --kit-src <out>/kit-src --to <plugin version> --out <out>/upgrade --add <chosen,names> --write
```

For each package under "Packages to add", add it with the repo's package
manager at its tested max (`$KIT/kit/code/shadcn/scripts/tested-range.json`),
or, for one with no tested range, at the version the profile names for it
(`@tanstack/react-table` 8.21.3). An added component's design-system page
(README, preview) and Figma section arrive with `/ds-sync publish` after the
merge, like any component change. Components offered and not taken stay
listed in the report.

Delete `obsolete` files. For each **conflict**, never pick a side: the
repo's file stays as it was (its old stamp means the next run still finds
its base). Put the conflicted merge and the kit's file
(`<out>/upgrade/conflicts/<path>.conflict` and `.kit`) in the PR body as
diffs under "Needs a dev", and say what the kit changed there (from the
changelog). The PR stays a draft while any conflict is open.

## 6. The other steps

Apply the changelog's other steps from step 3, in version order, through the
repo's own tools: `node $KIT/kit/code/shadcn/scripts/ds-tokens.mjs` (run from
the plugin), `ds:validate`, the package manager for packages (at the tested
max, `$KIT/kit/code/shadcn/scripts/tested-range.json`). A section merged into
another file (the theme block in the global CSS, the `CLAUDE.md` section, a
lint block) is reconciled by hand the same way as a file: take the kit's new
section, keep the client's edits to it, and show both in the PR.

## 7. Stamp and check

1. Set `kitVersion` in `.ttt/design-system.json` to the plugin's version.
2. Run, in the app: `ds:validate`, typecheck, lint, tests and the build
   (`build:safe` on Next.js). Run the repo's formatter check too — the
   reconcile writes formatted files, but the hook must agree.
3. Any failure: fix what the upgrade broke (a merged file, a changed API the
   changelog names); a failure that was there on `main` before goes under
   Gaps, not into this PR.

## 8. PR

Commit, push and open the PR; its body is the report (`report.md`), with
the plan's outcome table and, under "Needs a dev", every conflict and
undocumented drift. Draft while a conflict is open.

## 9. After the merge — the design system

The design system's System section has a Versions row (profile and kit) that
must match the repo (common.md §2). It's updated by `/ds-sync publish` after
this PR merges, together with the pages of any component the changelog
changed — a manual step in the report.
