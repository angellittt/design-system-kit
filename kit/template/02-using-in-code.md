# Using in code

The Tailwind names to use when building UI against {{CLIENT_NAME}} — in the app, or when prototyping in Claude. Use only these: no hex values, no arbitrary colour values, no default palette classes.

- **Every semantic token is also a utility of the same name** (`text-label-strong`, `bg-status-positive-soft`). Primitives are never utilities.
- **Watch the naming clash:** shadcn's `secondary` and `accent` are neutral greys; brand colours are `brand-secondary` and `brand-accent`.
- **Text styles** are `{{TYPE_CLASS_PREFIX}}<style>` classes, one per style in the type scale.

{{TOKEN_MAPPING_TABLE}}

{{CLIENT_MAPPING_NOTES}}

Once the client repo has its token file, `ds-styling-maps.mjs --using-in-code` generates this whole section from it (`{{TOKENS_OUT}}`), and every publish-back regenerates it.
