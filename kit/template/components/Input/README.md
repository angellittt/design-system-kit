# Input

A text field is a composition: `Label` + `Input` + `InputMessage`, with `InputGroup` for a leading icon.

```tsx
<div className="grid gap-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" aria-invalid={!!error} aria-describedby="email-msg" />
  <InputMessage id="email-msg" error={!!error}>{error ?? "We never share it."}</InputMessage>
</div>
```

`size="sm"` for dense forms. Errors are driven by `aria-invalid`; `InputMessage error` adds the alert icon.

**Do** always show a visible `Label`; placeholders are examples only.
**Do** write errors as fixes: "Use at least 8 characters", not "Invalid".

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/input + shadcn/label
- Code: `components/ui/` input.tsx, label.tsx
- Kit extensions: none
- Client extensions: none
