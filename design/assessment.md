# Initial Design Assessment (stage 5.1)

Date: 2026-10-17. Design: General Website UI Kit (Sego, CC BY 4.0); working copy: a duplicate of the kit in a private Figma team.
Pages: **Home** `1:2084` (1440 × 8394), **Services** `1:2599` (1440 × 7239), **Contact** `1:2956` (1440 × 5052).
Extracted: structure (`get_metadata`), variables (`get_variable_defs`), frame renders, exact text styles of the Home hero (`get_design_context`) — **13 Figma calls** out of the 200-per-day limit. Tokens are in [tokens.md](tokens.md), sections in [sections.md](sections.md), responsive rules in [mobile-spec.md](mobile-spec.md).
Reference renders: `design/figma/ref/<page>-1440.png` and per-section crops in `design/figma/ref/sections/` (not in git — too heavy).

---

## 1. Summary

- **"Legite" brand:** purple `#4a00e6` + orange `#fdb048`, Quicksand font, lots of light background, subtle decorative patterns (polygonal mesh, dotted world map, dashed lines).
- **29 sections across three pages, but only 19 unique types.** Six sections repeat: header, footer, CTA, testimonials, FAQ and "three cards". The dark card with an orange offset backing appears 5 times.
- **Complexity:** 5 L sections (illustrations, overlaps, form, testimonials), 9 M, 5 S. A custom PHP widget isn't required; the debatable spots are the testimonial carousel and the map.
- **Main limitations of Elementor Free 4.3.5:**
  - **no Components** (`can_create: false`): repeated sections are rebuilt on every page, and consistency relies on global classes;
  - **no working form:** the atomic `e-form` in Free is a Pro upsell (`is_pro_promotion`);
  - **no atomic menus, carousel or map;**
  - **no Theme Builder** for the header and footer.
- **Questions for you** — section 8; the foundation (5.2) depends on the answers.

## 2. Design tokens (summary; details in tokens.md)

| Group | Result |
|---|---|
| Colors | primary `#4a00e6`, secondary `#fdb048`, secondary-light `#fedeac`, accent `#77408c`, headings `#2d2d2d`, text `#191919`, muted `#888`, background `#f7f7f7`, dark surface ~`#2a2a2a`, borders `#e7e7e7` / `#d1d1d1` |
| Junk in the kit | red `Primary` `#f90b34` with its scale — unused in the design; typos in names (`Primery`, `Secondery`, `Wight`, `Gary`) |
| Font | Quicksand 400/500/600/700; Roboto and Rubik in places (looks like an oversight by the author) |
| Type scale | 48/56 · 36/44 · 30/38 · 24/32 · 22/30 · 20/28 · 16/24 · 14/20 · 12/18 · 10/16 |
| Grid | 1440 frame, 1312 content (64 side margins), sections start with 100 px top padding, 70 px gaps |
| Radii | buttons 12, badge 14, cards 16–24, media 24–48 |
| Shadows | `0 0 20px #84848433`; orange offset backing — `box-shadow: -12px 12px 0 #fdb048` |

The Figma variables are wrong in places: for example, `Text sm/size` is 12 while the badge is set at 14. So exact values come from `get_design_context` for each section, and the variables serve only as a guide to the scale.

## 3. Section inventory

Complexity: **S** — standard elements, no decoration; **M** — card grid or patterned background; **L** — illustrations, overlaps, interactivity or a plugin.

### Shared (repeated across pages)

| Code | Section | Where | Contents | Complexity |
|---|---|---|---|---|
| G1 | Header | all | logo, 5 menu items (active one underlined), Get Started button | M |
| G2 | Footer | all | logo, address, phone/email (underlined), 2 menu columns, "back to top" button, decorative squares, copyright | M |
| G3 | CTA strip | all | heading 36 Regular, gradient divider, 2 buttons, mesh background | S |
| G4 | Testimonials | all | badge, H2, text; 5 cards as a "carousel" — the center one larger, the outer ones cropped | L |
| G5 | FAQ | Services, Contact | heading "Our FAQ ✨", 8 accordion items with an orange border | M |
| G6 | Three "Insights" cards | Home, Services | badge, H2, 3 overlapping white cards (the center one taller), mesh background | M |

### Home

