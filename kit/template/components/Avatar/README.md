# Avatar

Avatar shows a person as a photo, with initials as the fallback.

> Preview from stock — not yet in this codebase; final look may differ slightly once built.
>
> Kit extension parts (`tone`, `initialsOf`) — No preview yet — waiting on code. The preview shows stock only; they appear once the client opts in and publish-back runs.

```tsx
<Avatar>
  <AvatarImage src={user.photo} alt={user.name} />
  <AvatarFallback>PK</AvatarFallback>
</Avatar>

<AvatarGroup>
  <Avatar size="sm"><AvatarFallback>PK</AvatarFallback></Avatar>
  <Avatar size="sm"><AvatarFallback>MD</AvatarFallback></Avatar>
  <AvatarGroupCount>+3</AvatarGroupCount>
</AvatarGroup>
```

`size` `sm` · `default` · `lg`. `AvatarGroup` overlaps its children; `AvatarGroupCount` is the overflow chip; `AvatarBadge` is the corner dot for presence or unread. Give the image an `alt` naming the person; the fallback is shown until the image loads, and if it never does.

**Styling map** — generated from `src/components/ui/avatar.tsx` on 2026-10-07. Values come from the code; a token change regenerates the token file, not this table.

| Part | State or variant | Attribute | Token |
|---|---|---|---|
| base | — | radius | `radius-full` |
| base | — | size | `space-8` |
| base | after | border colour | `line-normal` |
| base | after | radius | `radius-full` |
| base | size=lg | size | `space-10` |
| base | size=sm | size | `space-6` |
| badge | — | background | `primary-normal` |
| badge | — | text | `on-primary` |
| badge | — | radius | `radius-full` |
| badge | — | ring | `background-normal` |
| badge | size=default | size | `space-1` × 2.5 |
| badge | size=default · [&>svg] | size | `space-2` |
| badge | size=lg | size | `space-3` |
| badge | size=lg · [&>svg] | size | `space-2` |
| badge | size=sm | size | `space-2` |
| fallback | — | background | `fill-alternative` |
| fallback | — | text | `label-alternative` |
| fallback | — | radius | `radius-full` |
| fallback | — | size | size-full — fixed in code |
| fallback | — | type | text-sm — fixed in code |
| fallback | size=sm | type | text-xs — fixed in code |
| group | * · slot=avatar | ring | `background-normal` |
| group-count | — | background | `fill-alternative` |
| group-count | — | text | `label-alternative` |
| group-count | — | radius | `radius-full` |
| group-count | — | ring | `background-normal` |
| group-count | — | size | `space-8` |
| group-count | — | type | text-sm — fixed in code |
| group-count | [&>svg] | size | `space-4` |
| group-count | group-has-data-[size=lg] | size | `space-10` |
| group-count | group-has-data-[size=lg] · [&>svg] | size | `space-5` |
| group-count | group-has-data-[size=sm] | size | `space-6` |
| group-count | group-has-data-[size=sm] · [&>svg] | size | `space-3` |
| image | — | radius | `radius-full` |
| image | — | size | size-full — fixed in code |

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/avatar
- Code: `components/ui/avatar.tsx`
- Kit extensions: opt-in, chosen at the design review:
  - `tone` (`neutral` · `primary` · `secondary` · `accent`) — *Semantic colour*. Stock's fallback is a single muted ground, so a stack of initials reads as one grey block. `tone` colours the fallback with a brand fill and its own foreground (`on-*`). No tone by default, so opting in changes nothing until a screen asks for one.
  - `initialsOf(name)` — *Initials*. Every screen that showed initials was splitting names its own way; the helper returns up to two letters from a full name.
- Client extensions: none
