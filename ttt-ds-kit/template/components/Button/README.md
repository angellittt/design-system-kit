# Button

Button triggers an action.

```tsx
<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" size="sm">Delete project</Button>
<Button size="icon" variant="ghost" aria-label="Close"><X /></Button>
```

**Variants** `default` (primary fill, one per view) · `secondary` (neutral fill) · `outline` · `ghost` · `destructive` · `link`.
**Sizes** `xs` · `sm` · `default` · `lg` · `icon-xs` · `icon-sm` · `icon` · `icon-lg` (`xs` sizes are for controls inside other components, e.g. chip remove).

Icon-only buttons are `Button` with an icon size, are round, and always need an `aria-label`; wrap them in `Tooltip` when the icon isn't universally understood. `render={<a href="…" />}` lets a link wear the button.

**Do** use 1–3 word sentence-case verbs; pair `default` with `secondary` or `ghost`.
**Don't** put two `default` buttons side by side or use `default` to signal an error.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/button
- Code: `components/ui/button.tsx`
- Kit extensions: none
- Client extensions: none
