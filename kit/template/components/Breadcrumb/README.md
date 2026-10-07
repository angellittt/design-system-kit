# Breadcrumb

Breadcrumb shows where a page sits in a deep hierarchy.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink render={<Link href="/projects" />}>Projects</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Settings</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

`BreadcrumbPage` marks the current page (`aria-current="page"`) and isn't a link. Long trails can collapse their middle into `BreadcrumbEllipsis` that opens a DropdownMenu — optional, decided per feature. The landmark is named "Breadcrumb".

**Styling map** — generated from `src/components/ui/breadcrumb.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| ellipsis | — | size | `space-5` |
| ellipsis | [&>svg] | size | `space-4` |
| item | — | gap | `space-1` |
| link | — | radius | `radius-xs` |
| link | hover | text | `label-normal` |
| list | — | text | `label-alternative` |
| list | — | gap | `space-1` × 1.5 |
| list | — | type | text-sm — fixed in code |
| page | — | text | `label-normal` |
| page | — | type | font-normal — fixed in code |
| separator | [&>svg] | size | `space-1` × 3.5 |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/breadcrumb
- Code: `components/ui/breadcrumb.tsx`
- Kit extensions: none
- Client extensions: none
