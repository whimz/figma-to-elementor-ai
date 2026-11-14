# About Us and Blog Design Assessment (stage 5.5)

Date: 2026-11-14. Same kit and same Figma working copy as in [assessment.md](assessment.md).
Frames: **About US** `1:2416` (1440 × 6480), **post list** `1:2829` (1440 × 3939) and **single post** `1:2894` (1440 × 3297) — in the kit, the last two are both mistakenly named "Servecies".
Extracted: page structure (`get_metadata`, saved to `design/figma/page-metadata.xml`) and renders of the three frames — **5 Figma calls**. Reference renders: `design/figma/ref/about-1440.png`, `blog-1440.png`, `blog-single-1440.png` and per-section crops in `design/figma/ref/sections/` (not in git).
Nothing has been built yet. The decisions needed from you are in section 6.

---

## 1. Summary

- **About Us — 9 sections, 5 of which are already built on other pages** (testimonials, CTA, three bordered cards, footer, a hero like the one on Contact). New ones: three short benefits with icons, the team, a dark card with an award, and "Why choose us" as a zigzag with a line down the center.
- **The blog is a new kind of work: WordPress builds the pages, not Elementor.** The post list, categories, search and the single post are templates filled from posts. Elementor Free has no Theme Builder, so we do what we did for the header and footer: the templates are Site Parts built in Elementor, and post data is output by our own widgets.
- **Copy.** The designs are lorem again; "Tax Servces" on all twelve cards; typos "Our Tem", "Awred", "Filterations", "Why Redgraphs". We write our own copy and fix the typos, as on the home page.
- **Effort estimate:** About Us — about 2–2.5 h (including the German copy), blog — 3–4 h (templates, widgets, 8 demo posts in two languages, categories, SEO).

## 2. About Us — section inventory

| Code | Section | Node | Contents | Complexity | Reused from |
|-----|--------|------|------------|--------|-------------|
| A1 | Hero | `1:2444` | "Simplify" badge, h1 with purple and orange words, lead paragraph, "Learn More" / "Sign Up" buttons; photo on the right (two people at a desk), radius ~60 | S | C1 recipe (Contact hero) |
| A2 | "Why Legite is the Future of Cryptocurrency Intelligence" | `1:2456` | "About" badge, heading, three items: an orange tile with an icon, a caption, one line of text | S | section header, icons |
| A3 | Team ("Our Tem") | `1:2484` | badge, a row of cards: photo, name, role, 2–3 lines about the person, LinkedIn / X / Dribbble icons; the fourth card runs off the right edge | M | — (new `team-card` class) |
| A4 | "We Provide Smarter Decisions ✨" | `1:2490` | three cards with a gradient border, chevrons on the right | — | H9 recipe |
| A5 | Award ("Awred") | `1:2513` | dark card with an orange offset backing: "We know we can", three paragraphs, an "AWARDS" trophy image on the right | M | `card--dark`, like features S2–S4 |
| A6 | Testimonials | `1:2524` | | — | G4 recipe |
| A7 | "Why you Choose us" | `1:2535` | the same three steps as on the home page, but in a zigzag: illustration and text alternate, and the dashed line with the dot runs down the center | L | H8 assets and copy, new layout |
| A8 | CTA strip | `1:2590` | | — | G3 recipe |
| — | Footer | `1:2598` | | — | Site Part |

**What I propose for About Us:**

- **A1:** in the design, the h1 has the same text as the Services hero ("Tax Services for Cryptocurrency…"). h1 headings should differ from page to page (SEO), so I'll write new copy for About and keep the layout and the colored-word highlighting as in the design.
- **A2, A3:** in the design, the "About" and "Our Tem" badges are filled purple, like buttons. I'll use our single badge style (D32); "Our Tem" → "Our Team".
- **A3, layout:**
  - desktop — four cards in a row within the container (in the design, the fourth is cut off by the screen edge, which looks like a piece of a carousel);
  - tablet — 2 × 2;
  - phone — a swipeable strip with dots, like G6 and G4.
