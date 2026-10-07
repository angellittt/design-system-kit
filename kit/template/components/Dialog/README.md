# Dialog

Dialog interrupts with a focused task or a short form, over the page.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`size`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Rename board</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename board</DialogTitle>
      <DialogDescription>Everyone on the board sees the new name.</DialogDescription>
    </DialogHeader>
    …
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button onClick={save}>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Base UI traps focus, closes on Escape and locks scroll. `showCloseButton` (default true) renders the corner close; `DialogFooter` takes `showCloseButton` too, for a text Close. Tall content scrolls inside the dialog. Confirming a destructive action is `AlertDialog`, not Dialog.

**Do** make the primary button say what happens ("Save", "Send invite"), last in the footer. **Don't** stack dialogs, or put more than about five fields in one.

**Styling map** — generated from `src/components/ui/dialog.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| content | — | background | `background-elevated` |
| content | — | text | `label-normal` |
| content | — | radius | `radius-xl` |
| content | — | ring | `label-normal` |
| content | — | size | max-h-[calc(100vh-2*--spacing(5))] — fixed in code |
| content | — | size | max-w-[calc(100%-2rem)] — fixed in code |
| content | — | size | w-full — fixed in code |
| content | — | padding | `space-4` |
| content | — | gap | `space-4` |
| content | — | type | text-sm — fixed in code |
| content | sm | size | max-w-sm — fixed in code |
| description | — | text | `label-alternative` |
| description | — | type | text-sm — fixed in code |
| description | * · [a] · hover | text | `label-normal` |
| footer | — | background | `fill-alternative` |
| footer | — | radius | rounded-b-xl — fixed in code |
| footer | — | padding | `space-4` |
| footer | — | gap | `space-2` |
| header | — | padding | `space-10` |
| header | — | gap | `space-2` |
| overlay | — | background | `material-dimmer` |
| title | — | type | font-heading — fixed in code |
| title | — | type | font-medium — fixed in code |
| title | — | type | leading-none — fixed in code |
| title | — | type | text-base — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/dialog
- Code: `components/ui/dialog.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `size` (`sm` · `default` · `lg`) — *Width presets*. Stock has one width, so each screen sets its own `max-w-*` and the same kind of dialog comes out three different widths. `default` is stock's width.
- Client extensions: none
