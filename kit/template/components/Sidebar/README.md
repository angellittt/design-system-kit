# Sidebar

Sidebar is the app shell for dashboards and portals: a column with grouped navigation, a header and a footer for the account menu.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>{/* product name */}</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive={pathname === "/"} render={<Link href="/" />}>
              <LayoutDashboardIcon /><span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>{/* Avatar + DropdownMenu */}</SidebarFooter>
  </Sidebar>
  <SidebarInset>
    <header><SidebarTrigger /></header>
    {children}
  </SidebarInset>
</SidebarProvider>
```

- `SidebarMenuButton` takes `isActive` for the current page and `render` for the link; `SidebarMenuBadge` is a count for unread or pending items.
- Put the account `Avatar` + `DropdownMenu` (Profile, Settings, separator, Log out) in `SidebarFooter`.
- **Mobile:** below the breakpoint the sidebar renders as a `Sheet`. Close it on route change (call `setOpenMobile(false)` from `useSidebar()` in a pathname effect — stock doesn't), and its width follows `--sidebar-width`.
- Uses `sheet`, `separator`, `skeleton`, `input` and `tooltip`, which come with it.

**Do** keep to five to eight top-level items in one or two groups. **Don't** nest more than one level, or put the page's main actions in the sidebar — they belong in the page header.

**Styling map** — generated from `src/components/ui/sidebar.tsx` on 2026-10-08. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | background | `background-alternative` |
| base | — | text | `label-normal` |
| base | — | size | h-full — fixed in code |
| base | — | size | w-(--sidebar-width) — fixed in code |
| base | — | size | w-full — fixed in code |
| base | — | padding | `space-0` |
| base | side=left | size | w-(--sidebar-width) — fixed in code |
| base | side=right | size | w-(--sidebar-width) — fixed in code |
| container | — | size | h-svh — fixed in code |
| container | — | size | w-(--sidebar-width) — fixed in code |
| container | — | padding | `space-2` |
| container | collapsible=icon | size | w-(--sidebar-width-icon) — fixed in code |
| container | collapsible=icon | size | w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)] — fixed in code |
| content | — | size | `space-0` |
| content | — | gap | `space-0` |
| footer | — | padding | `space-2` |
| footer | — | gap | `space-2` |
| gap | — | size | w-(--sidebar-width) — fixed in code |
| gap | collapsible=icon | size | w-(--sidebar-width-icon) — fixed in code |
| gap | collapsible=icon | size | w-[calc(var(--sidebar-width-icon)+(--spacing(4)))] — fixed in code |
| gap | collapsible=offcanvas | size | `space-0` |
| group | — | size | `space-0` |
| group | — | size | w-full — fixed in code |
| group | — | padding | `space-2` |
| group-action | — | text | `label-normal` |
| group-action | — | radius | `radius-md` |
| group-action | — | size | `space-5` |
| group-action | — | padding | `space-0` |
| group-action | [&>svg] | size | `space-4` |
| group-action | hover | background | `fill-normal` |
| group-action | hover | text | `label-normal` |
| group-content | — | size | w-full — fixed in code |
| group-content | — | type | text-sm — fixed in code |
| group-label | — | text | `label-normal` · 70% |
| group-label | — | radius | `radius-md` |
| group-label | — | size | `space-8` |
| group-label | — | padding | `space-2` |
| group-label | — | type | font-medium — fixed in code |
| group-label | — | type | text-xs — fixed in code |
| group-label | [&>svg] | size | `space-4` |
| header | — | padding | `space-2` |
| header | — | gap | `space-2` |
| inner | — | background | `background-alternative` |
| inner | — | size | size-full — fixed in code |
| inner | variant=floating | radius | `radius-lg` |
| inner | variant=floating | ring | `line-normal` |
| inner | variant=floating | shadow | `shadow-sm` |
| input | — | background | `background-normal` |
| input | — | size | `space-8` |
| input | — | size | w-full — fixed in code |
| inset | — | background | `background-normal` |
| inset | — | size | w-full — fixed in code |
| inset | md · peer-data-[variant=inset] | radius | `radius-xl` |
| inset | md · peer-data-[variant=inset] | shadow | `shadow-sm` |
| menu | — | size | `space-0` |
| menu | — | size | w-full — fixed in code |
| menu | — | gap | `space-1` |
| menu-action | — | text | `label-normal` |
| menu-action | — | radius | `radius-md` |
| menu-action | — | size | `space-5` |
| menu-action | — | padding | `space-0` |
| menu-action | [&>svg] | size | `space-4` |
| menu-action | hover | background | `fill-normal` |
| menu-action | hover | text | `label-normal` |
| menu-action | peer-data-active | text | `label-normal` |
| menu-action | peer-hover | text | `label-normal` |
| menu-badge | — | text | `label-normal` |
| menu-badge | — | radius | `radius-md` |
| menu-badge | — | size | `space-5` |
| menu-badge | — | padding | `space-1` |
| menu-badge | — | type | font-medium — fixed in code |
| menu-badge | — | type | text-xs — fixed in code |
| menu-badge | peer-data-active | text | `label-normal` |
| menu-badge | peer-hover | text | `label-normal` |
| menu-button | — | radius | `radius-md` |
| menu-button | — | size | w-full — fixed in code |
| menu-button | — | padding | `space-2` |
| menu-button | — | gap | `space-2` |
| menu-button | — | type | text-left — fixed in code |
| menu-button | — | type | text-sm — fixed in code |
| menu-button | [&_svg] | size | `space-4` |
| menu-button | active | background | `fill-strong` |
| menu-button | active | text | `label-normal` |
| menu-button | active | type | font-medium — fixed in code |
| menu-button | active · hover | background | `fill-strong` |
| menu-button | collapsible=icon | size | `space-8` |
| menu-button | collapsible=icon | padding | `space-2` |
| menu-button | group-has-data-[sidebar=menu-action] | padding | `space-8` |
| menu-button | hover | background | `fill-normal` |
| menu-button | hover | text | `label-normal` |
| menu-button | open · hover | background | `fill-normal` |
| menu-button | open · hover | text | `label-normal` |
| menu-button | size=default | size | `space-8` |
| menu-button | size=default | type | text-sm — fixed in code |
| menu-button | size=lg | size | `space-12` |
| menu-button | size=lg | type | text-sm — fixed in code |
| menu-button | size=lg · collapsible=icon | padding | `space-0` |
| menu-button | size=sm | size | `space-1` × 7 |
| menu-button | size=sm | type | text-xs — fixed in code |
| menu-button | variant=default · hover | background | `fill-normal` |
| menu-button | variant=default · hover | text | `label-normal` |
| menu-button | variant=outline | background | `background-normal` |
| menu-button | variant=outline | shadow | `line-normal` |
| menu-button | variant=outline · hover | background | `fill-normal` |
| menu-button | variant=outline · hover | text | `label-normal` |
| menu-button | variant=outline · hover | shadow | `fill-normal` |
| menu-skeleton | — | radius | `radius-md` |
| menu-skeleton | — | size | `space-8` |
| menu-skeleton | — | padding | `space-2` |
| menu-skeleton | — | gap | `space-2` |
| menu-sub | — | border colour | `line-normal` |
| menu-sub | — | size | `space-0` |
| menu-sub | — | padding | `space-0.5` |
| menu-sub | — | padding | `space-1` × 2.5 |
| menu-sub | — | gap | `space-1` |
| menu-sub-button | — | text | `label-normal` |
| menu-sub-button | — | radius | `radius-md` |
| menu-sub-button | — | size | `space-0` |
| menu-sub-button | — | size | `space-1` × 7 |
| menu-sub-button | — | padding | `space-2` |
| menu-sub-button | — | gap | `space-2` |
| menu-sub-button | [&>svg] | text | `label-normal` |
| menu-sub-button | [&>svg] | size | `space-4` |
| menu-sub-button | active | background | `fill-strong` |
| menu-sub-button | active | text | `label-normal` |
| menu-sub-button | active · hover | background | `fill-strong` |
| menu-sub-button | hover | background | `fill-normal` |
| menu-sub-button | hover | text | `label-normal` |
| menu-sub-button | size=md | type | text-sm — fixed in code |
| menu-sub-button | size=sm | type | text-xs — fixed in code |
| rail | — | size | `space-4` |
| rail | after | size | w-[2px] — fixed in code |
| rail | hover · after | background | `line-normal` |
| rail | hover · collapsible=offcanvas | background | `background-alternative` |
| separator | — | background | `line-normal` |
| separator | — | size | w-auto — fixed in code |
| skeleton | — | radius | `radius-md` |
| skeleton | — | size | `space-4` |
| skeleton | — | size | max-w-(--skeleton-width) — fixed in code |
| wrapper | — | size | min-h-svh — fixed in code |
| wrapper | — | size | w-full — fixed in code |
| wrapper | has-data-[variant=inset] | background | `background-alternative` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/sidebar
- Code: `components/ui/sidebar.tsx`
- Kit extensions: none
- Client extensions: none
