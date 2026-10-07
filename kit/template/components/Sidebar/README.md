# Sidebar

Sidebar is the app shell for dashboards and portals: navigation on the left, content in an inset.

```tsx
<SidebarProvider>
  <Sidebar>…<SidebarMenuButton isActive>Overview</SidebarMenuButton>…</Sidebar>
  <SidebarInset>{children}</SidebarInset>
</SidebarProvider>
```

Sits on `background-alternative`; the active item is an elevated pill on `background-elevated`. Collapses to a sheet on mobile.

**Do** start every dashboard or portal from this shell.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/sidebar
- Code: `components/ui/` sidebar.tsx (uses sheet, separator, skeleton, input, tooltip)
- Kit extensions: none
- Client extensions: none
