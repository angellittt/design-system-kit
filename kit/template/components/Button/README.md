# Button

Button triggers an action.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" size="sm">Delete project</Button>
<Button render={<Link href="/new" />}>New project</Button>
<Button size="icon" variant="ghost" aria-label="Close"><XIcon /></Button>
```

**Variants** `default` (the main action, one per view) · `secondary` · `outline` · `ghost` · `destructive` · `link`.
**Sizes** `xs` · `sm` · `default` · `lg` · `icon-xs` · `icon-sm` · `icon` · `icon-lg`. `xs` and `icon-xs` are for controls that sit *inside* another control's frame — an Input Group addon, a chip's remove button — never for a standalone action.

Icons go straight in as children. Base UI's `render` prop lets a link wear the button; the button's own children stay as children. Icon-only buttons are `Button` with an icon size and always need an `aria-label`; wrap them in `Tooltip` when the icon isn't universally understood.

**Loading buttons** use all three — the spinner, `disabled` (prevents double-submit) and `aria-busy`:

```tsx
<Button disabled={saving} aria-busy={saving}>
  {saving && <Spinner />}
  Save
</Button>
```

There is no `loading` prop: the pieces are composed at the call site, deliberately, so a button can stay disabled for reasons that have nothing to do with loading.

**Do** use 1–3 word, sentence-case verbs; pair `default` with `secondary` or `ghost`. **Don't** put two `default` buttons side by side, or use `default` to signal an error.

**Styling map** — generated from `src/components/ui/button.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-md` |
| base | — | type | font-medium — fixed in code |
| base | — | type | text-sm — fixed in code |
| base | [&_svg:not([class*='size-'])] | size | `space-4` |
| base | dark · invalid | border colour | `status-negative` |
| base | dark · invalid | ring | `status-negative` |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` |
| base | size=default | size | `space-8` |
| base | size=default | padding | `space-1` × 2.5 |
| base | size=default | gap | `space-1` × 1.5 |
| base | size=default · has-data-[icon=inline-end] | padding | `space-2` |
| base | size=default · has-data-[icon=inline-start] | padding | `space-2` |
| base | size=icon | size | `space-8` |
| base | size=icon-lg | size | `space-1` × 9 |
| base | size=icon-sm | radius | `radius-sm` |
| base | size=icon-sm | size | `space-1` × 7 |
| base | size=icon-sm · in-data-[slot=button-group] | radius | `radius-md` |
| base | size=icon-xs | radius | `radius-sm` |
| base | size=icon-xs | size | `space-6` |
| base | size=icon-xs · [&_svg:not([class*='size-'])] | size | `space-3` |
| base | size=icon-xs · in-data-[slot=button-group] | radius | `radius-md` |
| base | size=lg | size | `space-1` × 9 |
| base | size=lg | padding | `space-1` × 2.5 |
| base | size=lg | gap | `space-1` × 1.5 |
| base | size=lg · has-data-[icon=inline-end] | padding | `space-2` |
| base | size=lg · has-data-[icon=inline-start] | padding | `space-2` |
| base | size=sm | radius | `radius-sm` |
| base | size=sm | size | `space-1` × 7 |
| base | size=sm | padding | `space-1` × 2.5 |
| base | size=sm | gap | `space-1` |
| base | size=sm | type | text-[0.8rem] — fixed in code |
| base | size=sm · [&_svg:not([class*='size-'])] | size | `space-1` × 3.5 |
| base | size=sm · has-data-[icon=inline-end] | padding | `space-1` × 1.5 |
| base | size=sm · has-data-[icon=inline-start] | padding | `space-1` × 1.5 |
| base | size=sm · in-data-[slot=button-group] | radius | `radius-md` |
| base | size=xs | radius | `radius-sm` |
| base | size=xs | size | `space-6` |
| base | size=xs | padding | `space-2` |
| base | size=xs | gap | `space-1` |
| base | size=xs | type | text-xs — fixed in code |
| base | size=xs · [&_svg:not([class*='size-'])] | size | `space-3` |
| base | size=xs · has-data-[icon=inline-end] | padding | `space-1` × 1.5 |
| base | size=xs · has-data-[icon=inline-start] | padding | `space-1` × 1.5 |
| base | size=xs · in-data-[slot=button-group] | radius | `radius-md` |
| base | variant=default | background | `primary-normal` |
| base | variant=default | text | `on-primary` |
| base | variant=default · hover | background | `primary-normal` |
| base | variant=destructive | background | `status-negative` |
| base | variant=destructive | text | `status-negative` |
| base | variant=destructive · dark | background | `status-negative` |
| base | variant=destructive · dark · hover | background | `status-negative` |
| base | variant=destructive · hover | background | `status-negative` |
| base | variant=ghost · dark · hover | background | `fill-alternative` |
| base | variant=ghost · expanded | background | `fill-alternative` |
| base | variant=ghost · expanded | text | `label-normal` |
| base | variant=ghost · hover | background | `fill-alternative` |
| base | variant=ghost · hover | text | `label-normal` |
| base | variant=link | text | `primary-text` |
| base | variant=outline | background | `background-normal` |
| base | variant=outline | border colour | `line-normal` |
| base | variant=outline · dark | background | `line-strong` |
| base | variant=outline · dark | border colour | `line-strong` |
| base | variant=outline · dark · hover | background | `line-strong` |
| base | variant=outline · expanded | background | `fill-alternative` |
| base | variant=outline · expanded | text | `label-normal` |
| base | variant=outline · hover | background | `fill-alternative` |
| base | variant=outline · hover | text | `label-normal` |
| base | variant=secondary | background | `fill-normal` |
| base | variant=secondary | text | `label-normal` |
| base | variant=secondary · expanded | background | `fill-normal` |
| base | variant=secondary · expanded | text | `label-normal` |
| base | variant=secondary · hover | background | `fill-normal` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/button
- Code: `components/ui/button.tsx`
- Kit extensions: none
- Client extensions: none
