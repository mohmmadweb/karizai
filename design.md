# design.md — Persian RTL Design System

## Status

Implemented: font, tokens, type roles, logo, formatting helper, Button and form
base, shared page patterns, the `/design-system` reference page, the admin
frame (sidebar, mobile menu, top bar), and the sign-in page layout (centered
Card with the full logo). Checked against the repository on 2026-10-13.

## Brand Inputs

- Product or brand name: موشکاف
- Primary color: navy, `oklch(0.32 0.1 262)` (`--primary`)
- Secondary color: calm cyan (hue 205), proposed from the navy and awaiting
  the owner's approval; used by `--secondary` (pale tint), `--chart-2`
- Desired visual style: reliable, advanced, enterprise, tech (AI product)
- Brand voice: not yet supplied; temporary default is polite, warm, precise
- Logo files in `public/brand` (transparent PNG, each with a light-theme
  colored file and a `-white` file for dark surfaces): `icon-text.png`
  (icon above the name, 1254x1254), `icon.png` (icon only, 1114x1114), and
  `text.png` (name only, 1114x333). Rendered by
  `src/components/brand/brand-logo.tsx` with `variant` (`full`, `icon`,
  `text`) and `tone` (`auto`, `color`, `white`). `src/app/icon.png` is the
  tab icon, made from `icon.png`.
- Font files: `src/assets/fonts/IRANSansXFaNum-*.woff2`, static weights Thin
  100, UltraLight 200, Light 300, Regular 400, Medium 500, DemiBold 600, Bold
  700, ExtraBold 800, Black 900 (loaded in `src/styles/fonts.ts`). The FaNum
  build shows Persian digits even for Latin digits.

Temporary choices: the secondary color and the brand voice await the owner's
approval. The dark palette is derived from the same navy and is not yet
reviewed by the owner.
If an input is missing, use a quiet neutral fallback and record the temporary
choice. Do not invent brand history, personality, or product positioning.

## Product Context and UI Wording

Read product.md for the approved audience, product vocabulary, and exclusions.
Root design.md describes the shared visual system; a change's design.md under
openspec/changes describes its technical implementation, not a second theme.
Use ordinary product language. Do not add repeated mock/demo/sample-data
labels, banners, badges, or explanatory notes to product screens unless the
user explicitly requests them. Keep prototype limitations in technical reports
and documentation. Do not claim permanent saving or security that is not
implemented. Preserve these rules when updating this template from the code.

## Language and Direction

- Default language: Persian (`fa`).
- Default direction: right-to-left (`rtl`).
- Use `lang="fa"`, `dir="rtl"`, and shadcn's DirectionProvider.
- Use logical start/end spacing, alignment, borders, and radii.
- Do not change the project to LTR unless the user requests it.

## Persian Text, Numbers, and Dates

- Use the half-space (ZWNJ) in Persian words where it belongs, for example
  «می‌شود» and «کتاب‌ها». Use Persian «ی» and «ک», not the Arabic forms.
- Show numbers in product copy with Persian digits. Keep Latin digits inside
  code, URLs, email addresses, and fields that must accept them.
- Format numbers, prices, and dates with `Intl` and the `fa-IR` locale through
  one shared helper in `src/lib`. Do not hand-write separators.
- Use tabular figures where numbers are compared, such as tables and totals.
- Wrap Latin text, email addresses, URLs, phone numbers, and codes in an
  isolated LTR element so punctuation stays on the correct side.
- Inputs that expect Latin text, such as email or URL, use `dir="ltr"` and
  start-aligned text.

## Design Principles

1. Clear before decorative: users should understand the hierarchy immediately.
2. Consistent before novel: reuse tokens, components, and patterns.
3. Calm density: avoid both crowded screens and excessive empty space.
4. Persian-first typography: use comfortable line height and avoid tight text.
5. Visible states: hover, focus, disabled, loading, empty, and error states must
   be understandable.
6. One primary action per view: the most important action is easy to find.

## Color System

Use shadcn-compatible semantic tokens in OKLCH. Components must use token names,
not one-off color values.

Required light-theme tokens:

- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`, `destructive-foreground`
- `success`, `success-foreground`
- `warning`, `warning-foreground`
- `info`, `info-foreground`
- `border`, `input`, `ring`
- `chart-1` to `chart-5` for future charts, derived from the brand colors

Generate supporting colors from the supplied primary and secondary colors.
Body text and its background reach at least 4.5:1 contrast; large text, icons,
and control borders reach at least 3:1. Use status colors only for status, and
never as the only signal. The product has a light and a dark theme with the
same token names: `:root` is light and `.dark` is dark. Both meet these
contrast targets, and `/design-system` shows both ratios. Always style with
tokens so a component works in both themes; use a `dark:` variant only when a
token cannot express the difference.

Theme behavior: `src/lib/use-theme.ts` holds the `useTheme` hook and an inline
script (in the root layout) that sets the starting theme from the device
setting before first paint. `ThemeToggle` in `src/components/shared` switches
between the two. The choice is temporary: nothing is stored, so a refresh
returns to the device setting (Phase 1 storage rule). `BrandLogo` shows the
white logo in the dark theme automatically (`tone="auto"`).

## Typography

- Load the supplied local font once with `next/font/local`.
- Expose it through `--font-sans` and apply it at the root layout.
- Prefer a variable WOFF2 file. Otherwise map the supplied files accurately.
- Fallback: a system sans-serif stack that supports Persian.

Type roles:

- Display: 40/56, weight 700
- H1: 32/48, weight 700
- H2: 28/42, weight 700
- H3: 24/36, weight 600
- H4: 20/32, weight 600
- Body large: 18/32, weight 400
- Body: 16/28, weight 400
- Body small: 14/24, weight 400
- Label and button: 14/24, weight 600
- Caption and hint: 12/20, weight 400

Use responsive type where needed, but do not create many nearly identical sizes.
Do not use letter spacing or all-caps styling on Persian text.

## Spacing and Layout

- Base spacing unit: 4px.
- Preferred scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80.
- Breakpoints: Tailwind defaults (`sm` 640px, `md` 768px, `lg` 1024px,
  `xl` 1280px). Design for 360px phones first.
- Page gutter: 16px small screens, 24px medium screens, 32px large screens.
- Comfortable content width: 72rem maximum unless the page needs otherwise.
- Reading width: about 42rem for long text.
- Page anatomy: page header (title, primary action), then
  content sections separated by 32–48px. Keep the same header pattern on every
  product page.
- Use grid or flex layouts that collapse cleanly on narrow screens.
- Avoid fixed heights for text-heavy blocks.

## Shape, Border, Shadow, and Layers

- Radius small: 6px
- Radius medium: 10px
- Radius large: 16px
- Radius full: 9999px
- Default border: 1px using the semantic border token.
- Elevation: flat for page sections, a subtle shadow for cards that need
  lift, and a stronger shadow only for popovers, dialogs, and sheets.
- Never use shadow as the only boundary.
- Keep one consistent focus ring across interactive components.
- Layer order, from bottom to top: content, sticky headers, sheets and
  dialogs, dropdowns and popovers (so a menu opened inside a sheet or dialog is visible), toasts. Do not add ad-hoc z-index values.

## Iconography and Images

- Use the icon library selected by shadcn.
- Use one icon style and consistent stroke weight. Use 16px icons in small
  controls, 20px in medium controls, and 24px in standalone use.
- Directional icons (arrows, chevrons, back and next) must mirror in RTL.
  Icons that are not directional, such as check, search, and settings, do not.
- An icon-only button needs an accessible Persian name and a tooltip.
- Give meaningful images useful Persian alt text; decorative images use empty
  alt text.
- Render the shared logo through `src/components/brand/brand-logo.tsx`. Use
  `full` for splash and sign-in style screens, `icon` where space is tight
  (compact headers, avatars), and `text` for wide headers. Rule: the regular logo is used in the light theme and
  the white logo in the dark theme. `BrandLogo` does this by default
  (`tone="auto"`); pass `tone` only for a fixed-color surface. Keep clear space
  of about a quarter of the icon width; the files already include some padding.

## Motion

- Keep transitions short and calm, usually 150–250ms.
- Animate opacity and transform when possible.
- Respect reduced-motion preferences.
- Motion must explain state change, not delay the user.

## Component States

Every reusable interactive component should define applicable states:

- default, hover, active, focus-visible
- disabled
- loading
- error or invalid
- success or confirmation
- empty when the component presents a collection

Do not use color as the only signal. Pair it with text, an icon, or structure.

## Buttons and Action Spacing

- Build on the shadcn Button; do not replace it with unrelated button code.
- Provide a small, intentional set of attractive variants: primary, secondary,
  outline, ghost, destructive, soft, and icon-only where useful.
- Keep the primary action visually strongest. Secondary actions must remain
  clear without competing with it.
- Use consistent heights: about 36px small, 40–44px medium, and 48px large.
- Use balanced horizontal padding: about 12px small, 16px medium, and 20px
  large. Adjust only when the label or icon genuinely needs it.
- Keep about 8px between an icon and label. Use consistent icon sizes for each
  button size and align icon and text vertically.
- Keep 8–12px between adjacent buttons. Use 16px or more when separating action
  groups with different purposes. Buttons must never touch each other.
- In RTL, the primary action sits at the start of an action group, and the
  cancel or secondary action follows it.
- Support icon-before-label and icon-after-label correctly in RTL.
- Keep focus-visible, hover, active, loading, and disabled states distinct.
  A loading button keeps its width and shows a Spinner.
- Avoid excessive pills. Use the full radius only for deliberate compact
  actions, tags, or icon buttons.
- Use full-width buttons on small screens only when the layout benefits from it.

## Forms

- Build fields with Field, Label, and the matching control. Every control has
  a visible label; placeholders are examples, never labels.
- Order: label, control, short help text, then the error message below the
  control. Mark only the less common case: required or optional.
- Input, Select, and medium Button share the same height.
- Validate on submit and when a field loses focus, not on every keystroke.
  Show errors next to the field and summarize them at the top of long forms.
- Error messages say what is wrong and how to fix it, in polite Persian.
- Group related fields with a heading. Use one column on phones and at most
  two columns on wide screens.
- Use Checkbox for independent choices, RadioGroup for two to five exclusive
  choices, Select for longer lists, and Switch only for settings that apply
  immediately.

## Feedback and System States

- Loading: Skeleton for content that is coming, Spinner inside buttons and
  small areas, Progress when the share of completed work is known.
- Empty: the Empty pattern with a short title, one helpful sentence, and the
  next action when one exists.
- Error: an inline Alert near the problem with a retry action when possible.
  Use the error route only for a broken page.
- Success: a short Sonner toast for completed actions; never use a toast for
  information the user must read later.
- Destructive actions: AlertDialog that names the item and the consequence,
  with a destructive confirm button and a clear cancel.

## Navigation

- Use one consistent page header and, when the product needs it, one main
  navigation pattern. On phones, place main navigation in a Sheet.
- Tabs switch between views of the same subject; they do not navigate to
  unrelated pages.
- Breadcrumb appears only for pages deeper than two levels. Exception: the
  admin frame's top bar always shows «ادمین › current section».
- Admin frame pattern (`src/features/admin-shell`): sidebar at the start side
  from `lg` (open `w-64` with icon and name, collapsed `w-16` icon-only with
  Tooltip names; the collapsed state is temporary; the open/close button is an
  icon button in the top bar beside the breadcrumb, shown from `lg`), a Sheet
  from the start side
  below `lg`, and a sticky top bar with breadcrumb at the start and
  notifications, theme toggle, and sign-out at the end. The current item uses
  `aria-current="page"`, a tinted background, and a start-edge marker.
- User panel frame pattern (`src/features/user-shell`), matching the messenger
  platform: a dark navy sidebar at the start side from `lg` (open `w-72`,
  collapsed `w-[4.5rem]` icon-only; below `lg` the same sidebar is in a Sheet),
  with the logo in a bordered header, collapsible titled groups of items, and
  the recent conversations. The sidebar container carries the `dark` class, so
  everything inside uses the dark tokens in both themes; `--sidebar*` hold one
  navy in both themes. The current item is a light-blue pill
  (`sidebar-primary`) with `aria-current="page"`. The top bar is `bg-card` with
  a bottom border and holds the user, the search, the organization menu,
  notifications, a pill theme switch, and sign-out. The page background is the
  blue-gray `background`; cards stay white (`card`).
  The classic look (`classic` class on `<html>`, chosen in settings, temporary)
  restores the earlier frame: light sidebar, flat list, search in the sidebar,
  profile at the bottom, and no top bar from `lg`; its token overrides are
  `:root.classic` and `.dark.classic` in `globals.css`.
- DropdownMenu holds secondary actions; the primary action stays visible.
- Dropdown lists (Select, DropdownMenu, SearchableSelect) open below their
  control and flip above it when there is not enough room below; they never
  overlay the control and never leave the viewport. For long lists use
  `SearchableSelect` (`src/components/shared`): a Select whose popup starts
  with a search box (matches label and an optional hint such as an email) and
  shows an empty message when nothing matches. Search is opt-in per field; the
  default stays a plain Select.
- The current page or tab is visible without relying on color alone.

## Data Display

- Card groups related information; avoid cards inside cards.
- Table: header text aligned to the start, numbers aligned to the end with
  tabular figures, readable row height, and horizontal scrolling inside the
  table container only. On phones, switch to a stacked list when columns do
  not fit.
- DataTable (`src/components/shared/data-table`): the standard table for
  lists. Rounded bordered container, tinted header row, 56px rows, a last
  column with row actions: the primary action (such as «مشاهده جزئیات») is a
  visible outline button marked `inline`, placed beside a «⋯» menu that holds
  the remaining actions (destructive ones last, confirmed in an AlertDialog).
  Below `sm` the inline button shows only its icon with an accessible name.
  The «⋯» menu is omitted when no action remains in it. The footer with «نمایش X تا Y از Z»,
  a page-size Select, and first/previous/next/last buttons. Page and page size
  are temporary and reset on reload. Non-essential columns hide below `lg`.
- Badge shows short status text with one consistent meaning per color across
  the product.
- Avatar shows a fallback of initials or an icon when no image exists.

## Overlays

- Dialog: a clear title, one task, focus kept inside, and closing with Escape
  and the close button.
- Sheet: side panels and mobile navigation; it opens from the start side in
  RTL unless the pattern needs otherwise.
- Tooltip: short hints only, never essential information or actions.

## Content and Microcopy

- Voice: polite, warm, and direct. Address the user with «شما».
- Button labels are short verbs that name the result, such as «ذخیره» or
  «افزودن مشتری». Avoid vague labels such as «تأیید» when a clearer verb exists.
- Headings are short. Sentences are short and active.
- Do not blame the user in errors. Say what happened and what to do next.
- Use the product vocabulary from product.md consistently.

## Responsive and Accessible Behavior

- Start with the narrow layout, then expand.
- No horizontal page scroll at common phone widths.
- Interactive targets are at least 40px, preferably 44px, on touch screens.
- Every input needs a visible label or an accessible name.
- Keyboard focus must remain visible, and tab order follows reading order.
- Dialogs must keep focus, close predictably, and have a clear title.
- Text and controls must have readable contrast.

## Shared Component Inventory

Installed in `src/components/ui` (shadcn `base-nova` style on Base UI; RTL is
enabled in `components.json`). Exact exports per file:

- `direction`: DirectionProvider, useDirection
- `button`: Button, buttonVariants
- `input`: Input
- `label`: Label
- `textarea`: Textarea
- `field`: Field, FieldLabel, FieldDescription, FieldError, FieldGroup,
  FieldLegend, FieldSeparator, FieldSet, FieldContent, FieldTitle
- `select`: Select, SelectContent, SelectGroup, SelectItem, SelectLabel,
  SelectScrollDownButton, SelectScrollUpButton, SelectSeparator,
  SelectTrigger, SelectValue
- `checkbox`: Checkbox
- `radio-group`: RadioGroup, RadioGroupItem
- `switch`: Switch
- `card`: Card, CardHeader, CardFooter, CardTitle, CardAction,
  CardDescription, CardContent
- `badge`: Badge, badgeVariants
- `avatar`: Avatar, AvatarImage, AvatarFallback, AvatarGroup,
  AvatarGroupCount, AvatarBadge
- `table`: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow,
  TableCell, TableCaption
- `tabs`: Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants
- `breadcrumb`: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis
- `dropdown-menu`: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel,
  DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent
- `tooltip`: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- `dialog`: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter,
  DialogTitle, DialogDescription, DialogClose, DialogOverlay, DialogPortal
- `alert-dialog`: AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
  AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal
- `sheet`: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader,
  SheetFooter, SheetTitle, SheetDescription
- `alert`: Alert, AlertTitle, AlertDescription, AlertAction
- `sonner`: Toaster
- `progress`: Progress, ProgressTrack, ProgressIndicator, ProgressLabel,
  ProgressValue
- `spinner`: Spinner
- `skeleton`: Skeleton
- `empty`: Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent,
  EmptyMedia
- `separator`: Separator

Variant props exist on Button (variant, size, loading), Badge (including
success, warning, info), Alert (same), Empty (media), and Tabs (list).
`src/lib/utils.ts` exports `cn`. `src/components/shared` holds `page-header`,
`form-section`, `empty-state`, `theme-toggle`, `search-field`, and
`password-field`, `searchable-select`, `searchable-multi-select`,
`access-grants-panel` (who may use one item: groups plus users with special
access, generic and reusable), `back-link`, `entity-not-found`, and
`list-skeleton`; `src/components/brand`
holds `brand-logo`.

Implemented foundation:

- Tokens and type roles (`text-display`, `text-h1`..`text-h4`, `text-body-lg`,
  `text-body`, `text-body-sm`, `text-label`, `text-caption`), radii, shadows
  (`shadow-sm` for cards, `shadow-lg` for overlays), widths (`max-w-page`,
  `max-w-reading`), `page-gutter`, and layer utilities (`z-sticky`,
  `z-popover`, `z-modal`, `z-toast`) live in `src/app/globals.css`.
- Light and dark tokens are both complete, including success, warning, info,
  and chart-1..5 (dark: lighter primary with dark text, stepped surfaces).
- `cn` in `src/lib/utils.ts` is configured so type roles like `text-caption`
  are font sizes and never override a text color.
- Button variants: default (primary), secondary, outline, ghost, soft,
  destructive, link. Sizes: xs 32px, sm 36px, default 40px, lg 48px, and icon
  sizes. `loading` shows a Spinner and keeps the width. Input, Select
  trigger, and default Button are all 40px.
- Badge and Alert have success, warning, and info variants.
- Field puts the description after the control and the error last.
- Shared patterns in `src/components/shared`: `PageHeader` (title,
  description, primary action), `FormSection` (title, description, fields in
  one or two columns, optional actions), and `EmptyState` (built on Empty:
  icon, title, description, next action), plus `ThemeToggle` (light/dark switch),
  `SearchField` (search box with a leading icon above lists), and
  `PasswordField` (password input with show/hide).
- Dialog, AlertDialog, and Sheet footers stack with the primary action first
  on phones; close and sheet labels are Persian.
- Shared helpers: `src/lib/format.ts` (formatNumber, formatPrice,
  formatPercent, formatDate, formatDateTime with `fa-IR`) and
  `src/components/brand/brand-logo.tsx`.
- `SheetContent` defaults to `side="right"`, which is the start side in RTL.
  Its close button is 40px.
- Feature-level patterns (kept in their features until a second feature needs
  them): the admin frame in `src/features/admin-shell/components`, and the
  users list (table from `md` up, cards below) and the groups page (a bordered
  box with a fixed search row above selectable cards that show name, code,
  status, and member count but no description, beside a members panel), forms,
  and dialogs in `src/features/user-management/components` (
  status badges always carry text; deactivation uses AlertDialog; nothing is
  deleted). The models page (`src/features/models/components`) uses two tabs
  (models, providers), a switch for settings that apply at once, and a
  delete that names its consequence in an AlertDialog; `DataTable` columns can
  hide below `lg` or `xl`.

## Design-System Preview

Implemented at `/design-system` (internal, `noindex`). Route:
`src/app/design-system/page.tsx`; one section per file in
`src/features/design-system/components`; token reference data and the
contrast helper in `src/features/design-system/data` (contrast is measured live
from the CSS tokens in the current theme; changing a color in `globals.css`
needs no other edit). Order:

The `/design-system` route must show, in this order:

1. Brand: the three logo versions (regular in the light theme, white in the
   dark theme) in several sizes, font with its real weights, and brand colors.
2. Tokens: semantic and status colors with their contrast, Persian type
   roles, spacing scale, radii, borders, shadows, and the focus ring.
3. Persian text: half-space, Persian and Latin digits, formatted numbers,
   prices and dates, and mixed Persian and Latin text.
4. Actions: every Button variant and size, icon placement, loading and
   disabled buttons, and correct button-group spacing on narrow and wide
   screens.
5. Forms: every form control in default, focus, disabled, and invalid states,
   with labels, help text, and errors.
6. Feedback: Alert variants, toast, Progress, Spinner, Skeleton, and Empty.
7. Navigation and overlays: Tabs, Breadcrumb, DropdownMenu, Tooltip, Dialog,
   AlertDialog, Sheet, and a static sidebar and top bar example.
8. Data display: Card, Badge statuses, Avatar, and Table with its narrow
   layout.
9. Page patterns: page header, form section, and an empty page.

Every section works at 360px and on wide screens. This route is internal
reference material. Use neutral placeholder text only; it must not introduce
product features or product-specific sample content.

## Change Rule

When a shared token, font, brand asset, base component, or pattern changes,
update this file and `/design-system` in the same change. Prefer extending the
existing system over adding a one-off value.
