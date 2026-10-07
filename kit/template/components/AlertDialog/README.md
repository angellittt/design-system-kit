# AlertDialog

Alert Dialog interrupts for a decision that has to be confirmed before anything happens.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline" />}>Delete project</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this project?</AlertDialogTitle>
      <AlertDialogDescription>This removes 12 files and can't be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep it</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={remove}>Delete project</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

This is the component only. **When to confirm** — versus offering Undo, or no confirmation at all — is decided per feature, not here.

Stock behaviour: screen readers hear an alert dialog, focus starts on the cancel button, and clicking outside doesn't close it. `AlertDialogCancel` closes the dialog; **`AlertDialogAction` does not** — it is a plain `Button`, so it takes `variant` (use `destructive` where the action destroys data), and the caller decides whether confirming also dismisses, by driving `open`. `size="sm"` narrows it for one-line questions.

**Styling map** — generated from `src/components/ui/alert-dialog.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | radius | `radius-xl` |
| content | — | ring | `label-normal` |
| content | — | size | w-full — fixed in code |
| content | — | padding | `space-4` |
| content | — | gap | `space-4` |
| content | size=default | size | max-w-xs — fixed in code |
| content | size=default · sm | size | max-w-sm — fixed in code |
| content | size=sm | size | max-w-xs — fixed in code |
| description | — | text | `label-alternative` |
| description | — | type | text-balance — fixed in code |
| description | — | type | text-sm — fixed in code |
| description | * · [a] · hover | text | `label-normal` |
| description | md | type | text-pretty — fixed in code |
| footer | — | background | `fill-alternative` |
| footer | — | radius | rounded-b-xl — fixed in code |
| footer | — | padding | `space-4` |
| footer | — | gap | `space-2` |
| header | — | gap | `space-1` × 1.5 |
| header | — | type | text-center — fixed in code |
| header | has-data-[slot=alert-dialog-media] | gap | `space-4` |
| header | sm · size=default | type | text-left — fixed in code |
| media | — | background | `fill-alternative` |
| media | — | radius | `radius-md` |
| media | — | size | `space-10` |
| media | * · [svg:not([class*='size-'])] | size | `space-6` |
| overlay | — | background | `material-dimmer` |
| title | — | type | font-heading — fixed in code |
| title | — | type | font-medium — fixed in code |
| title | — | type | text-base — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/alert-dialog
- Code: `components/ui/alert-dialog.tsx`
- Kit extensions: none
- Client extensions: none
