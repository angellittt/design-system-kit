# Separator

Separator divides groups of content and menu sections.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Separator />
<Separator orientation="vertical" className="h-4" />
```

Use Separator **only for meaningful divisions** between sections — Base UI always announces it to screen readers. For a purely visual divider, use a border utility (`border-line-normal`) instead. Installed with Sidebar and documented here for direct use.

**Styling map** — generated from `src/components/ui/separator.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | background | `line-normal` |
| base | horizontal | size | h-px — fixed in code |
| base | horizontal | size | w-full — fixed in code |
| base | vertical | size | w-px — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/separator
- Code: `components/ui/separator.tsx`
- Kit extensions: none
- Client extensions: none
