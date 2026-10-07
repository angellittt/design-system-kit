# Sonner

Toasts confirm that something happened, using Sonner.

```tsx
// once, in the root layout
<Toaster />
// anywhere
toast("Project archived", { action: { label: "Undo", onClick: restore } })
toast.success("Changes saved")
```

Styled as an inverse chip (`inverse-background`, `inverse-label`).

**Do** write titles as past-tense facts and offer Undo for reversible actions.
**Don't** use a toast for errors the user must fix; show those inline.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/sonner
- Code: `components/ui/sonner.tsx`
- Kit extensions: none
- Client extensions: none
