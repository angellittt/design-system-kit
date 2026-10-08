# Figma component specs — profile shadcn (base-nova)

design-system-kit 0.8.0 · profile shadcn

How each baseline component is built in a client's Figma library. Measurements
are base-nova's (the stock files in `kit/code/shadcn/stock/ui/`); colours,
radii, spacing and shadows are **token names** — the builder (`lib.js`) binds
them to variables, so a client's tokens restyle everything. The styling maps
in each component README are the check: every token a map names for a state
the spec builds must be bound in Figma.

Content is never "Label" or lorem: every example uses the client's own
vocabulary and voice from the brand book (Districtly: application numbers,
wards, hearing dates). Write it per client; the spec says what each example
must show, not the words.

**Text styles.** Code sets Tailwind sizes; Figma uses the nearest text style:
`text-sm font-medium` → `Text/label-1`, `text-sm` → `Text/body-2`,
`text-xs` → `Text/caption-1`, group labels → `Text/caption-2`, titles →
`Text/headline-1` (cards, dialogs, sheets) or `Display/title-2` (section
titles on the library pages).

**States** are a `State` variant axis on every interactive component.
**Focus** is drawn as a 2px `focus-ring` stroke (outside) on buttons, or a
`focus-ring` border plus `ring(node, "focus-ring", 0.5)` on fields; errors use
`status-negative` with `ring(…, 0.2)`; disabled is opacity 0.5 unless the map
says otherwise. **Tints come from the map**: a row `` `token` · N% `` is the
variable bound with paint opacity N/100 (`paint(token, N / 100)`), so the
percentages in this spec (Badge's 10% destructive tint, the 20%/40% error
rings) are what the code uses and can be read back, not values to choose.

## Actions

| Component | Build | Variants · states | Properties | "In use" shows |
|---|---|---|---|---|
| **Button** | h-row, centred. xs 24 (px 8, gap 4, radius-sm, caption-1, icon 12) · sm 28 (px 10, gap 4, radius-sm, caption-1, icon 14) · default 32 (px 10, gap 6, radius-md, label-1, icon 16) · lg 36 (as default). Icon sizes square: icon-xs 24, icon-sm 28 (radius-sm), icon 32, icon-lg 36 (radius-md). | Variant default (primary-normal / on-primary, hover primary-strong) · secondary (fill-normal / label-normal, hover fill-strong) · outline (background-normal + line-normal border, hover fill-alternative) · ghost (hover fill-alternative) · destructive (status-negative fill at 10%, 20% hover; status-negative text) · link (primary-text; hover underline). State default · hover · focus · disabled on Size=default; other sizes default only; icon sizes for default · outline · ghost. | Label (text), Leading icon (boolean; an Icon instance named "Leading icon", swap per use) | One of each variant with real labels, two with swapped icons |
| **Spinner** | 16×16 component holding `Icon/loader-circle`, label-normal | — | — | A loading button: disabled Button, Leading icon on, swapped to loader-circle |

## Forms

