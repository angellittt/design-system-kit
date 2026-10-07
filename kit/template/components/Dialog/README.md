# Dialog

Dialog interrupts the flow for a focused task or confirmation.

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="secondary" />}>Delete project</DialogTrigger>
  <DialogContent size="sm">
    <DialogHeader><DialogTitle>Delete this project?</DialogTitle></DialogHeader>
    <DialogFooter><DialogClose render={<Button variant="ghost" />}>Keep it</DialogClose><Button variant="destructive">Delete project</Button></DialogFooter>
  </DialogContent>
</Dialog>
```

`size` `sm` · `default` · `lg`. Focus trap, Escape and scroll lock are built in.

**Do** name the action in the confirm button.
**Don't** use a dialog for reversible actions; offer Undo instead.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/dialog
- Code: `components/ui/dialog.tsx`
- Kit extensions: `size`
- Client extensions: none
