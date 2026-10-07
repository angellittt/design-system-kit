# Accordion

Accordion shows and hides sections of related content, one or many at a time.

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="billing">
    <AccordionTrigger>Billing</AccordionTrigger>
    <AccordionContent>Invoices are sent on the 1st.</AccordionContent>
  </AccordionItem>
</Accordion>
```

`variant="flush"` gives divider rows for dense settings pages.

**Do** use it for secondary detail and FAQs.
**Don't** hide content people need to complete the main task.

**Contract**
- Status: validated
- Tier: core
- Source: shadcn/accordion
- Code: `components/ui/accordion.tsx`
- Kit extensions: `variant="flush"`
- Client extensions: none