- **A3, social icons:** I keep LinkedIn and X; Dribbble doesn't suit a tax firm. The links point to the networks' home pages, as with the contacts (D34).
- **A4:** in the design, this is the same section as H9 on the home page (the same three headings). So that the pages don't repeat each other word for word, I suggest showing the company's values on About (e.g. Accuracy / Transparency / Security) in the same styling.
- **A7:**
  - the steps, illustrations and copy come from the home page (it's the same process); the layout is a zigzag, with the dot traveling along the center line, as on the home page;
  - tablet and phone — like H8 (line on the left, illustrations below the text);
  - "Why Redgraphs" badge → "Why Legite".
- **A5:** the trophy is an image from the design. We write our own copy about the recognition.

## 3. Blog — inventory

| Code | Section | Node | Contents | Complexity |
|-----|--------|------|------------|--------|
| B1 | List hero | `1:2857` | "Blogs" badge, h1 "Our Blogs for Cryptocurrency" (one purple and one orange word), lead paragraph, divider; polygonal mesh background | S (S1 recipe) |
| B2 | Post list | `1:2864` | left: "Filterations" (search, "Key Word", "Words: 1000 Word", source chips News / SEC / MRF, Enhanced / Discovered checkboxes); right: a 2 × 6 grid of 384 × 424 cards; pagination at the bottom "1 to 7 of 8,618 · Page 1 of 2" | L |
| B3 | Post | `1:2922` | left: a column of other posts (6 cards); right: an 899 px post: 851 × 324 image, date, title, lead paragraph, text, an inline image, video (like H5), text | L |

**Post card** (the same one on the list and in the post's side column):
- photo with a radius and a purple tint overlay;
- orange "Tax" category label;
- date (purple, small), title (purple), ↗ arrow, three lines of gray text.

**How I propose to build the blog:**

- **Templates.** Elementor Free has no Theme Builder, so the templates are two new Site Parts built in Elementor, like the header and footer (D18):
  - **"Blog archive"** — the post list. It also renders categories and search results;
  - **"Blog post"** — a single post.

  The theme outputs them on the blog, category, search and single post pages instead of its own templates. The client edits the design in Elementor, not in code.
- **Custom widgets** (classic ones, like Nav Menu and Company Info — MCP can't create any other kind):
  - **Post Grid** — cards from WordPress queries (list, category, search) with pagination. It also renders "other posts" in the post's side column;
  - **Archive Title** — the list's h1: on the blog home, text from the settings; in a category, its name; in search, "Search results for …";
  - **Post Header** — the post's image, category, date, title, lead paragraph;
  - **Post Content** — the post body from the post;
  - **Blog Sidebar** — search and the category list.

  Free has no dynamic tags for atomic elements, so post data can only be output by our own widgets.
- **Posts are written in the standard WordPress block editor.** It works for posts; the blank white canvas only happens on Elementor pages. The post body is styled by the theme: paragraphs, subheadings, lists, images, quotes, video.
- **The sidebar filters are real.** Post search and category chips with counts, styled as in the design. The "Words", "Sources", "Enhanced / Discovered" fields in the design don't mean anything — we don't build them.
- **Grid:** 3 columns on desktop (the design has 2, leaving an empty 210 px strip on the right). At 1025–1200 — 2 columns; on tablet, the sidebar collapses above the grid (search + category chips), 2 columns; on phone — 1.
- **Single post:**
  - in the markup, the post comes first, then the "other posts" column (the order in which a screen reader reads them and a search engine sees them);
  - ≥1025 — two columns, as in the design; ≤1024 — the post, with "More articles" below it in a 2 / 1 grid;
  - video in a post — the same player as in H5.
- **Categories:** **Tax** (like the label in the design), **Reports & Guides**, **Technology**. The last two are footer links that are currently empty (`#`); now they'll lead to the categories. "Insights" in the footer stays an anchor on the home page.
- **Demo posts:** 8 posts of 300–400 words each on crypto tax topics (what counts as a taxable event, cost basis, staking, DeFi, NFT, tax-loss harvesting, how AI sorts transactions, a year-end checklist). 6 per page, so the pagination is visible. German translations — 8 posts under `/de/`.
- **Small things:**
  - the default "Hello world!" post and the Uncategorized category are deleted;
  - comments on posts are disabled (the design has none);
  - on blog pages, the "Blog" menu item is highlighted;
  - posts get Yoast SEO titles and descriptions, Article markup and Yoast breadcrumbs.
- **German:**
  - a `/de/` blog page with a German slug (in Polylang Free, translations have different slugs — D37) and its own template Site Parts;
  - the categories are translated (Steuern / Berichte & Leitfäden / Technologie);
  - the German footer menu links to the German categories.

## 4. Assets

| What | Source | Figma calls |
|-----|--------|--------------|
| About hero photo (two people at a desk) | node export 2× | 1 call for all About images (`download_assets`) |
| "AWARDS" trophy (A5) | node export 2× | (in the same call) |
| Team portraits (A3) | export from the kit — or neutral placeholders (question 1) | (in the same call) |
| A2 icons and social icons | our own SVGs in the style of the ones already made (X is new) | — |
| Post images | see question 2 | — |

Exact styles of the new elements (team card, post card, sidebar, post typography) — `get_design_context` per node before building, ~4–5 calls. About 12 calls for the whole stage, out of 200 per day.

## 5. Risks

- **The blog means more theme code than everything done so far:** five widgets, post templates, post styles. We'll have to check both the WordPress output (categories, search, pagination, a 404 for a nonexistent list page) and the Elementor editor.
- **Polylang and post templates:** the list and the single post have their own Site Parts in each language; the language switcher on a post leads to its translation (if there isn't one — to the German blog). We test in both languages.
- **Volume of text:** 8 posts × 2 languages ≈ 6,000 words. That's most of the blog's time.
- **Portraits and photos with no clear source.** Where the kit's photos of people come from is unknown (the kit is licensed CC BY 4.0, but the author says nothing about the source photos). If clean rights matter — placeholders (question 1).

## 6. Questions for you

1. **Team portraits:** **(a)** photos from the kit — real faces, the page looks authentic; **(b)** neutral silhouette placeholders, like the testimonials. *I recommend (a):* for a portfolio, a team with faces looks stronger; the names and roles are fictional anyway. If you want no rights risk at all — (b).
2. **Post images:** **(a)** stills from free Coverr clips about crypto and finance (suitable license, on topic, 1080p) plus three photos from Services, with the purple tint from the design; **(b)** photos from the kit (oranges, a cliff, a bird, basketball — off topic). *I recommend (a).*
3. **Post list grid:** **(a)** 3 columns on desktop, filling the width; **(b)** 2 columns, as in the design (an empty strip on the right). *I recommend (a).*
4. **Sidebar filters:** real ones (search + categories) instead of the design's non-functional fields. *Recommended.*
5. **About, section A4:** company values instead of repeating H9 from the home page. *Recommended.*
6. **Order and mode:** About Us first, then the blog; I build each page in full without signing off each section (D32), with a report with screenshots and a batch of questions at the end of each page.