| Code | Section | Contents | Complexity |
|---|---|---|---|
| H1 | Hero | badge, H1 with colored words, lead paragraph, divider, 2 buttons; dotted world map on the right with pins and dashed arcs | L |
| H2 | Logos | caption + 5 gray logos | S |
| H3 | "We See your Problem" | badge, H2, divider; dark card on the left (text + button), map on the right with 3 icon items | M |
| H4 | Innovation | white panel with an orange offset backing: badge, H2, 3 cards with a purple border (icon, heading, text), honeycomb decoration | M |
| H5 | Video | purple background, badge, heading, black video block with a play button, diagonal lines | M |
| H6 | = G6 | | |
| H7 | = G4 | | |
| H8 | "Why you Choose us" | badge, H2, text; timeline with a dashed line and a dot, 3 rows: heading, gradient dashed line, text + illustration on the right (icon tile, "AI Engine" chip, chart) | L |
| H9 | Three features | heading Regular+Bold ✨, 3 cards with a purple border and orange icons, dashed grid, chevrons | S |
| H10 | = G3 | | |

### Services

| Code | Section | Contents | Complexity |
|---|---|---|---|
| S1 | Hero | centered: badge, H1 with colored words, text, divider, 2 buttons; mesh background | S |
| S2–S4 | Features 1–3 | dark card (heading, text, button) overlapping a photo; sides alternate | M (one type ×3) |
| S5 | = G6 | | |
| S6 | Pricing | heading, 3 cards: light (list + price + button), dark with a Recommend badge and an orange offset backing, light "Customize?" | M |
| S7 | = G4 | | |
| S8 | = G3 | | |
| S9 | = G5 | | |

### Contact

| Code | Section | Contents | Complexity |
|---|---|---|---|
| C1 | Hero | left: badge, H1 with colored words, text, 2 buttons; right: photo with rounded corners | S |
| C2 | Contacts + form | left: heading, phone, email, social links; center: form (name, email, subject, message, button) on a white card; right: purple-and-orange decorative panel | L |
| C3 | Where we are | map (Google Maps screenshot) + "Where we are?" with two addresses and icons | M |
| C4–C6 | = G4, G3, G5 | | |

Unique types in total: **6 shared + 13 page-specific = 19**; **29** sections across the pages.

### Repeated elements (future global classes)

- **"Status" badge**: a pill with an orange border and purple text. Appears in almost every section.
- **Section header** (badge + H2 + text) — left-aligned or centered.
- **Buttons:** primary (purple), link (underlined), small (in the header).
- **Gradient divider** under headings: a 382 px line fading toward the ends.
- **Card with a purple border** — H4, H9, pricing.
- **Dark card with an orange offset backing** — H3, S2–S4, the middle pricing card.
- **White card with a shadow** — G6, form.
- **Patterned backgrounds:** polygonal mesh, dotted map, dashed grid, diagonal lines, chevrons, honeycomb.

## 4. Mapping to Elementor V4

### What we set up globally (foundation, 5.2)

1. **V4 global variables:**
   - colors — about 14 from tokens.md;
   - font — Quicksand;
   - sizes — the type scale and key spacing.
2. **Default Styles** (new in 4.3, set per tag: `h1–h6`, `p`, `a`): base typography from the scale, including tablet and mobile sizes. Headings and paragraphs look right without styles on each element.
3. **V4 global classes:**
   - layout: `section`, `container` (max 1312 + side padding), `section-header`, `section-header--center`;
   - text: `text-lead`, `text-highlight-primary`, `text-highlight-secondary`;
   - elements: `badge`, `btn-primary`, `btn-link`, `btn-small`, `divider-gradient`;
   - cards: `card`, `card--outline`, `card--dark`, `card--elevated`;
   - backgrounds: `bg-surface`, `bg-primary`, `bg-mesh`.

   I'll finalize the exact list in 5.2.

### What we build sections with

| Need | Elementor V4 element (Free) |
|---|---|
| Layout | `e-flexbox`, `e-div-block`, `e-grid` |
| Text | `e-heading`, `e-paragraph` (colored words — a `<span>` inside the heading) |
| Buttons and links | `e-button`, a link on an `e-flexbox`, `e-paragraph` |
| Images, icons, logos | `e-image` (raster, WebP), `e-svg` (vectors from the Media Library) |
| Divider | `e-divider` or a gradient background on an `e-div-block` |
| FAQ | `e-accordion` (native `<details>`, no JS) |
| Video | `e-youtube` or `e-self-hosted-video` |
| Overlaps (G6, S2–S4, C2) | `position` / negative margins / `e-grid` with overlapping items, `z-index` |
| Patterned backgrounds | SVG/WebP `background-image` from the Media Library |

