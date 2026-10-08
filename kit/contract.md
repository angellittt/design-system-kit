# Contract

The rules every TTT design system follows, so the setup, dev and sync skills can read any client's system the same way. Code owns the component inventory; design owns tokens, brand and patterns.

**Schema** `ttt-ds/1` · **Profile** `{{PROFILE}}` · **Platform** `{{PLATFORM}}`

The contract has two parts. **Universal rules** (this part) hold for every system, whatever the UI library. The **Library profile** holds everything specific to the chosen library and is appended below by Skill 1. Switching libraries for a new project means swapping the profile, not the rules.

**Scope** — greenfield projects: the app is set up by devs but has little or no custom UI. Projects with substantial existing UI are out of scope; migrating one is scoped as its own work.

# Part 1 — Universal rules

## Naming

- Component folders match the **code export** name, in PascalCase (`DropdownMenu`, not `Menu` or `ActionsMenu`). If TTT code exports a wrapper, the wrapper's name wins (`DatePicker`, not `Calendar`).
- A composition with no export of its own takes the name of its main part and lists the rest (`Input` covers `Label` + `Input`).
- Every component README ends with a **Contract** block: Status, Tier, Source, Code, Kit extensions, Client extensions. The block goes last because a README's first sentence is the component's summary.

## Figma naming

Figma is generated from the design system, so names map mechanically in both directions:

- **Variables** — the token name with its first hyphen turned into a slash, and dots into underscores: `label-normal` → `label/normal`, `on-primary` → `on/primary`, `space-0.5` → `space/0_5`. Primitives and semantic tokens live in separate collections; semantic variables have Light and Dark modes.
- **Variable scopes** — set by role so designers can only apply a token where it belongs: text tokens (`label-*`, `*-text`, `on-*`, `status-*` text) → text fill; grounds (`background-*`, `fill-*`, `*-normal`, `*-soft`) → frame and shape fill; lines (`line-*`, `focus-ring`) → stroke; spacing and radius → gap, padding and corner radius.
- **Components** — the same name as the design system folder (`Button`, `Input`, `DropdownMenu`).
- **Parts** — pieces that are their own Figma components are named `<Component>/<Part>`: `DropdownMenu/Item`, `Tabs/Trigger`, `Table/Row`, `Accordion/Item`, `Sidebar/Item`, `RadioGroup/Item`.
- **Merged variants** — a size or style that's one component in code (icon-only buttons) is a variant of that component's set, not its own set.
- **Status** — each component description ends with `Status: <status> · Source: <source>`, matching its contract block.
- **Publishing** — Figma's tools can update variables and components but can't publish a library. After every push to Figma, the designer publishes the library by hand; the sync notice says so.

## Token tiers

The design system type stores only `name`, `value` and `usage` per token, so tiers are a naming convention.

