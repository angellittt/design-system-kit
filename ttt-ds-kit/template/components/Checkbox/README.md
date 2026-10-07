# Checkbox

Checkbox turns an option on or off, alone or in a group.

```tsx
<div className="flex items-center gap-3"><Checkbox id="terms" /><Label htmlFor="terms">Accept terms</Label></div>
```

Always pair with a visible `Label`. Supports `checked="indeterminate"` for parent rows.

**Do** use for multiple independent choices.
**Don't** use for an immediate on/off setting; use Switch.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/checkbox
- Code: `components/ui/checkbox.tsx`
- Kit extensions: none
- Client extensions: none
