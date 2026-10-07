# Spinner

Spinner shows that something is loading when progress can't be measured.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Button disabled={saving} aria-busy={saving}>
  {saving && <Spinner />}
  Save
</Button>
```

For loading buttons, always use all three: the spinner, `disabled` (prevents double-submit) and `aria-busy` — see Button. Spinner also sits in Input Group addons and Empty states, and inherits its colour from the surrounding text. It keeps turning under reduced motion, slowed — the contract's exception for loading indicators.

**Styling map** — generated from `src/components/ui/spinner.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | size | `space-4` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/spinner
- Code: `components/ui/spinner.tsx`
- Kit extensions: none
- Client extensions: none
