# Tabs

Tabs switch between related panels in place.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`TabsCount`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="open">Open</TabsTrigger>
  </TabsList>
  <TabsContent value="all">…</TabsContent>
  <TabsContent value="open">…</TabsContent>
</Tabs>

<Tabs defaultValue="overview">
  <TabsList variant="line">…</TabsList>
</Tabs>
```

`TabsList` `variant` `default` (a segmented control — view switches inside a card or above a table) · `line` (an underline — page-level sections). Tabs can also be vertical (`orientation="vertical"`). Two to five tabs, one- or two-word labels. A disabled tab stays focusable (Base UI sets `aria-disabled`).

**Styling map** — generated from `src/components/ui/tabs.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | gap | `space-2` |
| content | — | type | text-sm — fixed in code |
| list | — | text | `label-alternative` |
| list | — | radius | `radius-lg` |
| list | — | size | w-fit — fixed in code |
| list | — | padding | p-[3px] — fixed in code |
| list | horizontal | size | `space-8` |
| list | variant=default | background | `fill-alternative` |
| list | variant=line | radius | rounded-none — fixed in code |
| list | variant=line | gap | `space-1` |
| list | vertical | size | h-fit — fixed in code |
| trigger | — | text | `label-normal` |
| trigger | — | radius | `radius-md` |
| trigger | — | size | h-[calc(100%-1px)] — fixed in code |
| trigger | — | padding | `space-0.5` |
| trigger | — | padding | `space-1` × 1.5 |
| trigger | — | gap | `space-1` × 1.5 |
| trigger | — | type | font-medium — fixed in code |
| trigger | — | type | text-sm — fixed in code |
| trigger | [&_svg:not([class*='size-'])] | size | `space-4` |
| trigger | active | background | `background-normal` |
| trigger | active | text | `label-normal` |
| trigger | after | background | `label-normal` |
| trigger | dark | text | `label-alternative` |
| trigger | dark · active | background | `line-strong` |
| trigger | dark · active | text | `label-normal` |
| trigger | dark · active | border colour | `line-strong` |
| trigger | dark · hover | text | `label-normal` |
| trigger | disabled | text | `label-disable` |
| trigger | has-data-[icon=inline-end] | padding | `space-1` |
| trigger | has-data-[icon=inline-start] | padding | `space-1` |
| trigger | horizontal · after | size | `space-0.5` |
| trigger | hover | text | `label-normal` |
| trigger | variant=default · active | shadow | `shadow-sm` |
| trigger | vertical | size | w-full — fixed in code |
| trigger | vertical · after | size | `space-0.5` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/tabs
- Code: `components/ui/tabs.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `TabsCount` — *Count pill*. A small count inside a trigger ("Open 4"), part of the tab's accessible name. Stock has no count part, so screens drew their own badges at slightly different sizes.
- Client extensions: none
