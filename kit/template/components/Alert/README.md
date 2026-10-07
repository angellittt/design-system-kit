# Alert

Alert shows an inline message tied to a page or form — success, warning, error or information.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`tone`, `urgent`, `AlertDismiss`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Alert>
  <InfoIcon />
  <AlertTitle>Billing moves to monthly in April</AlertTitle>
  <AlertDescription>Nothing to do — your plan and price stay the same.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <CircleAlertIcon />
  <AlertTitle>Payment failed</AlertTitle>
  <AlertDescription>Use a card that has not expired.</AlertDescription>
</Alert>
```

Always pair the colour with an icon and wording — never the tint alone. Transient confirmations ("Saved") are Sonner toasts, not Alerts. `AlertAction` holds a button in the alert's top-right corner.

**Dismissal.** If an alert can be dismissed, the component only reports it — **the app decides how dismissal is remembered** (for the session, for the account, never). Move focus somewhere sensible after dismissing, usually the content the alert sat above.

**Styling map** — generated from `src/components/ui/alert.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-lg` |
| base | — | size | w-full — fixed in code |
| base | — | padding | `space-1` × 2.5 |
| base | — | padding | `space-2` |
| base | — | gap | `space-0.5` |
| base | — | type | text-left — fixed in code |
| base | — | type | text-sm — fixed in code |
| base | * · [svg:not([class*='size-'])] | size | `space-4` |
| base | * · [svg] | type | text-current — fixed in code |
| base | has-[>svg] | gap | `space-2` |
| base | has-data-[slot=alert-action] | padding | `space-1` × 18 |
| base | variant=default | background | `background-elevated` |
| base | variant=default | text | `label-normal` |
| base | variant=destructive | background | `background-elevated` |
| base | variant=destructive | text | `status-negative` |
| base | variant=destructive · * · [svg] | type | text-current — fixed in code |
| base | variant=destructive · * · slot=alert-description | text | `status-negative` |
| description | — | text | `label-alternative` |
| description | — | type | text-balance — fixed in code |
| description | — | type | text-sm — fixed in code |
| description | [&_a] · hover | text | `label-normal` |
| description | md | type | text-pretty — fixed in code |
| title | — | type | font-medium — fixed in code |
| title | [&_a] · hover | text | `label-normal` |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/alert
- Code: `components/ui/alert.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `tone` (`neutral` · `info` · `positive` · `cautionary` · `negative`) — *Semantic colour*. Stock has `default` and `destructive` only; `tone` adds the status grounds (`status-*-soft` with `status-*` text) alongside stock's `variant`, which keeps working.
  - `urgent` — *Urgent-only interruption* (candidate). Stock always sets `role="alert"`, which interrupts screen readers mid-task. With the extension only alerts marked `urgent` interrupt; the rest are read in order.
  - `AlertDismiss` — *Dismiss button* (candidate). Stock has no close affordance, and screens that add one tend to get the label and the focus move subtly different each time. The extension owns the ghost icon button and its `aria-label` ("Dismiss", overridable), emits `onDismiss`, and never hides itself.
- Client extensions: none