- **Primitive** — `<ramp>-<step>`. Ramps are named by role, never by hue: `brand-primary`, `brand-secondary`, `brand-accent`, `neutral`, `positive`, `cautionary`, `negative`. Usage text starts with "Primitive". Never referenced by components.
- **Client-added ramps** — a client may add a primitive ramp beyond the standard roles when none of them can supply a colour it needs (e.g. a `data` ramp for chart colours the brand hues can't provide). Named by the role it plays, never by its hue (`data`, not `plum`); semantic tokens alias it like any other ramp. Each one is recorded in the System section's client-specific choices. `ds:validate` accepts any role-named ramp, rejects one named by hue, and warns when one isn't listed in the System section.
- **Semantic** — `<role>-<variant>` (`primary-normal`, `label-alternative`, `background-elevated`). Aliases a primitive with `{brand-primary-50}` wherever possible. Components use only these.
- **Client** — a client's brand lives in its primitive values. Re-branding changes values only; ramp names, semantic names and the library mapping never change. The brand book records which brand colour each role holds.

Contrast requirements are part of each semantic token's usage text. Skill 1 checks them in both themes before the design review.
- **Chart** — `chart-1` … `chart-5` are semantic tokens for data series, owned by design, with light and dark values. Each must reach 3:1 against `background-normal` and `background-elevated` in both themes.
- **Motion** — `easing` (`ease-standard`, `ease-expressive`) and `duration` (`duration-fast`, `-normal`, `-slow`) are their own token families with plain CSS values. Reduced motion removes scale and spring regardless of these values. **Exception:** loading indicators (Spinner) keep turning under reduced motion, slowed — a stopped spinner reads as nothing loading.

## Component layers

- **Prefer stock.** Use the library's component as shipped. A kit or client extension needs a stated reason, a capability stock doesn't offer, recorded in its proposal.
- **Base** — the library's stock components, themed with tokens.
- **Kit extensions** — TTT-built additions offered as an opt-in catalog, chosen per client at the design review. Each is a *candidate* until a second client uses it, then *proven*. A kit extension is only offered once its code and harness tests exist in the kit. Defined as capabilities; the profile says how each is provided (a native prop in one library can be an extension in another).
- **Client extensions** — additions for one client only, usually brand expression. Code-owned: designers propose, devs build. Any tokens a client extension needs are added with it, never to the base set.
- **Superseded by stock** — when the library gains a capability a kit extension provided, stock wins: the extension leaves the kit catalog, call sites move to the stock API, and the changelog records it as "superseded by stock". TTT's measurements stay as styling, not as an extension.
- **Stock parts** — parts and variants that ship with an existing stock component (e.g. `AvatarGroup`, Button `xs`) belong to that component. Publish-back documents them in its README; no design acceptance needed. Only a whole new component needs a proposal.
- **Layer every change to stock** — any change a project makes to a stock component is labelled with its layer when it's made: **baseline** (fixes a bug, an accessibility gap or a stock gap, or wires stock to tokens — any client would want it), **kit extension** (a capability several clients could use; opt-in) or **client** (brand expression, or only needed because of another client choice). Baseline and kit-extension changes found in a client project are brought back to the kit; client changes never are. Stock sizes and measurements are the default — a client's own control heights or scales are client choices.

## Component tiers

- **Core** — base components plus kit and client extensions. Code-owned.
- **Pattern** — compositions of core components and tokens only. Designers may publish; devs harden.
- **Local** — one-off pieces that live with a screen or ticket, not in the system. Promoted to a pattern on second use.

A prototype is a pattern only if it uses nothing but core components and tokens. Anything that needs a new primitive or styles outside the tokens is a component proposal.

## Styling maps and previews

- **Styling map** — every `implemented` component's README has a table generated from its code by publish-back, with columns **Part · State or variant · Attribute · Token** (e.g. `thumb · checked · background · thumb-normal`). Values not traced to a token are listed as "fixed in code". Each token's usage text ends with a "Used by" list.
- **Previews** — render components exactly as the code ships them. A preview is never changed to work around a code problem; if it breaks, it shows the breakage and a deviation is logged.

## Status

`proposed` → `validated` → `implemented`

- **proposed** — requested, not yet checked for feasibility or built.
- **validated** — agreed in review (or composed from core components and tokens, for patterns), but not yet meeting its agreed intent in this codebase — whether or not the code is installed. Previews come with a banner placed after the summary sentence (the first sentence is the component summary). Pure-stock components get a preview built from the kit's stock source: "Preview from stock — not yet in this codebase; final look may differ slightly once built." Components whose code is a kit file (a kit extension or a kit-built component such as DatePicker) get a preview built from the kit's code: "Preview from the kit's code — not yet in this codebase; final look may differ slightly once built." TTT-built parts with no code yet show "No preview yet — waiting on code." Installed components that miss an intent say which intent and link the deviation. Banners disappear when publish-back sets `implemented`.
- **implemented** — in the client's codebase with states, accessibility and responsive behaviour handled. Skill 2 sets this.

## Ownership and changes

| Layer | Owner | How it changes |
|---|---|---|
| Tokens, brand, assets | Design | Edited in the design system; pull carries them to code (a PR) and to Figma's variables |
| Core components, library version | Dev | Changed in code; published back to the design system |
| Patterns | Design (publish), dev (harden) | Published as `validated`; `implemented` after hardening |
| The design system itself | Design-system owner | Only the owner's account can update it; the owner reviews every publish-back diff |

- Anything that conflicts is logged as a deviation rather than overwritten.
- A rename or merge is "add new, then remove old". Removing files needs a Claude Code or Cowork session; chat can only add and replace.
- Figma is a read-only consumer, regenerated and republished from the design system: token changes by pull, components by publish-back. Figma never blocks code — without a connector, its changelog mark stays pending.

- **Changelog** — every change gets a short entry in the design system's Changelog section, newest first: date, one line on what changed, a short reason when the change isn't self-explanatory (a clause, not a paragraph), owner (design, code, dev), a link to the task or PR, and a second line with each sync target marked ✓, pending or —. Reasoning lives in the linked task or PR, not the entry. Keep the latest 10; move older entries to `archived/`. Pending marks flip themselves: every sync run first checks them and sets ✓ only where it has verified the target — a merged PR whose result is still current, or a Figma read-back.
- **System section** — each design system has a one-screen System section: versions (schema, profile, kit), owner, links (repo, Figma, tracker), component counts, client settings, client-specific choices, open deviations. The rules themselves are never copied into a design system; skills read them from the installed kit, and the System section's versions say which.
- **Using in code** — each design system has a "Using in code" section: the Tailwind names to build with (the profile's token mapping as this client applies it, the type-class prefix, client-specific notes). It mirrors the generated token file and is updated by every publish-back, so people prototyping in Claude without the kit still have it.
- **Section order** — sections appear in file-path order, so their files are numbered: `01-system.md`, `02-using-in-code.md`, `03-changelog.md`, after the brand book (`README.md`).
- **Proposals** — cover capability, accessibility and styling only; usage policy (e.g. when to confirm vs offer Undo) is decided per feature. Drafting checks the library's current docs at the pinned version; dev questions are shown as code at the call site. On acceptance, any agreed rules are copied into the component's docs and the repo guardrails.
- **Deviation register** — deviations are logged as tasks in the project's ClickUp list (the `tracker` in the repo config); the design system mirrors only the open ones, as links, in a Deviations section.
- **Reports** — every skill run ends with a report in a fixed template: what changed, values changed (old → new), deviations logged, visible preview differences, and Gaps (anything the contract didn't say). Empty sections say "none" rather than being dropped.
- **Handoff** *(planned)* — when a project is handed over, a skill writes the rules that apply (contract and profile at the project's kit version) into the client repo's docs, so the delivered project doesn't depend on TTT's kit.
- **Read before publishing** — re-read the live design system immediately before every publish and compare its `lastChange` with the last one seen. If it moved, merge with what changed rather than publishing over it. A local copy is never proof that nothing changed.
- **Timestamps** — `lastChange.at`, `lastSynced` and changelog times are taken from the system clock at the moment of writing, never estimated.
- **Generated means generated** — anything the design system says is generated from code (styling maps, "Used by" lists, `components/index.d.ts`, the preview bundle) is produced by a script in the kit, run by publish-back. If no script exists, the document isn't described as generated.
- **Client settings** — decisions that shape output but aren't tokens (locale, week start, date format) are product decisions the **app owns**: they live in code, in the app's locale module, which Setup seeds from the inputs and devs change like any other code. Components default to it and take a prop to override one instance. The design system records the same decision in the System section's Client settings line, and validation warns when the two differ — a person fixes whichever is out of date. Never decided only in a chat. `dateFormat` is the numeric typed-entry pattern; when set it overrides the locale's own, otherwise the pattern comes from the locale. `weekStartsOn` is always stated, never derived.
- **Config validation** — a kit script validates `.ttt/design-system.json`, the token snapshot and the app's locale module against a schema, in CI and at the start of every skill run. Invalid values fail with a message naming the field.

## Versioning

Every system records its schema (`ttt-ds/1`) and profile. Skills check both before doing anything and stop with a clear message on a mismatch.
