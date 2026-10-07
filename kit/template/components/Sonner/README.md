# Sonner

Toasts confirm that something happened, briefly, without interrupting.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
// once, in the root layout
<Toaster />

// anywhere
import { toast } from "sonner"
toast("Board archived", { description: "It moved to Archive.", action: { label: "Undo", onClick: restore } })
toast.success("Changes saved")
toast.error("Couldn't sync", { description: "We'll try again in a minute." })
```

The component is `Toaster` (Sonner, shadcn's recommended toast — not a Base UI primitive). `toast.success` / `.error` / `.warning` / `.info` pick the icon. Sonner's own stylesheet outranks plain utilities, so anything it also sets needs `!` in `sonner.tsx`.

**Do** write titles as past-tense facts, and offer Undo instead of a confirm dialog for reversible actions. **Don't** use a toast for an error the person must fix — put that inline.

**Styling map** — generated from `src/components/ui/sonner.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| toaster | — | size | `space-4` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/sonner
- Code: `components/ui/sonner.tsx`
- Kit extensions: none
- Client extensions: none
