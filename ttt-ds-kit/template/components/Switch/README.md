# Switch

Switch turns a setting on or off immediately.

```tsx
<div className="flex items-center gap-3"><Switch id="notify" /><Label htmlFor="notify">Email notifications</Label></div>
```

**Do** use for settings that apply at once.
**Don't** use inside a form that needs a Save button; use Checkbox.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/switch
- Code: `components/ui/switch.tsx`
- Kit extensions: none
- Client extensions: none