| Component | Build | Variants · states | Properties | "In use" shows |
|---|---|---|---|---|
| **Input** | 280×32, radius-sm, p 4/10, 1px line-strong, background-normal, body-2 value | State placeholder (label-assistive) · filled · focus · error · disabled (fill-alternative, 0.5) | none — values differ per state | inside Field |
| **Field** | v-stack gap 8: label (label-1), Input instance, description (caption-1, label-alternative, 280 wide), error (caption-1, status-negative; visible in error) | State default · error · disabled | Label, Show description | default and error fields; a Textarea field |
| **InputGroup** | Input frame + leading 16px icon in label-alternative, gap 8 | State default · focus | — | — |
| **Textarea** | 280 wide, min-h 64 (space-16), p 8/10, radius-sm, line-strong | State default · focus | — | — |
| **Combobox** | InputGroup-like trigger with chevron-down; chips are fill-alternative, radius-sm, p 2/6, caption-1 + 12px x icon | State closed · open (focus ring) · chips (multiple) | — | open trigger + popup list (background-elevated, line-normal, radius-lg, Shadow/md, p 4; items radius-inset p 6/8, highlighted fill-alternative, selected primary-text + check) |
| **DatePicker** | Input with typed value in the client's `dateFormat` and a 24px calendar button (calendar icon) | State default · error | — | the Field with the format as its description, and **Calendar** |
| Calendar *(part)* | v-stack p 8 gap 8, background-normal, line-normal, radius-lg, Shadow/md; caption row (chevrons + "Month YYYY", label-1); weekday row in the client's **week start** (caption-1, label-alternative); 32×32 day cells radius-md; today fill-alternative; selected primary-normal / on-primary; outside days label-alternative | — | — | the selected month for a real date |
| **Checkbox** | h-row gap 8: 16×16 box radius 4 (line-strong; checked primary-normal + 14px check on-primary; indeterminate minus) + body-2 label | State unchecked · checked · indeterminate · error · disabled | Label, Show label | a labelled group of three |
| RadioGroup/Item *(part)* | 16px circle (line-strong; checked primary-normal + 6px on-primary dot) + body-2 label | State unchecked · checked · disabled | Label | — |
| **RadioGroup** | v-stack gap 12: group label (label-1) + RadioGroup/Item instances | — | — | — |
| **Switch** | track radius-full p 1: default 32×18 (thumb 16), sm 24×14 (thumb 12); off line-strong, on primary-normal (thumb aligned end); thumb thumb-normal; + body-2 label | Size default · sm × State unchecked · checked · disabled | Label, Show label | — |
| **Slider** | header row (label-1 + value in label-alternative) over a 240×12 control: 4px fill-alternative track, primary-normal range, 12px thumb background-normal with focus-ring border | State default · focus (focus-ring glow) · disabled | — | — |
| **Select** | trigger 220×32 (sm 28, radius-sm), radius-md, p 0/10, line-strong, body-2 value + 16px chevron (label-alternative) | Size default · sm × State placeholder · filled · open · disabled | — | label + open trigger + popup (as Combobox; a caption-1 group label first) |

## Status

| Component | Build | Variants · states | Properties | "In use" shows |
|---|---|---|---|---|
| **Badge** | h 20, pill (radius 32), p 2/8, gap 4, caption-1 | Variant default · secondary · outline · ghost · destructive (10% tint) · link — plus `tone` only when the Semantic colour extension is chosen | Label | real statuses mapped to variants |
| **Avatar** | circle sm 24 · default 32 · lg 40; fill-alternative, 1px line-normal ring; initials label-alternative (caption-1 / label-2 / label-1) | Size sm · default · lg | Initials | Avatar/Group (gap −8, each ringed 2px background-normal, + GroupCount) and an avatar with Avatar/Badge |
| Avatar/Badge *(part)* | 10px primary-normal dot, 2px background-normal ring outside | — | — | — |
| Avatar/GroupCount *(part)* | 32px fill-alternative circle, "+N" label-2 | — | — | — |
| **Alert** | h-row p 8/10 gap 8, background-elevated, 1px line-normal, radius-lg; 16px icon, title label-1, description body-2 label-alternative (400 wide) | Variant default · destructive (title, icon and description status-negative) | — | — |
| **Progress** | 320 wide v-stack gap 12: header (label-1 + value label-alternative) and a 4px fill-alternative track with a primary-normal indicator | — | Label, Value | — |

## Navigation & Layout

