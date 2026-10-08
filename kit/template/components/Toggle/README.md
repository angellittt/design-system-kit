# Toggle

Toggle turns one option on or off from a button: bold, pin, show archived.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Toggle aria-label="Bold" pressed={bold} onPressedChange={setBold}><BoldIcon /></Toggle>
<Toggle variant="outline" size="sm"><StarIcon data-icon="inline-start" />Starred only</Toggle>
```

**Variants** `default` (transparent until pressed) · `outline`. **Sizes** `sm` · `default` · `lg`, the same heights as Button's.

Pressed state is Base UI's `pressed` / `onPressedChange` (or `defaultPressed`), announced as `aria-pressed` — the label stays the same whether it's on or off ("Bold", not "Make bold" / "Remove bold"). An icon-only toggle needs an `aria-label`; wrap it in `Tooltip` when the icon isn't universally understood.

**Do** use a toggle for a state that applies as soon as it's pressed. **Don't** use one for a setting saved with a form (that's Switch or Checkbox), or for an action that runs once (that's Button). Several related toggles go in a ToggleGroup.

**Styling map** — generated from `src/components/ui/toggle.tsx` on 2026-10-08. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-md` |
| base | — | gap | `space-1` |
| base | — | type | font-medium — fixed in code |
| base | — | type | text-sm — fixed in code |
| base | [&_svg:not([class*='size-'])] | size | `space-4` |
| base | dark · invalid | ring | `status-negative` · 40% |
| base | hover | background | `fill-alternative` |
| base | hover | text | `label-normal` |
| base | invalid | border colour | `status-negative` |
| base | invalid | ring | `status-negative` · 20% |
| base | pressed | background | `fill-alternative` |
| base | size=default | size | `space-8` |
| base | size=default | padding | `space-1` × 2.5 |
| base | size=default · has-data-[icon=inline-end] | padding | `space-2` |
| base | size=default · has-data-[icon=inline-start] | padding | `space-2` |
| base | size=lg | size | `space-1` × 9 |
| base | size=lg | padding | `space-1` × 2.5 |
| base | size=lg · has-data-[icon=inline-end] | padding | `space-2` |
| base | size=lg · has-data-[icon=inline-start] | padding | `space-2` |
| base | size=sm | radius | `radius-sm` |
| base | size=sm | size | `space-1` × 7 |
| base | size=sm | padding | `space-1` × 2.5 |
| base | size=sm | type | text-[0.8rem] — fixed in code |
| base | size=sm · [&_svg:not([class*='size-'])] | size | `space-1` × 3.5 |
| base | size=sm · has-data-[icon=inline-end] | padding | `space-1` × 1.5 |
| base | size=sm · has-data-[icon=inline-start] | padding | `space-1` × 1.5 |
| base | state=on | background | `fill-alternative` |
| base | variant=outline | border colour | `line-strong` |
| base | variant=outline · hover | background | `fill-alternative` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/toggle
- Code: `components/ui/toggle.tsx`
- Kit extensions: none
- Client extensions: none
