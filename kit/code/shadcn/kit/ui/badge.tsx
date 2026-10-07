// design-system-kit 0.2.1 · profile shadcn · kit extension (replaces the stock file when chosen)
/**
 * Stock base-nova (shadcn 4.21.1, 2026-10-07) + TTT baseline:
 * - Badge: focus ring utilities (incl. destructive's focus ring tint) removed in favour of the global :focus-visible rule.
 * + TTT kit extensions:
 * - tone neutral | primary | secondary | accent | positive | cautionary | negative (Semantic colour): sets --t-soft/--t-text/--t-solid/--t-on; data-tone.
 * - variant gains soft | solid, which read the tone's --t-* values. A tone with no variant renders soft; stock variants are unchanged and ignore tone.
 */
import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive dark:bg-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-[var(--t-soft)] text-[var(--t-text)]",
        solid: "bg-[var(--t-solid)] text-[var(--t-on)]",
      },
      tone: {
        neutral:
          "[--t-soft:var(--fill-normal)] [--t-text:var(--label-normal)] [--t-solid:var(--inverse-background)] [--t-on:var(--inverse-label)]",
        primary:
          "[--t-soft:var(--primary-soft)] [--t-text:var(--primary-text)] [--t-solid:var(--primary-normal)] [--t-on:var(--on-primary)]",
        secondary:
          "[--t-soft:var(--secondary-soft)] [--t-text:var(--secondary-text)] [--t-solid:var(--secondary-normal)] [--t-on:var(--on-secondary)]",
        accent:
          "[--t-soft:var(--accent-soft)] [--t-text:var(--accent-text)] [--t-solid:var(--accent-normal)] [--t-on:var(--on-accent)]",
        positive:
          "[--t-soft:var(--status-positive-soft)] [--t-text:var(--status-positive)] [--t-solid:var(--status-positive)] [--t-on:var(--background-normal)]",
        cautionary:
          "[--t-soft:var(--status-cautionary-soft)] [--t-text:var(--status-cautionary)] [--t-solid:var(--status-cautionary)] [--t-on:var(--background-normal)]",
        negative:
          "[--t-soft:var(--status-negative-soft)] [--t-text:var(--status-negative)] [--t-solid:var(--status-negative)] [--t-on:var(--background-normal)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  tone,
  variant = tone ? "soft" : "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  // mergeProps types its first argument as span props, which has no index
  // signature for data-*, so the base object is cast rather than inlined.
  const base = {
    className: cn(badgeVariants({ variant, tone }), className),
    "data-tone": tone ?? undefined,
  } as React.ComponentProps<"span">

  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(base, props),
    render,
    state: {
      slot: "badge",
      variant,
      tone,
    },
  })
}

export { Badge, badgeVariants }
