# Design tokens — extracted from Figma

Source: `get_variable_defs` on the Home `1:2084`, Services `1:2599` and Contact `1:2956` frames, and `get_design_context` on the hero text `1:2088` (2026-10-17).
The kit's variables are messy: duplicates, typos in names, leftovers from the base kit. Below is the **cleaned-up set**: the "Our name" column is what we set up in Elementor (V4 global variables), "In Figma" is the original name.

## Colors

| Our name | Value | In Figma | Used for |
|---|---|---|---|
| `color-primary` | `#4a00e6` | `Primery` (typo included!) | buttons, highlighted words, badge text, icons, video section background, timeline dot |
| `color-secondary` | `#fdb048` | `Secondery` | highlighted words, the orange "offset backing" under dark cards, Recommend badge, icons of the three features, ✨ sparkles |
| `color-secondary-text` | `#cc7f0c` | — (ours) | orange words in headings: contrast 3.18:1 instead of 1.83:1 for `#fdb048` (decision D17) |
| `color-secondary-light` | `#fedeac` | `Scondery-lite` | badge border, FAQ borders |
| `color-accent` | `#77408c` | `Accent` | icon tile in the timeline, social icons, dashed arcs on the map |
| `color-heading` | `#2d2d2d` | `Tokens/Feld/label` | headings |
| `color-text` | `#191919` | `Gray/950`, `Gray`, `Tokens/Butt/link/text/normal` | link buttons, main dark text |
| `color-black` | `#0e0e0e` | `Black` | |
| `color-muted` | `#6d6d6d` (`#888888` in the design) | `Gray/400` | subheadings (lead). #888 on white is 3.54:1, below AA; `#6d6d6d` is 5.17:1 (D17) |
| `color-body` | `#5d5d5d` | `Gray/600` | card text (verify per section) |
| `color-dark-surface` | `#2a2a2a`* | — | dark cards (problem, features, pricing). *Verify in the section cycle |
| `color-surface` | `#f7f7f7` | `Tokens/Background/defult`, `Gray/50` (#f6f6f6) | background of the "three cards" section, CTA |
| `color-white` | `#ffffff` | `White` (#fefefe), `Wight`, `Background color/primary` | |
| `color-border` | `#e7e7e7` | `Gray/100`, `Tokens/Dividers/Deflut` | dividers |
| `color-field-border` | `#d1d1d1` | `Tokens/Feld/Strock` | form fields |
| `color-field-focus` | `#6d6d6d` | `Tokens/Feld/Input/Foucs-strock` | focused field |
| `color-field-bg` | `#f6f6f6` | `Tokens/Feld/Placeohlder-bg` | |
| `color-placeholder` | `#b0b0b0` | `Tokens/Feld/Dscrabtion`, `Gray/300` | placeholders, field hints |

**Not used** (leftovers from the base kit that don't visibly appear in the design): `Primary` `#f90b34` and the whole red scale — `Tokens/Butt/Priamry/active` `#ff5c78`, `/Disabel` `#ff97a9`, `Tokens/Butt/Secondary/active` `#fff0f3`, `Primery/950` `#f299a8`, `Primery/200` `#ffc2cd`, `Destructive/50` `#fff1f2`. Hover/active states for the purple buttons aren't defined in the kit — we make our own (a darker primary).

Other grays from the kit (`Gray/700` #4f4f4f, `Gray/900` #3d3d3d, `Light-gray` #c8c8c8, `Gary` #f2f2f2) — set up only if they turn up in sections.

## Typography

The main font is **Quicksand** (Google Fonts, free). In places, the kit uses **Roboto** (the "Trusted by…" caption, the footer address, the Services hero subheading, the contact blocks on Contact) and a **Rubik** variable — this looks like an oversight by the kit author (see the questions in assessment).

| Our name | Size / line height | Weights in the design | In Figma |
|---|---|---|---|
| `display` | 64 / — | — (not found in the design) | `Display 2xl` |
| `h1` | 48 / 56 | Regular 400 + Bold 700 (highlighted words) | `Display xl` |
| `h2` | 36 / 44 | Bold 700; Regular 400 + Bold in "light" headings | `Display lg` |
| `h3` | 30 / 38 | Bold / Medium | `Display md` |
| `h4` | 24 / 32 | Bold | `Display sm` |
| `lead` | 22 / 30 | Medium 500 | `Display xs` |
| `text-xl` | 20 / 28 | Regular / Bold | `Text xl` |
| `text-lg` (body) | 16 / 24 | Regular / Medium / Bold | `Text lg` |
| `text-md` | 14 / 20 | Regular / Medium / SemiBold | `Text md` |
| `text-sm` | 12 / 18 | Bold | `Text sm` |
| `text-xs` | 10 / 16 | Regular | `Text xs` |

Figma token values sometimes differ from what's actually applied: for example, `Text sm/size` = 12, while the badge is actually 14/20. **Exact sizes for each section come from `get_design_context`, not from the variables.**

## Spacing

Kit scale: `XS` 4 · `S` 8 · `XXM` 12 · `XM` 14 · `M` 16 · `L` 18 · `XL` 20 · `XXL` 22 · `B` 24 · `XB` 26 · `F` 28 · `XF` 30 · `XXF` 32 · `spacing/20` 80 · `spacing/24` 96.

We set up a reduced scale: **4, 8, 12, 16, 24, 32, 48, 64, 80, 100** (+ 14, 20, 30 where the design can't be reproduced without them). Page rhythm per the design:
- content — **1312 px** in a 1440 frame (64 px side margins);
- section top padding — **100 px**; gap between sections on Services/Contact — **70 px**;
- inside blocks — 30–32 px.

## Radii, shadows, effects

- Buttons — **12**, badge — **14**, cards — ~16–24, video and large photos — 24–48 (verify per section).
- Shadow `Light/Drop Shadows Z200`: `0 0 20px #84848433`.
- The "orange offset backing" under dark cards isn't a shadow token but an offset block. We reproduce it with `box-shadow: -12px 12px 0 #fdb048`, without an extra element.
- Badge: `backdrop-filter: blur(13.5px)`, 1 px `color-secondary-light` border.

## Buttons (from `get_design_context` on the Home hero)

| Type | Styles |
|---|---|
| Primary | background `#4a00e6`, text `#fefefe` Quicksand Bold 16/24, padding 12/24, radius 12, height 48 |
| Link | no background, text `#191919` Quicksand Medium 16/24, underlined, same padding |
| Primary small (header) | 100×34, text 12–14 Bold — verify in the header section |

---

## In Elementor (foundation, 2026-10-17)

**V4 variables** (in CSS — `var(--<name>)`, also available in the theme's SCSS):
`color-primary` #4a00e6 · `color-primary-hover` #3b00b8 · `color-primary-soft` rgba(74,0,230,.4) (card borders) · `color-secondary` #fdb048 · `color-secondary-text` #cc7f0c · `color-secondary-light` #fedeac · `color-accent` #77408c · `color-heading` #2d2d2d · `color-text` #191919 · `color-black` #0e0e0e · `color-gray-700` #4f4f4f · `color-body` #5d5d5d · `color-muted` #6d6d6d · `color-placeholder` #888888 · `color-dark-surface` #2a2a2a · `color-on-dark` #f6f6f6 · `color-surface` #f7f7f7 · `color-white` #ffffff · `color-border` #e7e7e7 · `color-field-border` #d1d1d1 · `font-primary` Quicksand.

**Default Styles** (per tag, all with `font-primary`):

| Tag | Desktop | ≤1024 | ≤767 | Weight / color |
|---|---|---|---|---|
| h1 | 48/56 | 40/48 | 32/40 | 400 / heading |
| h2 | 36/44 | 32/40 | 28/36 | 700 / heading |
| h3 | 30/38 | 26/34 | 24/32 | 700 / heading |
| h4 | 24/32 | 22/30 | 20/28 | 700 / heading |
| p | 16/24 | — | — | 400 / body |

**Global classes** — in priority order (higher in the list wins):

| Class | Purpose |
|---|---|
| `section-header--center` | centered section header |
| `section-header` | badge + heading + text, column, spacing 32 (mobile 20) |
| `card--dark` | dark card: #2a2a2a + polygonal pattern (`card-mesh.svg`, full width, centered), radius 22, padding 32/28/24, orange offset backing `-12px 14px 0 #fdb048` (mobile `-8px 10px`) |
| `card--outline` | 1 px border, white background; in Elementor — `color-primary-soft`; on top of that, SCSS (`base/_card-outline`) draws the gradient border from the design: 18 % → 91 % `color-primary` at 126° |
| `card--elevated` | white, radius 16, shadow `0 2px 42px 16px rgba(0,0,0,.03)` |
| `card` | card base: column, padding 28/24/20, radius 14, gap 18 |
| `btn-small` | small button: 8/16, radius 8, 12/18. In Site Parts, don't combine it with another global class (D22) — the header uses `btn-primary` + local styles with the same values |
| `btn-primary` | purple button, hover #3b00b8 |
| `btn-link` | underlined link button |
| `text-on-dark` | text on a dark/purple background |
| `text-muted` | muted text |
| `heading-light` | Regular 400 heading ("Applications That Drive …") |
| `text-lead` | lead 22/30 → 20/28 → 18/26, Medium, `color-muted` |
| `text-xl` | 20/28 (mobile 18/26) — card text |
| `badge` | pill: 40 px, `color-secondary-light` border, 14 SemiBold purple text |
| `divider-gradient` | 382 × 1 line fading toward the ends |
| `bg-primary` | purple background, white text |
| `bg-surface` | light gray background |
| `section` | section: centered column, padding 100/72/56 |
| `container` | container: max 1440, side padding 64/32/20 (content 1312) |
| `link-underline` | contact link (a paragraph with a link): 14/20 SemiBold `color-heading`, purple on hover; purple underline and a 44 px touch target on phone — in SCSS `base/_links` |
| `btn-to-top` | round 52 px "back to top" button: purple, `color-on-dark` icon, `color-primary-hover` on hover and focus |
| `badge--on-dark` | badge on a dark/purple background: text and border `color-secondary-light`, 16/24 Bold (ranks above `badge` in priority) |
| `card--float` | "floating" white card: radius 16, padding 100/32 (≤1200: 56/28, mobile 40/24), everything centered, gap 26, shadow `0 2px 42px 16px rgba(0,0,0,.03)` |
| `card-stack` | hook for the overlapping-cards area: JS (`card-stack.js`) — click/focus brings a card to the front; ≤576 — a slider with dots (SCSS `base/_card-stack`) |
| `logo-tile` | logo image 140 × 56 (mobile 120 × 48), `object-fit: contain` |
| `panel-accent` | white panel with an orange offset backing (like `card--dark`): radius 22, padding 32/28/24, column, gap 30 |
| `logo-marquee` | wrapper for the logo row; on phone, JS + SCSS (`base/_logo-marquee`) turn the row inside into a scrolling marquee |
| `testimonial-carousel` | testimonial row, JS hook (`testimonials.js`): > 1024 — "coverflow", ≤ 1024 — a strip with dots (SCSS `base/_testimonials`); without JS and in the editor — a wrapping grid, gap 32 / 24 / 20 |
| `testimonial` | testimonial: column, `flex: 0 1 397px` |
| `testimonial-author` | author row above the quote panel: avatar + text, gap 16, padding 0 27 (≤1024: 0 20), overlaps the panel by 39 (mobile 30) |
| `testimonial-avatar` | avatar 95 × 92, radius 32, `object-fit: cover`, background `color-border` (mobile 72 × 70, radius 24) |
| `testimonial-meta` | name, role, company: wrapping row, gap 12 (≤1024: 2 — everything stacked) |
| `testimonial-name` | name 20/28 Bold `color-text` (mobile 18/26) |
| `testimonial-role` | role 14/20 Regular; the "\|" separator is a 2 px left border with 12 padding (≤1024 — no border, on its own line) |
| `testimonial-company` | company 14/20 Bold, always on its own line |
| `testimonial-card` | quote panel: `color-surface`, radius 48 / 40 / 32, padding 64/64/32 → 56/32/32 → 48/24/24 |
| `testimonial-quote` | quote 16/24 Medium `color-text`, max 600 |
| `timeline` | timeline track: 38 px column (mobile 24), padding for the dot 91/52 (≤1200: 37/24, ≤1024: 35/24, mobile 24/24); the dashed line — SCSS `base/_timeline` |
| `timeline-dot` | timeline dot 34 px (mobile 26), `color-primary`, circle, glow `0 1.43px 5.71px 5px #fedeac`; follows the scroll (`sticky`, SCSS) |
| `price-feature` | pricing plan item: 16/24, `color-dark-surface`, left padding 27; the purple dot — SCSS `base/_price-feature` (on a dark card + `text-on-dark`) |
| `faq-item` | FAQ item (`e-accordion-item`, `<details>`): 1 px `color-secondary` border, radius 14, white background; smooth expand — SCSS `base/_faq` |
| `faq-header` | FAQ item header (`<summary>`): padding 16/28 (mobile 14/20), gap 10 |
| `faq-question` | question: 24/32 Bold (22/30, 18/26), `color-dark-surface` |
| `faq-content` | answer container: padding 0 28 20 (mobile 0 20 16) |
| `faq-answer` | answer text: 16/24 `color-body` |

**Highlighting words in headings:** `<strong>` — purple, `<em>` — orange, `<b>` — plain bold (SCSS `src/scss/base/_highlights.scss`).
**Style guide:** the "Style Guide (internal)" draft (ID 59) — all tokens and classes on one page.