### Where Free falls short, and the workarounds

| Need | In Free | Proposal |
|---|---|---|
| Header and footer on every page | Theme Builder is Pro | to be decided in 5.2: (a) the Header Footer Builder plugin (UAE/HFE) — Elementor templates + a menu widget with a burger menu; (b) Hello's built-in header and footer — too basic; (c) PHP in the child theme — the client can't edit it. **Leaning toward (a)**; I'll check compatibility with V4 and MCP |
| Navigation menu | no atomic menu; Nav Menu is Pro | the HFE menu widget |
| Form (C2) | `e-form` is a Pro upsell | Contact Form 7 or Fluent Forms (to be decided in 5.2), styled via the child theme's SCSS to match the tokens |
| Repeated sections (G3–G6) | Components is Pro | build them on every page with the same MCP "recipe", styles only via global classes. Downside: a text edit has to be made in 2–3 places (write down rules for the client) |
| Testimonial carousel (G4) | no atomic one; Testimonial Carousel is Pro | question 4: a static layout on desktop + CSS scroll-snap on mobile (no JS), or a slider as a custom widget |
| Map (C3) | no atomic one; the classic Google Maps widget exists, but MCP can't edit V3 widgets | question 6: a map image linking to Google Maps (V4, editable) or the classic widget (inserted by hand) |
| Timeline dot animation (H8) | V4 interactions exist (`interactions` in MCP) | skip animations in the first iteration (design/README); later — V4 interactions or a CSS animation in the theme's SCSS |

A custom PHP widget is **not needed** at this stage. The candidate for one is the testimonial slider, if we go for a "real" carousel.

## 5. Assets to export

Exported as we go through the section cycle (`download_assets`: vector SVGs + source images). They go into the Media Library via WP-CLI `wp media import`: MCP doesn't upload media.

| Type | What | Format |
|---|---|---|
| Logos | Legite (header, footer), Webflow / Relume (H2) | SVG |
| Illustrations | map with pins and arcs (H1), dotted map (H3), "AI Engine" chip, chart, icon tile (H8), the form's decorative panel (C2) | SVG if the export is clean, otherwise WebP |
| Patterned backgrounds | polygonal mesh (dark cards, G6, G3, S1), diagonal lines (H5), chevrons, honeycomb, dashed grid, footer squares | SVG (lightweight) |
| Icons | database, trend, "AI✨", nodes, flag, crop, menu, play, arrow up, FAQ chevron, address pin, Facebook / Instagram / LinkedIn | SVG |
| Photos | 3 Services feature photos, photo of phones (C1), map (C3), testimonial avatars (placeholders) | WebP |
| Font | Quicksand 400/500/600/700 | Google Fonts via Elementor; enable local font loading if Free has it (GDPR) |

The kit's photos are stock images: check their license before publishing to the portfolio (the kit is CC BY 4.0, and the author is credited in the README).

## 6. Accessibility and contrast (WCAG AA)

| Pair | Contrast | Result |
|---|---|---|
| headings `#2d2d2d` on white | 13.8:1 | ✅ |
| white on purple (buttons, H5) | 8.6:1 | ✅ |
| purple text on white | 8.6:1 | ✅ |
| lead `#888` on white | **3.54:1** | ❌ 22 px Medium text needs 4.5:1 → I suggest `#6d6d6d` (5.17:1), visually almost identical |
| orange words `#fdb048` on white | **1.83:1** | ❌ fails even the large-text threshold (3:1). Question 3 |
| placeholders `#b0b0b0` | 2.17:1 | ⚠️ a placeholder doesn't replace a label (the fields do have labels), but it's better darker |
| text on the orange Recommend badge `#2d2d2d` | 7.5:1 | ✅ |

Other points: heading hierarchy — one H1 per page, section headings are H2; decorative images get an empty alt; social icons get text labels for screen readers; the FAQ built on `<details>` is keyboard-accessible.

## 7. Risks

