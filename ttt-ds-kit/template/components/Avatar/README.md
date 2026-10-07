# Avatar

Avatar represents a person or team with an image or initials.

```tsx
<Avatar tone="primary"><AvatarImage src={user.photo} alt="" /><AvatarFallback>{initialsOf(user.name)}</AvatarFallback></Avatar>
```

`tone` (`neutral` · `primary` · `secondary` · `accent`) colours the initials ground. `initialsOf(name)` returns up to two letters.

**Do** always provide a fallback.
**Don't** use avatars as the only label for a person in a list.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/avatar
- Code: `components/ui/avatar.tsx`
- Kit extensions: `tone`, `initialsOf`
- Client extensions: none
