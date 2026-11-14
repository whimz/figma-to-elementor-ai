# Design

## The design

- **Source:** [General Website UI Kit — Fully Responsive & Ready to Use](https://www.figma.com/community/file/1575073428722864118/general-website-ui-kit-fully-responsive-ready-to-use) (Figma Community).
- **Author:** **Sego** (Figma Community). Attribution for the portfolio: "Design: Sego (Figma Community, CC BY 4.0) · Development: Alexander S.".
- **License:** **CC BY 4.0**. The file page states no separate license, and free Figma Community files are published under CC BY 4.0 by default ([Figma Help Center](https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing)): they can be used and remixed, including commercially, with attribution. The author's description also says: "Feel free to duplicate, remix, or use it in your projects".
- **Working copy:** a duplicate of the kit in a private Figma team (not public); Figma MCP reads only this copy, not the Community page.

## What we use

- **Pages:** Home, Services, Contact. (The kit also has About Us, Blog Listing, Single Blog — for later.)
- **Kit features:** Auto Layout frames, color variables, local components.
- **Skipped in the first iteration:** prototype animations and video elements.

## Mobile version — we design it ourselves

The kit has no separate mobile designs. This is a deliberate choice: Upwork clients often provide only the desktop design.
General responsive rules are in [mobile-spec.md](mobile-spec.md) (created during the initial assessment, Stage 5.1). The concrete tablet and mobile layout of each section is agreed in the section-by-section cycle and recorded in [sections.md](sections.md).

## Working files

- [assessment.md](assessment.md) — initial assessment of all designs (Stage 5.1).
- [tokens.md](tokens.md) — design tokens extracted from Figma and cleaned up (Stage 5.1).
- [mobile-spec.md](mobile-spec.md) — general responsive rules (Stage 5.1).
- [sections.md](sections.md) — section tracker and the decisions for each section (Stages 5.1–5.3).
- `figma/ref/` — reference renders of the frames at 1440 px and per-section slices (`figma/ref/sections/`); `screens/` — Playwright screenshots. Neither folder is in git.

## Frames

| Page | Desktop (1440) | Node |
|----------|----------------|------|
| Home | Home | `1:2084`, 1440 × 8394 |
| Services | Servecies | `1:2599`, 1440 × 7239 |
| Contact | Conact US | `1:2956`, 1440 × 5052 |

All kit pages sit on a single file page, "Page 1" (`0:1`) — don't request it as a whole, only by frame node.
