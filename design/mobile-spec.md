# Responsive: general rules (stage 5.1)

The kit has no mobile designs, so the rules below define responsive behavior for all sections. Each section's specific layout is agreed in the 5.3 cycle and recorded in [sections.md](sections.md). If a section needs to deviate from a rule, that decision is recorded there as well.

## Breakpoints

| Device | Width | Test width (Playwright) | In Elementor V4 |
|---|---|---|---|
| Desktop | > 1200 | **1440** (design width) | base styles |
| Narrow desktop / iPad Pro landscape | 1025–1200 | **1100** | `@media(--tablet_extra)` |
| Tablet | 768–1024 | **768** | `@media(--tablet)` |
| Mobile | ≤ 767 | **375** | `@media(--mobile)` |

Elementor breakpoints (Site Settings → Layout): mobile 767, tablet 1024 and, since 2026-10-18, tablet_extra 1200 (the user's decision, decisions.md D21) — for sections that get cramped between tablet and the design width (the Home hero stacks). tablet_extra styles are inherited by tablet and mobile. The theme SCSS (`src/scss/tools/_breakpoints.scss`) only has 576 / 767 / 1024 for now. Intermediate widths (1025, 1180, 1280) are checked on every section.

## Container and rhythm

| | Desktop | Tablet | Mobile |
|---|---|---|---|
| Content width | max 1312 | 100 % | 100 % |
| Side padding | 64 | 32 | 20 |
| Section top / bottom padding | 100 | 72 | 56 |
| Gap between sections (Services, Contact) | 70 | 48 | 40 |
| Card inner padding | 28–32 | 24 | 20 |
| Card grid gaps | 30 | 24 | 16 |

## Typography

| Style | Desktop | Tablet | Mobile |
|---|---|---|---|
| H1 | 48 / 56 | 40 / 48 | 32 / 40 |
| H2 | 36 / 44 | 32 / 40 | 28 / 36 |
| H3 | 30 / 38 | 26 / 34 | 24 / 32 |
| H4 (card headings) | 24 / 32 | 22 / 30 | 20 / 28 |
| Lead | 22 / 30 | 20 / 28 | 18 / 26 |
| Body text | 16 / 24 | 16 / 24 | 16 / 24 |
| Small | 14 / 20 | 14 / 20 | 14 / 20 |

Rules: body text no smaller than 16 px; line breaks in headings are natural, with no forced `<br>`; colored words in H1 stay colored.
Set once in **Default Styles** (`h1`–`h4`, `p`) and in the `text-lead` class with `--tablet` and `--mobile` variants. Individual elements don't override the sizes.

## Typical reflows

| Desktop pattern | Tablet | Mobile |
|---|---|---|
| **Text + visual in 2 columns** (H1, H3, C1, C3, H8) | stacked: text on top, visual below at full width. Exception: if the visual is small (H8), it stays on the right | stacked, text on top |
| **Alternating sides** (S2–S4) | stacked, always text → photo (no alternation) | same |
| **Card overlapping a photo** (S2–S4) | overlap removed: photo on top, card below it with a −40 px negative margin | photo on top, card below it with no overlap |
| **3 cards in a row** (H4, H9) | 2 columns, the third at full width or on the next row | 1 column |
| **3 overlapping cards** (G6) | overlap removed, 1 column, the center (main) card first | 1 column |
| **Pricing** (S6) | 1 column, cards max 480, centered; the recommended one first | 1 column, the recommended one first |
| **Testimonial "carousel"** (G4) | horizontal swipeable strip (CSS scroll-snap), 2 cards visible | strip, 1 card visible plus the edge of the next one |
| **Logos in a row** (H2) | wrapping row, 3 + 2 | 2 columns or a swipeable strip |
| **Form + contacts + decoration** (C2) | contacts on top, form at full width, decorative panel removed | same |
| **Timeline** (H8) | the line stays on the left, illustrations scaled down to ~200 px | line on the left, illustration below the text (~160 px), or hidden if purely decorative |
| **Video** (H5) | 16:9 aspect ratio instead of 2.4:1 | 16:9, 64 px play button |

## Header and menu

- Desktop: logo + inline menu + Get Started button.
- Tablet and mobile (≤ 1024): logo + burger menu; the menu opens full screen or as a dropdown panel; the Get Started button moves inside the menu (on tablet it can stay next to the burger).
- Items in the open menu are at least 44 px tall; the active item is highlighted.
- The exact implementation depends on the header decision (5.2).

## Footer

Desktop: 4 columns → tablet: 2 × 2 → mobile: 1 column (logo, address and contacts, menu in 2 columns, "back to top" button on the right). The decorative squares are scaled down or removed on mobile.

## Buttons and interaction

- A "primary + link" button pair stays on one row if it fits. On mobile, if there isn't enough room — stacked, with the primary button at full width.
- Touch targets are at least 44 × 44 px: footer links and social icons get padding.
- Hover effects are duplicated with `:focus-visible`.

## Images and decoration

- Photos: `object-fit: cover`, fixed aspect ratio, WebP, `srcset` from WordPress.
- Heavy decoration (chevrons, honeycomb, diagonal lines, large background maps) is scaled down or hidden on mobile. Light patterns (mesh) stay.
- "Content" illustrations (the hero map, the AI chip) aren't hidden but scaled: on mobile the hero map goes below the text, at full width.

## Checks in the section cycle

Playwright screenshots at 1440, 768 and 375 (`design/screens/<page>-<section>-<width>.png`), with the desktop compared against the reference render from `design/figma/ref/sections/`. Also check separately:
- no horizontal scroll;
- no clipped text;
- overlaps don't break at 1024.