| Component | Build | Variants · states | Properties | "In use" shows |
|---|---|---|---|---|
| **Card** | v-stack, background-elevated, line-normal, radius-lg, clip; spacing 16 (sm 12): header (title headline-1 / sm label-1, description label-neutral), content (a Badge and meta in label-alternative), footer on fill-alternative with an outline + default Button | Size default · sm | Title, Show description, Show footer | — |
| Tabs/Trigger *(part)* | radius-md p 2/6, label-1; inactive label-alternative, disabled label-disable; default+active background-normal with Shadow/sm; line variant: 2px label-normal underline under the active one | Variant default · line × State inactive · active · disabled | Label | — |
| **Tabs** | list: fill-alternative, radius-lg, p 3, Tabs/Trigger instances | — | — | pill list and line list |
| Accordion/Item *(part)* | trigger row p 10/0 (title label-1 + 16px chevron label-alternative), content body-2 label-alternative; 1px line-normal bottom border; 440 wide | State closed · open | Title | — |
| **Accordion** | v-stack of Accordion/Item instances, one open | — | — | — |
| **Separator** | 1px line-normal: 240×1 / 1×24 | Orientation horizontal · vertical | — | — |
| **Skeleton** | fill-alternative, radius-md, 200×16 | — | — | a circle (resized instance) and two text lines |
| Sidebar/Item *(part)* | 240×32, radius-md, p 8, gap 8: 16px icon (named "Icon", swap per item), body-2 label (active label-1), count badge (caption-1); hover and active background-elevated | State default · hover · active | Label, Count, Show badge | — |
| **Sidebar** | 256×600 v-stack, background-alternative, 1px line-normal right edge: header (logo mark + name), groups (caption-2 label, Sidebar/Item instances), spacer, footer (Avatar sm + name) | — | — | — |
| Table/Row *(part)* | h-row of fixed-width cells (p 8); header cells 40 tall, label-1; body body-2 with a status Badge; 1px line-normal bottom; hover and selected fill-alternative; footer fill-alternative, label-1 | Type header · body · footer × State default · hover · selected | — | — |
| **Table** | v-stack of Table/Row instances in a line-normal, radius-lg, clipped frame + caption (body-2 label-alternative) | — | — | real records |
| **Empty** | v-stack centred, dashed line-normal border, radius-xl, p 24, gap 16: optional 32px fill-alternative icon tile (radius-lg), title label-1, description body-2 label-alternative (centred, 300 wide), an outline Button | Variant default · icon | Title, Description | — |
| **Breadcrumb** | h-row gap 6: body-2 links label-alternative, 14px chevron-right separators, an ellipsis icon, current page label-normal | — | — | — |
| **Pagination** | h-row gap space-0.5: ghost "Previous" (chevron-left) and "Next" Buttons, 32×32 page frames (current one outlined: background-normal + line-normal), an ellipsis | — | — | — |

## Overlays & Feedback

| Component | Build | Variants · states | Properties | "In use" shows |
|---|---|---|---|---|
| **Dialog** | 384 wide, background-elevated, radius-xl, Shadow/xl, 1px label-normal ring at 10%, clip: header p 0/16 (title headline-1, description body-2 label-alternative, close x 16), body (a Field), footer on fill-alternative p 16 with outline + default Buttons | — | Title, Show close | on a material-dimmer frame |
| **AlertDialog** | 320 (sm 288), as Dialog without close; centred title and description; footer centred: outline "keep" + destructive confirm | Size default · sm | Title | — |
| **Tooltip** | inverse-background, radius-md, p 6/12, caption-1 inverse-label + a 12×6 triangle (polygon) in inverse-background | Side top · bottom | Text | — |
| **Sonner** | 356 wide, background-elevated, line-normal, radius-lg, Shadow/lg, p 16, gap 12: tone icon, title label-1 + description body-2, an xs outline action | Tone default (info) · success (circle-check, status-positive) · warning (triangle-alert, status-cautionary) · error (circle-alert, status-negative) | Show action | — |
| DropdownMenu/Item *(part)* | 200 wide, radius-inset, p 6, gap 6: 16px icon, body-2 label, shortcut caption-1 label-alternative; focus fill-alternative; destructive status-negative | Type default · checkbox · destructive × State default · focus | — | — |
| **DropdownMenu** | 208 wide, background-elevated, line-normal, radius-lg, Shadow/md, p 4: caption-1 label, items, a 1px line-normal separator, the destructive item last | — | — | — |
| **Popover** | 288 wide, background-elevated, line-normal, radius-lg, Shadow/md, p 10, gap 10: title label-1 + description label-neutral, then content | — | Title | — |
| **Sheet** | 384×560, background-elevated, Shadow/lg: header p 16 (title + description + close), body p 0/16 (fields), spacer, footer p 16 (outline + default Buttons) | — | Title | on a material-dimmer frame, aligned to the edge it slides from |

## Icons

`Icon/<name>` components on the Utilities page, from `icons.mjs` (the app's
own icon package), 24×24, 2px stroke bound to `label-normal`. Components use
instances, recoloured to the token of the text they sit with, and expose
swappable icons by layer name ("Icon", "Leading icon").
