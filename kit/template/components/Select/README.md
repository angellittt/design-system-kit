# Select

Select picks one option from a list in a menu.

```tsx
<Select><SelectTrigger><SelectValue placeholder="Choose a role" /></SelectTrigger>
  <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="member">Member</SelectItem></SelectContent>
</Select>
```

**Do** pair with a visible `Label`.
**Don't** use for fewer than four options; use RadioGroup.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/select
- Code: `components/ui/select.tsx`
- Kit extensions: none
- Client extensions: none
