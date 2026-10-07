# Slider

Slider picks a value or a range on a continuous scale.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.

```tsx
<Field>
  <FieldLabel>Volume</FieldLabel>
  <Slider value={volume} onValueChange={(v) => setVolume(v as number)} max={100} step={1} aria-label="Volume" />
</Field>

<Slider defaultValue={[20, 70]} aria-label="Budget" />
```

Base UI reports **a number for a single thumb and an array for a range**, so a handler that always destructures an array breaks on the single case. The value readout is the screen's own. Keyboard: arrows, Page Up/Down, Home/End. The thumbs are Field exception 3 — the slider goes in a Field.

**Don't** use a slider when the exact number matters more than the feel — use an `Input type="number"`.

**Styling map** — generated from `src/components/ui/slider.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | horizontal | size | w-full — fixed in code |
| base | vertical | size | h-full — fixed in code |
| control | — | size | w-full — fixed in code |
| control | vertical | size | `space-1` × 40 |
| control | vertical | size | h-full — fixed in code |
| control | vertical | size | w-auto — fixed in code |
| range | — | background | `primary-normal` |
| range | horizontal | size | h-full — fixed in code |
| range | vertical | size | w-full — fixed in code |
| thumb | — | background | `background-normal` |
| thumb | — | border colour | `focus-ring` |
| thumb | — | radius | `radius-full` |
| thumb | — | ring | `focus-ring` |
| thumb | — | size | `space-3` |
| thumb | has-focus-visible | ring | `focus-ring` |
| track | — | background | `fill-alternative` |
| track | — | radius | `radius-full` |
| track | horizontal | size | `space-1` |
| track | horizontal | size | w-full — fixed in code |
| track | vertical | size | `space-1` |
| track | vertical | size | h-full — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/slider
- Code: `components/ui/slider.tsx`
- Kit extensions: none
- Client extensions: none