1. **Overlaps** (G6 — overlapping cards, S2–S4 — a card over a photo, C2 — the form over a panel) are built in Elementor with absolute positioning or negative margins. On tablet and mobile we turn them off (see mobile-spec).
2. **Vector illustrations** (map with pins, chip, chart) may export as heavy SVGs. In that case — WebP 2× at a reasonable file size.
3. **Repeated sections without Components:** the copies may drift apart as they're edited. Minimized with global classes; each section's recipe is recorded in sections.md.
4. **Elementor MCP is young (4.3.x):** its changelog includes MCP fixes. Builds may fail — we log it and fix small things by hand in the editor.
5. **The content is lorem ipsum** with the author's typos ("Proplem", "FQA", "yo u"). These are placeholders and easy to replace.
6. **Header and footer via a third-party plugin:** need to check whether MCP can edit its templates (they are Elementor documents of their own post type).

## 8. Questions for you

1. **Tokens:** do we set up a cleaned-up set with our own names (`primary`, `secondary`…) and leave the Figma junk (red scale, typos) behind? *Recommended — yes.*
2. **Fonts:** Roboto and Rubik in a few places (logo caption, footer address, Services subheading, contact blocks on Contact — which also use a dark blue that isn't in the palette) are a kit oversight. Do we unify on Quicksand and the palette colors? *Recommended — yes.*
3. **Orange words in headings** (contrast 1.83:1): (a) keep them as in the design — it's a recognizable brand device; (b) darken the orange for text only, to a contrast of ≥ 3:1 — `#cc7f0c` (3.18:1, closest to the brand; `#b86e00` — 3.99:1 with headroom), keeping `#fdb048` for backgrounds and offset backings. 48 and 36 Bold headings count as "large text", where the threshold is 3:1. *I recommend (b)*: "accessible" is a strong argument for a portfolio, and the visual difference is small.
4. **Testimonials:** (a) a static layout on desktop + swipe (CSS scroll-snap) on mobile, no JS; (b) a real slider — a custom widget with Swiper (Elementor already ships it). *I recommend (a)* — simpler, editable, zero JS.
5. **Video (H5):** design/README already settles this — video elements and prototype animations are skipped in the first iteration. I'll build a static block as in the design (a black panel with a play button); later it can be swapped for `e-youtube` with a single link. Same for the timeline dot animation (H8): static. Please confirm, or tell me if there actually is a video.
6. **Map (C3):** (a) a map image with an "Open in Google Maps" link — atomic, editable, fast; (b) a live map via the classic Google Maps widget — inserted by hand, MCP can't edit it. *I recommend (a).*
7. **Menu:** the design has 5 items (Home, About Us, Service, Blogs, Contact Us), but we're building 3 pages. Should About and Blogs point to `#`, or be removed? *I recommend keeping the items as in the design, with placeholder links* — the menu looks complete in the portfolio.
8. **Lead text `#888` → `#6d6d6d`** for contrast — OK?
9. **Typos in the design copy** (Proplem, FQA, Servecies) — fix them during the build? *Recommended — yes.*

### Answers (2026-10-17) — assessment accepted

All 9 recommendations accepted: (1) cleaned-up tokens; (2) Quicksand and palette colors only; (3) orange for text `#cc7f0c`, backgrounds and offset backings `#fdb048`; (4) testimonials — static layout + CSS swipe on mobile; (5) video and timeline animation — static; (6) map — an image with a Google Maps link; (7) About and Blogs in the menu — placeholder links; (8) lead `#6d6d6d`; (9) typos get fixed.
In addition: **header and footer** — our own mini Theme Builder in the child theme (Elementor templates output by the theme), with the HFE plugin as a fallback if the check in 5.2 fails; **form** — Contact Form 7. Recorded in decisions.md, D17.

## 9. Proposed order of work

1. **Foundation (5.2):** variables and Default Styles → global classes → header/footer and form decision → import shared assets (logos, patterns, icons) → drafts of Home, Services, Contact.
2. **Shared sections first:** G1 header → G2 footer. From then on, the first section of each type sets the style reference.
3. **Home, top to bottom:** H1 → H2 → H3 → H4 → H5 → G6 → G4 → H8 → H9 → G3. G3, G4 and G6 are built for the first time on Home.
4. **Services:** S1 → S2–S4 (one recipe ×3) → S6 → G5 (first time) → repeats of G6, G4, G3.
5. **Contact:** C1 → C2 (form) → C3 → repeats of G4, G3, G5.

**Time estimate** — to be refined after the first sections and tracked in the log: S ~20–30 min, M ~45–60 min, L ~1.5–2 h per section, including self-review and fixes.
