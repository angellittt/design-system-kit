# Tabs

Tabs switch between related views in the same place.

```tsx
<Tabs defaultValue="all" variant="pill">
  <TabsList><TabsTrigger value="all">All <TabsCount>12</TabsCount></TabsTrigger><TabsTrigger value="open">Open <TabsCount>4</TabsCount></TabsTrigger></TabsList>
  <TabsContent value="all">…</TabsContent>
</Tabs>
```

`pill` for view switches inside a card or above a table; `underline` for page-level sections. `TabsCount` is the small count pill.

**Do** keep to 2–5 tabs with 1–2 word labels.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/tabs
- Code: `components/ui/tabs.tsx`
- Kit extensions: `variant` (`pill`, `underline`), TabsCount
- Client extensions: none
