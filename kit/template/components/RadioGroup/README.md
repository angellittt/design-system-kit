# RadioGroup

RadioGroup picks exactly one option from a short list.

```tsx
<RadioGroup defaultValue="monthly">
  <div className="flex items-center gap-3"><RadioGroupItem value="monthly" id="m" /><Label htmlFor="m">Monthly</Label></div>
  <div className="flex items-center gap-3"><RadioGroupItem value="yearly" id="y" /><Label htmlFor="y">Yearly</Label></div>
</RadioGroup>
```

**Do** use for 2–5 options; use Select for more.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/radio-group
- Code: `components/ui/radio-group.tsx`
- Kit extensions: none
- Client extensions: none
